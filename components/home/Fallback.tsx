import React from 'react';
import DataTable from '../DataTable';

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