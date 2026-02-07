'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SimilarCoin } from '@/types';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';

interface SimilarCoinsProps {
  coinId: string;
  category?: string;
}

export function SimilarCoins({ coinId, category }: SimilarCoinsProps) {
  const [similarCoins, setSimilarCoins] = useState<SimilarCoin[]>([]);
  const [sortBy, setSortBy] = useState('market_cap');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarCoins = async () => {
      try {
        // Fetch coins by market cap (you can also use category if available)
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
        );


        if (!response.ok) {
          throw new Error(
            `Similar coins failed: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // Filter out the current coin and take top 5
        const filtered: SimilarCoin[] = data
          .filter((coin: any) => coin.id !== coinId)
          .slice(0, 5)
          .map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            image: coin.image,
            current_price: coin.current_price,
            price_change_percentage_24h: coin.price_change_percentage_24h || 0,
          }));

        setSimilarCoins(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching similar coins:', error);
        setLoading(false);
      }
    };

    fetchSimilarCoins();
  }, [coinId]);

  // Sort coins based on selected criteria
  const sortedCoins = [...similarCoins].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.current_price - a.current_price;
      case 'change':
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      default: // market_cap or popular
        return 0; // Already sorted by market cap from API
    }
  });

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xl md:text-2xl font-semibold">Similar Coins</h4>
        </div>
        <div className="bg-dark-500 rounded-xl p-5">
          <p className="text-purple-100">Loading similar coins...</p>
        </div>
      </div>
    );
  }

  if (similarCoins.length === 0) {
    return (
      <div className="w-full space-y-4">
        <h4 className="text-xl md:text-2xl font-semibold">Similar Coins</h4>
        <div className="bg-dark-500 rounded-xl p-5">
          <p className="text-purple-100">No similar coins available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xl md:text-2xl font-semibold">Similar Coins</h4>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32 bg-dark-500 border-dark-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-dark-500">
            <SelectItem value="market_cap">Popular</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="change">Change</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {sortedCoins.map((coin) => {
          const isTrendingUp = coin.price_change_percentage_24h > 0;
          return (
            <Link
              key={coin.id}
              href={`/coins/${coin.id}`}
              className="flex items-center justify-between p-4 bg-dark-500 hover:bg-dark-400 rounded-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={coin.image}
                  alt={coin.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{coin.name}</p>
                  <p className="text-sm text-purple-100 uppercase">{coin.symbol}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">{formatCurrency(coin.current_price)}</p>
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  isTrendingUp ? 'text-green-400' : 'text-red-500'
                )}>
                  {isTrendingUp ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  {formatPercentage(Math.abs(coin.price_change_percentage_24h))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}