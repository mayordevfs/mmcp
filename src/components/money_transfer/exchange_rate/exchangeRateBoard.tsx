
import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import ExchangeRatesTable from './table';

const ExchangeRateBoard = () => {
  

  const formatRate = (rate: number, currency: string) => {
    if (currency === 'JPY' || currency === 'INR') {
      return rate.toFixed(2);
    }
    return rate.toFixed(4);
  };

  const formatChange = (change: number, currency: string) => {
    const formattedChange = currency === 'JPY' || currency === 'INR' ? 
      Math.abs(change).toFixed(2) : 
      Math.abs(change).toFixed(4);
    return `${change >= 0 ? '+' : '-'}${formattedChange}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Live Exchange Rates
          </h1>
          <p className="text-lg text-gray-600">
            Real-time currency exchange rates for major currencies
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        <ExchangeRatesTable/>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            * Rates are indicative and may vary. Please contact us for live trading rates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateBoard;
