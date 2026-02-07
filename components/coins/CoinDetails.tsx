import { ExternalLink } from 'lucide-react';
import { CoinDetailsData } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CoinDetailsProps {
  coin: CoinDetailsData;
}

export function CoinDetails({ coin }: CoinDetailsProps) {
  const marketCap = coin.market_data.market_cap?.usd;
  const volume = coin.market_data.total_volume?.usd;
  const high24h = coin.market_data.high_24h?.usd;
  const low24h = coin.market_data.low_24h?.usd;
  
  // Get first valid homepage URL
  const website = coin.links?.homepage?.find(url => url && url.trim() !== '');
  
  // Get first valid blockchain explorer URL
  const explorer = coin.links?.blockchain_site?.find(url => url && url.trim() !== '');

  return (
    <div className="details">
 
      
      <ul className="details-grid">
        <li>
          <span className="label">Market Cap</span>
          <span className="value">
            {marketCap ? formatCurrency(marketCap) : 'N/A'}
          </span>
        </li>

        <li>
          <span className="label">24h Volume</span>
          <span className="value">
            {volume ? formatCurrency(volume) : 'N/A'}
          </span>
        </li>

        <li>
          <span className="label">24h High</span>
          <span className="value">
            {high24h ? formatCurrency(high24h) : 'N/A'}
          </span>
        </li>

        <li>
          <span className="label">24h Low</span>
          <span className="value">
            {low24h ? formatCurrency(low24h) : 'N/A'}
          </span>
        </li>

        <li>
          <span className="label">Market Cap Rank</span>
          <span className="value">
            #{coin.market_cap_rank || 'N/A'}
          </span>
        </li>

        {website && (
          <li>
            <span className="label">Website</span>
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="link"
            >
              Visit Website
              <ExternalLink className="size-4" />
            </a>
          </li>
        )}

        {explorer && (
          <li>
            <span className="label">Explorer</span>
            <a 
              href={explorer} 
              target="_blank" 
              rel="noopener noreferrer"
              className="link"
            >
              View on Explorer
              <ExternalLink className="size-4" />
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}