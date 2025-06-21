import React from 'react';
import { formatPrice } from '@/utils/money_transfer/format-price';

interface AmountToReceiveDisplayProps {
  receiveCurrency: any;
  amountToReceive?: number;
}

export const AmountToReceiveDisplay: React.FC<AmountToReceiveDisplayProps> = ({
  receiveCurrency,
  amountToReceive
}) => {
  if (!receiveCurrency?.code) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 capitalize">Amount to receive</h3>
      <div className='h-[48px] border px-2 flex items-center text-gray-700 rounded-sm font-semibold text-[14px]'>
        {formatPrice(amountToReceive, receiveCurrency?.code)}
      </div>
    </div>
  );
};
