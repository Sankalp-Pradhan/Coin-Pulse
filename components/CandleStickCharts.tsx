
"use client"

import { getCandlestickConfig, getChartConfig, Period, PERIOD_BUTTONS, PERIOD_CONFIG } from '@/constants';
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useEffect, useRef, useState, useTransition } from 'react'
import { fetcher } from '@/lib/coingecko.actions';
import { convertOHLCData } from '@/lib/utils';
import { CandlestickChartProps, OHLCData } from '@/types';

const CandleStickCharts = ({
    children,
    data,
    coinId,
    height = 360,
    initialPeriod = '1D',
}: CandlestickChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [period, setPeriod] = useState<Period>(initialPeriod);
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending, startTransition] = useTransition();
    const [lastFetchTime, setLastFetchTime] = useState<Record<string, number>>({});

    const fetchOHLCData = async (selectedPeriod: Period) => {
        try {
            // Check if we recently fetched this period (cache for 30 seconds)
            const now = Date.now();
            const lastFetch = lastFetchTime[selectedPeriod] || 0;
            if (now - lastFetch < 30000) {
                console.log('Using cached data for', selectedPeriod);
                return;
            }

            const config = PERIOD_CONFIG[selectedPeriod];

            const newData = await fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
                vs_currency: 'usd',
                days: config.days,
                precision: 'full',
            },
                300
            )

            setOhlcData(newData ?? []);
            setLastFetchTime(prev => ({ ...prev, [selectedPeriod]: now }));
        } catch (e) {
            console.error("Failed to fetch OHLC DATA", e)
        }
    }
    const handlePeriodChange = (newPeriod: Period) => {
        if (newPeriod === period) return;

        startTransition(async () => {
            setPeriod(newPeriod);
            await fetchOHLCData(newPeriod);
        })
    }

    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const showTime = ['1D', '1W', '1M'].includes(period);
        const chart = createChart(container, {
            ...getChartConfig(height, showTime),
            width: container.clientWidth,
        })

        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

        const convertedToSeconds = ohlcData.map((item) =>
            [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
        )

        series.setData(convertOHLCData(convertedToSeconds));
        chart.timeScale().fitContent();

        chartRef.current = chart;
        candleSeriesRef.current = series;

        const observer = new ResizeObserver((entries) => {
            if (!entries.length) return;
            chart.applyOptions({ width: entries[0].contentRect.width });
        })
        observer.observe(container)

        return () => {
            observer.disconnect()
            chart.remove();
            chartRef.current = null;
            candleSeriesRef.current = null;
        }
    }, [height, period, ohlcData])

    useEffect(() => {
        if (!candleSeriesRef.current) return;

        const convertedToSeconds = ohlcData.map((item) =>
            [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
        )

        const converted = convertOHLCData(convertedToSeconds);
        candleSeriesRef.current.setData(converted);
        chartRef.current?.timeScale().fitContent();
    }, [ohlcData])

    return (
        <div id='candlestick-chart'>
            <div className='chart-header'>
                <div className='flex-1'>{children}</div>
                <div className='button-group'>
                    <span className='text-sm mx-2 font-medium text-purple-100/50'>Period:</span>
                    {PERIOD_BUTTONS.map(({ value, label }) => (
                        <button key={value}
                            className={period === value ? 'config-button-active' : 'config-button'}
                            onClick={() => handlePeriodChange(value)}
                            disabled={isPending}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div ref={chartContainerRef} className="chart" style={{ height }} />

        </div>

    )
}

export default CandleStickCharts