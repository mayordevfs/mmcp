import React from 'react';

interface ExchangeRateDisplayProps {
  sendCurrency: any;
  receiveCurrency: any;
  rate: number;
}

export const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({
  sendCurrency,
  receiveCurrency,
  rate
}) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
    <p className="text-sm text-blue-800">
      <strong>Exchange Rate:</strong> 1 {sendCurrency.code} = {rate.toFixed(4)} {receiveCurrency.code}
    </p>
  </div>
);