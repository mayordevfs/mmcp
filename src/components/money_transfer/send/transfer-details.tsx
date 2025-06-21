// Refactored TransferDetails Component
import { Banknote } from 'lucide-react';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import React, { Dispatch, SetStateAction } from 'react';
import { Control, UseFormRegister, useWatch } from 'react-hook-form';
import { EnhancedMoneyTransferFormData } from '@/types';
import { useExchangeRates } from '@/data/money_transfer/exchangeRates';
import { useCurrencies } from '../hooks/useCurrencies';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { useCurrencyCalculation } from '../hooks/useCurrencyCalculation';
import { TransferDetailsLoadingState } from '../extra_components/transfer-detail_loading';
import { TransferDetailsErrorState } from '../extra_components/transfer-detail-error';
import { AmountToReceiveDisplay } from '../extra_components/amount-to-receive';
import { ExchangeRateDisplay } from '../extra_components/exchange-rate-display';

interface TransferDetailsProps {
  control: Control<EnhancedMoneyTransferFormData>;
  setValue: (name: keyof EnhancedMoneyTransferFormData, value: any) => void;
  watch?: any;
  register?: UseFormRegister<EnhancedMoneyTransferFormData>;
  amountToReceive?: number;
  setAmountToReceive?: Dispatch<SetStateAction<number>>;
}

const TransferDetails: React.FC<TransferDetailsProps> = ({ 
  control, 
  setValue, 
  watch, 
  register, 
  amountToReceive, 
  setAmountToReceive 
}) => {
  const { data: exchangeData, isLoading, isError } = useExchangeRates();

  // Watch form values
  const sendCurrency = useWatch({ control, name: 'sendCurrency' });
  const receiveCurrency = useWatch({ control, name: 'receiveCurrency' });
  const amountToSend = useWatch({ control, name: 'amountToSend' });

  // Custom hooks
  const currencies = useCurrencies(exchangeData);
  const getExchangeRate = useExchangeRate(exchangeData);

  // Currency calculation effect
  useCurrencyCalculation({
    sendCurrency,
    receiveCurrency,
    amountToSend,
    exchangeData,
    getExchangeRate,
    setValue,
    setAmountToReceive
  });

  // Debug logging
  console.log('TransferDetails - Watched values:', {
    sendCurrency,
    receiveCurrency,
    amountToSend
  });

  if (isLoading) return <TransferDetailsLoadingState />;
  if (isError) return <TransferDetailsErrorState />;

  const currentExchangeRate = sendCurrency?.code && receiveCurrency?.code && sendCurrency.code !== receiveCurrency.code
    ? getExchangeRate(sendCurrency.code, receiveCurrency.code)
    : null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Banknote className="h-5 w-5" />
        Transfer Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sendCurrency" className="text-sm font-medium text-gray-700">
            Send Currency *
          </Label>
          <SelectInput
            name="sendCurrency"
            control={control}
            getOptionLabel={(option: any) => `${option.name} (${option.code})`}
            getOptionValue={(option: any) => option.code}
            options={currencies}
            placeholder="Select currency to send"
            rules={{ required: "Please select a currency to send" }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amountToSend" className="text-sm font-medium text-gray-700">
            Amount to Send *
          </Label>
          <Input
            inputClassName="bg-white"
            id="amountToSend"
            {...register?.('amountToSend', { required: "Please enter an amount to send" })}
            type="number"
            placeholder="0.00"
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="receiveCurrency" className="text-sm font-medium text-gray-700">
            Receive Currency *
          </Label>
          <SelectInput
            name="receiveCurrency"
            control={control}
            getOptionLabel={(option: any) => `${option.name} (${option.code})`}
            getOptionValue={(option: any) => option.code}
            options={currencies}
            placeholder="Select currency to receive"
            rules={{ required: "Please select a currency to receive" }}
          />
        </div>

        <AmountToReceiveDisplay 
          receiveCurrency={receiveCurrency}
          amountToReceive={amountToReceive}
        />
      </div>
      
      {currentExchangeRate && (
        <ExchangeRateDisplay 
          sendCurrency={sendCurrency}
          receiveCurrency={receiveCurrency}
          rate={currentExchangeRate}
        />
      )}
    </div>
  );
};

export default TransferDetails;