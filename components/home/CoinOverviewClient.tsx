"use client"

import { useState } from 'react';
import CandleStickCharts from '../CandleStickCharts';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface CoinOverviewClientProps {
    coin: CoinDetailsData;
    coinOHLCData: OHLCData[];
}

export const CoinOverviewClient = ({ coin, coinOHLCData }: CoinOverviewClientProps) => {
    const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1m');

    return (
        <div id="coin-overview">
            <CandleStickCharts
                data={coinOHLCData}
                coinId='bitcoin'
                mode='historical'
                liveInterval={liveInterval}
                setLiveInterval={setLiveInterval}
            >
                <div className="header pt-2">
            <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
                    <div className="info">
                        <p>{coin.name}/{coin.symbol.toUpperCase()}</p>
                        <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
                    </div>
                </div>
            </CandleStickCharts>
        </div>
    );
};