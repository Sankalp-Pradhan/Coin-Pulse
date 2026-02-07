import { CoinDetailsClient } from "@/components/coins/coinDetailsClient";
import { TrendOverview } from "@/components/coins/TrendOverview";
import { fetcher } from "@/lib/coingecko.actions";
import { CoinDetailsData, OHLCData } from "@/types";

interface CoinDetailsPageProps {
  params: Promise<{ id: string }>; // params is now a Promise
}

const CoinDetailsPage = async ({ params }: CoinDetailsPageProps) => {
  try {
    const { id } = await params; // Add await here

    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>(`coins/${id}`, {
        community_data: false,
        developer_data: false,
        localization: false,
        market_data: true,
        sparkline: false,
        tickers: false,
      }),
      fetcher<OHLCData[]>(`coins/${id}/ohlc`, {
        vs_currency: 'usd',
        days: 1,
        precision: 'full',
      }),
    ]);

    return (
      <div>
        <CoinDetailsClient coin={coin} coinOHLCData={coinOHLCData} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching coin details', error);
    return <div>Error loading coin details.</div>;
  }
};

export default CoinDetailsPage;