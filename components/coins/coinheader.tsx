import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { CoinDetailsData } from '@/types';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';

interface CoinHeaderProps {
  coin: CoinDetailsData;
}

export function CoinHeader({ coin }: CoinHeaderProps) {
  const priceChange24h = coin.market_data.price_change_percentage_24h_in_currency?.usd || 0;
  const priceChange30d = coin.market_data.price_change_percentage_30d_in_currency?.usd || 0;
  const isTrendingUp24h = priceChange24h > 0;
  const isTrendingUp30d = priceChange30d > 0;

  return (
    <div id="coin-header">
      <h3>{coin.name}</h3>

      <div className="info">
        <Image
          src={coin.image.large}
          alt={coin.name}
          width={77}
          height={77}
          className="rounded-full"
        />
        <div className="price-row">
          <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          <Badge
            className={cn(
              'badge',
              isTrendingUp24h ? 'badge-up' : 'badge-down'
            )}
          >
            {isTrendingUp24h ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
            {formatPercentage(Math.abs(priceChange24h))}
          </Badge>
        </div>
      </div>

      <ul className="stats">
        <li>
          <span className="label">Today</span>
          <div className="value">
            {isTrendingUp24h ? (
              <TrendingUp className="size-4 text-green-400" />
            ) : (
              <TrendingDown className="size-4 text-red-500" />
            )}
            <span className={isTrendingUp24h ? 'text-green-400' : 'text-red-500'}>
              {formatPercentage(Math.abs(priceChange24h))}
            </span>
          </div>
        </li>
        <li>
          <span className="label">30 Days</span>
          <div className="value">
            {isTrendingUp30d ? (
              <TrendingUp className="size-4 text-green-400" />
            ) : (
              <TrendingDown className="size-4 text-red-500" />
            )}
            <span className={isTrendingUp30d ? 'text-green-400' : 'text-red-500'}>
              {formatPercentage(Math.abs(priceChange30d))}
            </span>
          </div>
        </li>
        <li>
          <span className="label">Market Cap Rank</span>
          <div className="value">
            <span>#{coin.market_cap_rank || 'N/A'}</span>
          </div>
        </li>
      </ul>
    </div>
  );
}