import { Skeleton } from '@/components/ui/skeleton';

export function CoinDetailsFallback() {
  return (
    <div id="coin-details-page">
      {/* Left Column - Primary Content */}
      <div className="primary">
        {/* Header Skeleton */}
        <div id="coin-header">
          <Skeleton className="h-8 w-32 mb-5" />
          
          <div className="info">
            <Skeleton className="size-19.25 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <ul className="stats">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-16" />
              </li>
            ))}
          </ul>
        </div>

        {/* Chart Skeleton */}
        <div id="coin-overview" className="mt-8">
          <div id="candlestick-chart">
            <div className="chart-header">
              <div className="header">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="info space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="button-group">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-9 w-20 rounded-sm" />
                ))}
              </div>
            </div>
            <Skeleton className="chart h-100 rounded-xl" />
          </div>
        </div>

        {/* Order Book Skeleton */}
        <div className="w-full mt-8 space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="bg-dark-500 rounded-xl p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-3 gap-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Secondary Content */}
      <div className="secondary">
        {/* Converter Skeleton */}
        <div id="converter">
          <Skeleton className="h-8 w-40 mb-5" />
          <div className="panel">
            <Skeleton className="h-12 w-full rounded-md" />
            <div className="divider">
              <Skeleton className="size-8 rounded-full" />
            </div>
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>

        {/* Similar Coins Skeleton */}
        <div className="w-full space-y-4 mt-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-dark-500 rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trades Skeleton */}
        <div className="w-full mt-8 space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="bg-dark-500 rounded-xl p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-3 gap-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}