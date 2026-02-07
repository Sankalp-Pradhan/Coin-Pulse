import React from 'react';
import DataTable from '../DataTable';
import { Skeleton } from '../ui/skeleton';
import { DataTableColumn } from '@/types';

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton" />
        <div className="info">
          <div className="header-line-sm skeleton" />
          <div className="header-line-lg skeleton" />
        </div>
      </div>
      <div className="chart">
        <div className="chart-skeleton skeleton" />
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const skeletonData = Array.from({ length: 6 }, (_, i) => ({
    item: {
      id: `skeleton-${i}`,
      name: '',
      large: '',
      data: {
        price: '',
        price_change_percentage_24h: { usd: 0 }
      }
    }
  }));

  const columns: DataTableColumn<any>[] = [
    {
      header: 'Name',
      cellClassName: 'name-cell',
      cell: () => (
        <div className="name-link">
          <div className="name-image skeleton" />
          <div className="name-line skeleton" />
        </div>
      )
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: () => (
        <div className="price-change">
          <div className="change-icon skeleton" />
          <div className="change-line skeleton" />
        </div>
      )
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: () => <div className="price-line skeleton" />
    }
  ];

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <div className="trending-coins-table">
        <DataTable
          data={skeletonData}
          columns={columns}
          rowKey={(item) => item.item.id}
          tableClassName="trending-coins-table"
          headerCellClassName="py-3"
          bodyCellClassName="py-2"
        />
      </div>
    </div>
  );
};


const CategoriesFallback = () => {
  // Create 10 skeleton rows to match the slice(0, 10) from the original
  const skeletonRows = Array.from({ length: 10 });

  return (
    <div id='categories-fallback' className='custom-scrollbar'>
      <h4>Top Categories</h4>

      <div className="mt-3">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-400">
              <th className="text-left py-4 pl-5 text-purple-100 font-medium">Category</th>
              <th className="text-left py-4 text-purple-100 font-medium">Top Gainers</th>
              <th className="text-left py-4 text-purple-100 font-medium">24h Change</th>
              <th className="text-left py-4 text-purple-100 font-medium">Market Cap</th>
              <th className="text-left py-4 pr-5 text-purple-100 font-medium">24h Volume</th>
            </tr>
          </thead>
          <tbody>
            {skeletonRows.map((_, index) => (
              <tr key={index} className="border-b border-dark-400 last:border-none">
                {/* Category Name */}
                <td className="category-cell py-5">
                  <Skeleton className="category-skeleton skeleton" />
                </td>

                {/* Top Gainers - 3 coin images */}
                <td className="top-gainers-cell py-5">
                  <Skeleton className="coin-skeleton skeleton" />
                  <Skeleton className="coin-skeleton skeleton" />
                  <Skeleton className="coin-skeleton skeleton" />
                </td>

                {/* 24h Change */}
                <td className="change-cell py-5">
                  <Skeleton className="change-icon skeleton" />
                  <Skeleton className="value-skeleton-sm skeleton" />
                </td>

                {/* Market Cap */}
                <td className="market-cap-cell py-5">
                  <Skeleton className="value-skeleton-md skeleton" />
                </td>

                {/* 24h Volume */}
                <td className="volume-cell py-5">
                  <Skeleton className="value-skeleton-lg skeleton" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesFallback;