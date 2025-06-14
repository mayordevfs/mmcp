import { useEffect } from 'react';

interface UseCurrencyCalculationProps {
  sendCurrency: any;
  receiveCurrency: any;
  amountToSend: number;
  exchangeData: any;
  getExchangeRate: (from: string, to: string) => number;
  setValue: (name: string, value: any) => void;
  setAmountToReceive?: (amount: number) => void;
}

export const useCurrencyCalculation = ({
  sendCurrency,
  receiveCurrency,
  amountToSend,
  exchangeData,
  getExchangeRate,
  setValue,
  setAmountToReceive
}: UseCurrencyCalculationProps) => {
  useEffect(() => {
    console.log('Calculation effect triggered:', {
      sendCurrency: sendCurrency?.code,
      receiveCurrency: receiveCurrency?.code,
      amountToSend,
      hasExchangeData: !!exchangeData
    });

    if (sendCurrency?.code && receiveCurrency?.code && amountToSend && amountToSend > 0) {
      const rate = getExchangeRate(sendCurrency.code, receiveCurrency.code);
      const calculatedAmount = amountToSend * rate;
      
      console.log('Calculation details:', {
        fromCurrency: sendCurrency.code,
        toCurrency: receiveCurrency.code,
        amount: amountToSend,
        rate,
        calculatedAmount
      });
      
      const finalAmount = parseFloat(calculatedAmount.toFixed(2));
      if (setAmountToReceive) {
        setAmountToReceive(finalAmount);
      }
      console.log('Set amountToReceive to:', finalAmount);
    } else {
      console.log('Clearing amountToReceive');
      setValue('amountToReceive', 0);
    }
  }, [sendCurrency, receiveCurrency, amountToSend, setValue, getExchangeRate, exchangeData, setAmountToReceive]);
};
