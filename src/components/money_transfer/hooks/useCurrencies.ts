import { useMemo } from 'react';

const getCurrencyName = (code: string): string => {
  const currencyNames: { [key: string]: string } = {
    USDT: 'Tether USD',
    EUR: 'Euro',
    NGN: 'Nigerian Naira',
    USD: 'US Dollar',
    GBP: 'British Pound',
  };
  return currencyNames[code] || code;
};

export const useCurrencies = (exchangeData: any) => {
  return useMemo(() => {
    if (!exchangeData?.data?.rateList) return [{ code: 'NGN', name: 'Nigerian Naira' }];
    
    const currencySet = new Set<string>();
    const currencyOptions: Array<{ code: string; name: string }> = [];
    
    // Always include NGN as base currency
    currencySet.add('NGN');
    currencyOptions.push({ code: 'NGN', name: 'Nigerian Naira' });
    
    exchangeData.data.rateList.forEach((rate: any) => {
      if (!currencySet.has(rate.ccy1)) {
        currencySet.add(rate.ccy1);
        currencyOptions.push({ code: rate.ccy1, name: getCurrencyName(rate.ccy1) });
      }
      if (!currencySet.has(rate.ccy2)) {
        currencySet.add(rate.ccy2);
        currencyOptions.push({ code: rate.ccy2, name: getCurrencyName(rate.ccy2) });
      }
    });
    
    // Sort currencies for better UX
    return currencyOptions.sort((a, b) => a.name.localeCompare(b.name));
  }, [exchangeData]);
};