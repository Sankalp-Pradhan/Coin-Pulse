'use client';

import { useState, useEffect } from 'react';
import { OrderBookEntry } from '@/types';
import { cn } from '@/lib/utils';

interface OrderBookProps {
  coinId: string;
}

interface TickerData {
  market: {
    name: string;
    identifier: string;
  };
  last: number;
  volume: number;
  converted_last: {
    btc: number;
    eth: number;
    usd: number;
  };
  converted_volume: {
    btc: number;
    eth: number;
    usd: number;
  };
  bid_ask_spread_percentage: number;
}

export function OrderBook({ coinId }: OrderBookProps) {
  const [orderBookData, setOrderBookData] = useState<OrderBookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/tickers?include_exchange_logo=false&depth=true`
        );


        if (!response.ok) {
          console.error('Order book fetch failed', response.status);
          setOrderBookData([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        if (!data.tickers || !Array.isArray(data.tickers)) {
          console.error('Invalid order book data');
          setLoading(false);
          return;
        }


        // Transform ticker data into order book entries
        const entries: OrderBookEntry[] = data.tickers
          .slice(0, 10) // Get first 10 tickers
          .map((ticker: TickerData, index: number) => ({
            price: ticker.converted_last.btc,
            amount_btc: ticker.converted_volume.btc,
            amount_eth: ticker.converted_volume.eth,
            type: index % 2 === 0 ? 'buy' : 'sell', // Alternate between buy and sell
          }));

        setOrderBookData(entries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order book:', error);
        setLoading(false);
      }
    };

    fetchOrderBook();
  }, [coinId]);

  if (loading) {
    return (
      <div className="w-full mt-8 space-y-4">
        <h4 className="text-xl md:text-2xl font-semibold mb-2">Order Book</h4>
        <div className="bg-dark-500 rounded-xl p-5">
          <p className="text-purple-100">Loading order book...</p>
        </div>
      </div>
    );
  }

  if (orderBookData.length === 0) {
    return (
      <div className="w-full mt-8 space-y-4">
        <h4 className="text-xl md:text-2xl font-semibold mb-2">Order Book</h4>
        <div className="bg-dark-500 rounded-xl p-5">
          <p className="text-purple-100">No order book data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-8 space-y-4">
      <h4 className="text-xl md:text-2xl font-semibold mb-2">Order Book</h4>

      <div className="bg-dark-500 rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 gap-4 px-5 py-4 border-b border-dark-400">
          <div className="text-purple-100 text-sm font-medium">Price (BTC)</div>
          <div className="text-purple-100 text-sm font-medium text-center">Volume (BTC)</div>
          <div className="text-purple-100 text-sm font-medium text-right">Volume (ETH)</div>
        </div>

        <div className="divide-y divide-dark-400 ">
          {orderBookData.map((entry, index) => (
            <div
              key={index}
              className={cn(
                'grid grid-cols-3 gap-4 px-5 py-4 rounded-lg pb-4 mt-2 hover:bg-dark-400 transition-colors duration-200',
                entry.type === 'buy' ? 'bg-[#126330]' : 'bg-[#632320]'
              )}
            >
              <div className={cn(
                'font-medium',
                entry.type === 'buy' ? 'text-[#2ebe7b]' : 'text-red-500'
              )}>
                {entry.price.toFixed(6)}
              </div>
              <div className="text-center font-medium">{entry.amount_btc.toFixed(4)}</div>
              <div className="text-right font-medium">{entry.amount_eth.toFixed(4)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}