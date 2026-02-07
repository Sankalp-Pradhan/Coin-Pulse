'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CoinDetailsData, OHLCData } from '@/types';
import { convertOHLCData } from '@/lib/utils';
import { CoinDetails } from './CoinDetails';
import { OrderBook } from './OrderBook';
import { Separator } from '../ui/separator';
import CandleStickCharts from '../CandleStickCharts';

interface TrendOverviewProps {
  coin: CoinDetailsData;
  coinOHLCData: OHLCData[];
}

type TimeFrame = 'Daily' | 'Monthly' | 'Yearly';

const timeFrameToDays: Record<TimeFrame, number> = {
  Daily: 1,
  Monthly: 30,
  Yearly: 365,
};

export function TrendOverview({ coin, coinOHLCData }: TrendOverviewProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<TimeFrame>('Daily');
  const [chartData, setChartData] = useState<OHLCData[]>(coinOHLCData);
  const [loading, setLoading] = useState(false);
  const [chartLoaded, setChartLoaded] = useState(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  /* ---------------------------------------------
     Fetch OHLC data when timeframe changes
  ----------------------------------------------*/
  useEffect(() => {
    const fetchChartData = async () => {
      if (selectedTimeFrame === 'Daily') {
        setChartData(coinOHLCData);
        return;
      }

      setLoading(true);
      try {
        const days = timeFrameToDays[selectedTimeFrame];
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin.id}/ohlc?vs_currency=usd&days=${days}`
        );

        if (!res.ok) {
          throw new Error(`OHLC fetch failed: ${res.status}`);
        }

        const data: OHLCData[] = await res.json();
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedTimeFrame, coin.id, coinOHLCData]);

  /* ---------------------------------------------
     Initialize / Update Chart
  ----------------------------------------------*/
  useEffect(() => {
    let isMounted = true;
    setChartLoaded(false);

    let handleResize: () => void;

    const initChart = async () => {
      if (!chartContainerRef.current || chartData.length === 0) return;

      try {
        const { createChart, ColorType, CandlestickSeries } = await import('lightweight-charts');

        if (!isMounted) return;

        // Remove old chart
        if (chartInstanceRef.current) {
          chartInstanceRef.current.remove();
          chartInstanceRef.current = null;
        }

        // Create chart
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: '#1a2027' },
            textColor: '#a3aed0',
          },
          grid: {
            vertLines: { color: '#1e2833' },
            horzLines: { color: '#1e2833' },
          },
          width: chartContainerRef.current.clientWidth,
          height: 400,
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
            rightBarStaysOnScroll: true,
          },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
          upColor: '#2ebe7b',
          downColor: '#ff685f',
          borderUpColor: '#2ebe7b',
          borderDownColor: '#ff685f',
          wickUpColor: '#2ebe7b',
          wickDownColor: '#ff685f',
        });

        candlestickSeries.setData(convertOHLCData(chartData));
        chart.timeScale().fitContent();

        chartInstanceRef.current = chart;
        setChartLoaded(true);

        // Resize handler
        handleResize = () => {
          if (chartContainerRef.current && chartInstanceRef.current) {
            chartInstanceRef.current.applyOptions({
              width: chartContainerRef.current.clientWidth,
              height: 400,
            });
          }
        };

        window.addEventListener('resize', handleResize);
      } catch (err) {
        console.error('Error initializing chart:', err);
      }
    };

    initChart();

    return () => {
      isMounted = false;
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [chartData]);


  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1m');
  /* ---------------------------------------------
     UI
  ----------------------------------------------*/
  return (
    <div id="coin-overview">
      <CandleStickCharts
        coinId={coin.id}
        data={coinOHLCData}
        liveInterval={liveInterval}
        setLiveInterval={setLiveInterval}
      />


      {/* <div id="candlestick-chart">
        <div className="chart-header">
          <div className="header">
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={56}
              height={56}
              className="rounded-full"
            />
            <div className="info">
              <p>{coin.symbol.toUpperCase()}</p>
              <h1>{coin.name}</h1>
            </div>
          </div>

          <div className="button-group">
            {(['Daily', 'Monthly', 'Yearly'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeFrame(tf)}
                disabled={loading}
                className={
                  selectedTimeFrame === tf
                    ? 'config-button-active'
                    : 'config-button'
                }
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-dark-500/50 flex items-center justify-center z-10 rounded-xl">
              <p className="text-purple-100">Loading chart data...</p>
            </div>
          )}

          {!chartLoaded && !loading && (
            <div className="absolute inset-0 bg-dark-500/50 flex items-center justify-center z-10 rounded-xl">
              <p className="text-purple-100">Initializing chart...</p>
            </div>
          )}

          <div ref={chartContainerRef} className="chart" />
        </div>
      </div> */}
      <Separator className='mt-5' />
      <CoinDetails coin={coin} />
      <Separator className='mt-5' />
      <OrderBook coinId={coin.id} />
    </div>
  );
}
