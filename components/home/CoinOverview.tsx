import { fetcher } from '@/lib/coingecko.actions';
import React from 'react';
import { CoinOverviewFallback } from './Fallback';
import { CoinOverviewClient } from './CoinOverviewClient';

const CoinOverview = async () => {
    try {
        const [coin, coinOHLCData] = await Promise.all([
            fetcher<CoinDetailsData>('coins/bitcoin', {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: false
            }),
            fetcher<OHLCData[]>('coins/bitcoin/ohlc', {
                vs_currency: 'usd',
                days: 1,
                precision: 'full',
            })
        ]);

        return <CoinOverviewClient coin={coin} coinOHLCData={coinOHLCData} />;
    } catch (error) {
        console.error('Error fetching coin overview', error);
        return <CoinOverviewFallback />;
    }
};

export default CoinOverview;