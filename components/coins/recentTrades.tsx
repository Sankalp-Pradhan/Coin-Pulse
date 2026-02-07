'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RecentTradesProps {
  coinId: string;
}

interface TickerData {
  market: {
    name: string;
  };
  last: number;
  volume: number;
  timestamp: string;
  converted_last: {
    usd: number;
  };
  converted_volume: {
    eth: number;
  };
}

interface TradeDisplay {
  time: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
}

export function RecentTrades({ coinId }: RecentTradesProps) {
  const [tradesData, setTradesData] = useState<TradeDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTrades = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/tickers?include_exchange_logo=false`
        );
        const data = await response.json();

        // Transform ticker data into trade entries
        const trades: TradeDisplay[] = data.tickers
          .slice(0, 10) // Get first 10 tickers
          .map((ticker: TickerData, index: number) => {
            const timestamp = new Date(ticker.timestamp);
            const time = timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            });

            return {
              time,
              price: ticker.converted_last.usd,
              amount: ticker.converted_volume.eth,
              type: index % 2 === 0 ? 'buy' : 'sell',
            };
          });

        setTradesData(trades);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent trades:', error);
        setLoading(false);
      }
    };

    fetchRecentTrades();
  }, [coinId]);

  if (loading) {
    return (
      <div className="w-full mt-8 space-y-4">
        <h4 className="text-xl md:text-2xl font-semibold mb-2">Recent Trades</h4>
        <div className="bg-dark-500 rounded-xl p-5">
          <p className="text-purple-100">Loading recent trades...</p>
        </div>
      </div>
    );
  }

  if (tradesData.length === 0) {
    return (
      <div className="w-full mt-8 space-y-4">
        <h4 className="text-xl md:text-2xl font-semibold mb-2">Recent Trades</h4>
        <div className="bg-dark-500 rounded-xl p-5">
          <p className="text-purple-100">No trade data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-8 space-y-4">
      <h4 className="text-xl md:text-2xl font-semibold mb-2">Recent Trades</h4>

      <div className="bg-dark-500 rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 gap-4 px-5 py-4 border-b border-dark-400">
          <div className="text-purple-100 text-sm font-medium">Time</div>
          <div className="text-purple-100 text-sm font-medium text-center">Price (USD)</div>
          <div className="text-purple-100 text-sm font-medium text-right">Volume (ETH)</div>
        </div>

        <div className="divide-y divide-dark-400">
          {tradesData.map((trade, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 px-5 py-4 hover:bg-dark-400/50 transition-colors"
            >
              <div className="text-purple-100 text-sm">{trade.time}</div>
              <div className={cn(
                'font-medium text-center',
                trade.type === 'buy' ? 'text-green-400' : 'text-red-500'
              )}>
                ${trade.price.toFixed(2)}
              </div>
              <div className="text-right font-medium">{trade.amount.toFixed(4)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}