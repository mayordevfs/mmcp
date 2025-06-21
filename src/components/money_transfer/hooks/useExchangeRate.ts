import { useMemo } from 'react';

export const useExchangeRate = (exchangeData: any) => {
  return useMemo(() => {
    return (fromCurrency: string, toCurrency: string): number => {
      if (!exchangeData?.data?.rateList || fromCurrency === toCurrency) {
        console.log(`Same currency or no rate list: ${fromCurrency} to ${toCurrency}`);
        return 1;
      }

      // Try direct rate first
      const directRate = exchangeData.data.rateList.find((rate: any) => 
        rate.ccy1 === fromCurrency && rate.ccy2 === toCurrency
      );
      if (directRate) {
        console.log(`Direct rate found: ${directRate.sellRate}`);
        return directRate.sellRate;
      }

      // Try reverse rate
      const reverseRate = exchangeData.data.rateList.find((rate: any) => 
        rate.ccy1 === toCurrency && rate.ccy2 === fromCurrency
      );
      if (reverseRate) {
        const rate = 1 / reverseRate.buyRate;
        console.log(`Reverse rate found: ${rate}`);
        return rate;
      }

      // Try cross rate via NGN
      const fromToNGN = exchangeData.data.rateList.find((rate: any) => 
        rate.ccy1 === fromCurrency && rate.ccy2 === 'NGN'
      );
      const toFromNGN = exchangeData.data.rateList.find((rate: any) => 
        rate.ccy1 === toCurrency && rate.ccy2 === 'NGN'
      );
      if (fromToNGN && toFromNGN) {
        const rate = fromToNGN.sellRate / toFromNGN.buyRate;
        console.log(`Cross rate via NGN found: ${rate}`);
        return rate;
      }

      console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
      return 1;
    };
  }, [exchangeData]);
};