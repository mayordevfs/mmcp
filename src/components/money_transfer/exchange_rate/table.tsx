import React from 'react';
import Table from 'rc-table';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import 'rc-table/assets/index.css';
import { exchangeRates } from './dummies';
import { useIsRTL } from '@/utils/locals';

const ExchangeRatesTable = () => {
      const { alignLeft } = useIsRTL();
  const formatRate = (rate:any) => {
    if (rate >= 100) {
      return rate.toFixed(2);
    } else if (rate >= 10) {
      return rate.toFixed(4);
    } else {
      return rate.toFixed(4);
    }
  };

  const formatChange = (change:any) => {
    const sign = change > 0 ? '+' : '';
    if (Math.abs(change) >= 1) {
      return `${sign}${change.toFixed(2)}`;
    } else {
      return `${sign}${change.toFixed(4)}`;
    }
  };

  const getTrendIcon = (trend:any) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend:any) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const columns:any = [
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      align:alignLeft,
      width: 200,
      render: (text:string, record:any) => (
        <div className="flex items-center gap-3">
          <img 
            src={record.flag} 
            alt={`${record.currency} flag`}
            className="w-8 h-6 rounded object-cover shadow-sm"
          />
          <div>
            <div className="font-semibold text-gray-900 text-sm">{record.currency}</div>
            <div className="text-xs text-gray-500">{record.name}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Buy Rate',
      dataIndex: 'buyRate',
      key: 'buyRate',
      width: 120,
      align: 'left',
      render: (rate:any) => (
        <span className="font-mono text-sm font-medium text-green-500">
          {formatRate(rate)}
        </span>
      ),
    },
    {
      title: 'Sell Rate',
      dataIndex: 'sellRate',
      key: 'sellRate',
      width: 120,
      align: 'left',
      render: (rate:any) => (
        <span className="font-mono text-sm font-medium text-red-600">
          {formatRate(rate)}
        </span>
      ),
    },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      width: 120,
      align: 'right',
      render: (change:any, record:any) => (
        <div className="flex items-center justify-end gap-2">
          {getTrendIcon(record.trend)}
          <span className={`font-mono text-sm font-medium ${getTrendColor(record.trend)}`}>
            {formatChange(change)}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h2 className="text-2xl font-bold text-white">Exchange Rates</h2>
          <p className="text-blue-100 mt-1">Live currency exchange rates</p>
        </div>
        
        <div className="overflow-hidden">
          <Table
            columns={columns}
            data={exchangeRates}
            rowKey="currency"
            className="exchange-rates-table"
            tableLayout="fixed"
          />
        </div>
        
        <div className="px-6 py-3 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 text-center">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <style jsx>{`
        .exchange-rates-table .rc-table {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .exchange-rates-table .rc-table-thead > tr > th {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          font-weight: 600;
          color: #374151;
          padding: 16px 12px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .exchange-rates-table .rc-table-tbody > tr > td {
          padding: 16px 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        
        .exchange-rates-table .rc-table-tbody > tr:hover > td {
          background: #f8fafc;
        }
        
        .exchange-rates-table .rc-table-tbody > tr:last-child > td {
          border-bottom: none;
        }
        
        .exchange-rates-table .rc-table-thead > tr > th:first-child {
          border-top-left-radius: 0;
        }
        
        .exchange-rates-table .rc-table-thead > tr > th:last-child {
          border-top-right-radius: 0;
        }
      `}</style>
    </div>
  );
};

export default ExchangeRatesTable;