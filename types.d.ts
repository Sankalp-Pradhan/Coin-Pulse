type OHLCData = [number, number, number, number, number];

interface NextPageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface CandlestickChartProps {
  data?: OHLCData[];
  liveOhlcv?: OHLCData | null;
  coinId: string;
  height?: number;
  children?: React.ReactNode;
  mode?: 'historical' | 'live';
  initialPeriod?: Period;
  liveInterval: '1s' | '1m';
  setLiveInterval: (interval: '1s' | '1m') => void;
}


interface ConverterProps {
  symbol: string;
  icon: string;
  priceList: Record<string, number>;
}

interface Ticker {
  market: {
    name: string;
  };
  base: string;
  target: string;
  converted_last: {
    usd: number;
  };
  timestamp: string;
  trade_url: string;
}

// type Period = 'daily' | 'weekly' | 'monthly' | '3months' | '6months' | 'yearly' | 'max';
// Remove this line:
// type Period = 'daily' | 'weekly' | 'monthly' | '3months' | '6months' | 'yearly' | 'max';

// Replace with:
type Period = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'Max';

interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
    data: {
      price: number;
      price_change_percentage_24h: {
        usd: number;
      };
    };
  };
}

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
  data: {
    price?: number;
    price_change_percentage_24h: number;
  };
}

// Chart Section Props (used in ChartSection.tsx)
interface ChartSectionProps {
  coinData: {
    image: { large: string };
    name: string;
    symbol: string;
    market_data: {
      current_price: { usd: number };
    };
  };
  coinOHLCData: OHLCData[];
  coinId: string;
}

interface TopGainersLosers {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  priceChangePercentage24h: number;
}

interface TopGainersLosersResponse {
  id: string;
  name: string;
  symbol: string;
  image: string;
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  market_cap_rank: number;
}

interface PriceData {
  usd: number;
}

interface Trade {
  price?: number;
  timestamp?: number;
  type?: string;
  amount?: number;
  value?: number;
}

interface ExtendedPriceData {
  usd: number;
  coin?: string;
  price?: number;
  change24h?: number;
  marketCap?: number;
  volume24h?: number;
  timestamp?: number;
}

interface WebSocketMessage {
  type?: string;
  c?: string;
  ch?: string;
  i?: string;
  p?: number;
  pp?: number;
  pu?: number;
  m?: number;
  v?: number;
  vo?: number;
  o?: number;
  h?: number;
  l?: number;
  t?: number;
  to?: number;
  ty?: string;
  channel?: string;
  identifier?: string;
}







// Copy this content to your /d:/Projects/coin-pulse/types.d.ts file

// Coin Details Types
export interface CoinDetailsData {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank?: number; // TOP LEVEL - This is where CoinGecko puts it
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      [key: string]: number;
      usd: number;
    };
    price_change_24h_in_currency: {
      usd: number;
    };
    price_change_percentage_24h_in_currency: {
      usd: number;
    };
    price_change_percentage_30d_in_currency: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h?: {
      usd: number;
    };
    low_24h?: {
      usd: number;
    };
  };
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
  };
}


// Pool Data Type
export interface PoolData {
  id: string;
  address: string;
  name: string;
  network: string;
}

// Query Params Type
export interface QueryParams {
  [key: string]: string | number | boolean | null | undefined;
}

// CoinGecko Error Type
export interface CoinGeckoErrorBody {
  error?: string;
}

// Order Book Entry
export interface OrderBookEntry {
  price: number;
  amount_btc: number;
  amount_eth: number;
  type: 'buy' | 'sell';
}

// Trade Entry
export interface TradeEntry {
  time: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
}

// Similar Coin
export interface SimilarCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}
export interface DataTableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, rowIndex: number) => React.ReactNode

  /** classNames */
  headClassName?: string;
  cellClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];

  /** keys */
  rowKey?: (row: T, rowIndex: number) => string | number

  /** table-level classes */
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
}


export type Category = {
  id: string
  name: string
  market_cap: number
  market_cap_change_24h: number
  volume_24h: number
  top_3_coins: string[]
}
