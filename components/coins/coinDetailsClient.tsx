'use client';

import { CoinDetailsData, OHLCData } from '@/types';
import { CoinHeader } from './coinheader';
import { TrendOverview } from './TrendOverview';
import { OrderBook } from './OrderBook';
import { ETHConverter } from './ETHConverter';
import { SimilarCoins } from './SimilarCoins';
import { RecentTrades } from './recentTrades';
import { CoinDetails } from './CoinDetails';
import { Separator } from '../ui/separator';

interface CoinDetailsClientProps {
  coin: CoinDetailsData;
  coinOHLCData: OHLCData[];
}

export function CoinDetailsClient({ coin, coinOHLCData }: CoinDetailsClientProps) {
  return (
    <div id="coin-details-page">
      {/* Left Column - Primary Content */}
      <div className="primary">
        <CoinHeader coin={coin} />
        <Separator className='mt-5' />
        <TrendOverview coin={coin} coinOHLCData={coinOHLCData} />
        
      </div>

      {/* Right Column - Secondary Content */}
      <div className="secondary">
        <ETHConverter coin={coin} />
         <Separator className='mt-5 mb-5' />
        <SimilarCoins coinId={coin.id} />
         <Separator className='mt-5 mb-2' />
        <RecentTrades coinId={coin.id} />
      </div>
    </div>
  );
}