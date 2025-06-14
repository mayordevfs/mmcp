import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  ArrowUpDown, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ChevronDown,
  Sparkles,
  Globe,
  Calculator
} from 'lucide-react';
import { useMutation, useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import { toast } from 'react-toastify';

const CurrencyExchangeForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tier 1');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = ['Tier 1', 'Tier 2', 'Tier 3'];
  const currencies = [
    { code: 'USDT', name: 'Tether USD', flag: '🪙' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
    { code: 'BTC', name: 'Bitcoin', flag: '₿' },
    { code: 'ETH', name: 'Ethereum', flag: 'Ξ' }
  ];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      ccy1: 'USDT',
      ccy2: 'NGN',
      buyRate: '',
      sellRate: '',
      midRate: ''
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  // Auto-calculate mid rate when buy and sell rates change
  useEffect(() => {
    const buyRate = parseFloat(watchedValues.buyRate);
    const sellRate = parseFloat(watchedValues.sellRate);
    if (buyRate && sellRate && !isNaN(buyRate) && !isNaN(sellRate)) {
      const midRate = ((buyRate + sellRate) / 2).toFixed(2);
      setValue('midRate', midRate);
    } else if (!watchedValues.buyRate && !watchedValues.sellRate) {
      setValue('midRate', '');
    }
  }, [watchedValues.buyRate, watchedValues.sellRate, setValue]);

  const {mutate:saveRate,isLoading,isSuccess} = useMutation(
    (data:any)=>axiosInstance.request({
        method:'POST',
        url:'exchange-rate/save-rate',
        data:data
    }),
    {
        onSuccess: (response) => {
                if(response?.data?.code!=="000"){
                    toast.error("error saving rate")
                }
                toast.success('Successfully saved rate!');
                reset()
                console.log('rate response:', response);
                // Handle successful login (e.g., store token, redirect)
                // Example: localStorage.setItem('token', response.data.token);
                // Example: router.push('/dashboard');
        },
         onError: (error: any) => {
                console.error('Save rate error:', error);
                
                if (error?.response?.data) {
                  const status = error.response.status;
                  const message = error.response.data.message || 'Unknown error';
                  
                  switch (status) {
                    case 400:
                      toast.error(`Bad request: ${message}`);
                      break;
                    // case 401:
                    //   toast.error("Invalid username or password");
                    //   break;
                    // case 403:
                    //   toast.error("Access forbidden - account may be suspended");
                    //   break;
                    case 422:
                      toast.error("Validation error - please check your input");
                      break;
                    case 500:
                      toast.error("Server error - please try again later");
                      break;
                    default:
                      toast.error("Save rate failed");
                  }
                } else {
                  toast.error("Network error - please check your connection");
                }
          },
    }
  )

  const onSubmit = async (data:any) => {
    const payload = {
      id: 0,
      ccy1: data.ccy1,
      ccy2: data.ccy2,
      buyRate: parseFloat(data.buyRate),
      sellRate: parseFloat(data.sellRate),
      midRate: parseFloat(data.midRate),
      symbol: `${data.ccy1}/${data.ccy2}`,
      category: selectedCategory
    };

    console.log('Payload:', payload);
    saveRate(payload)
  };

  const swapCurrencies = () => {
    const currentCcy1 = watchedValues.ccy1;
    const currentCcy2 = watchedValues.ccy2;
    setValue('ccy1', currentCcy2);
    setValue('ccy2', currentCcy1);
  };

  return (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Currency Pair Selection */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From Currency
                </label>
                <Controller
                  name="ccy1"
                  control={control}
                  rules={{ required: 'From currency is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg text-[14px] font-medium"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.ccy1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.ccy1.message}</p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swapCurrencies}
                  className="p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transform hover:scale-110 transition-all duration-200 shadow-lg"
                >
                  <ArrowUpDown className="w-5 h-5" />
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To Currency
                </label>
                <Controller
                  name="ccy2"
                  control={control}
                  rules={{ required: 'To currency is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[14px] text-lg font-medium"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.ccy2 && (
                  <p className="text-red-500 text-sm mt-1">{errors.ccy2.message}</p>
                )}
              </div>
            </div>

            {/* Exchange Rates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  Buy Rate
                </label>
                <div className="relative">
                  <Controller
                    name="buyRate"
                    control={control}
                    rules={{ 
                      required: 'Buy rate is required',
                      min: { value: 0.01, message: 'Rate must be positive' },
                      pattern: {
                        value: /^\d*\.?\d+$/,
                        message: 'Please enter a valid number'
                      }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        className={`w-full px-4 py-3 bg-white/50 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg font-medium group-hover:shadow-md ${
                          errors.buyRate ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="0.00"
                      />
                    )}
                  />
                  <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                {errors.buyRate && (
                  <p className="text-red-500 text-sm mt-1">{errors.buyRate.message}</p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-red-500 transform rotate-180" />
                  Sell Rate
                </label>
                <div className="relative">
                  <Controller
                    name="sellRate"
                    control={control}
                    rules={{ 
                      required: 'Sell rate is required',
                      min: { value: 0.01, message: 'Rate must be positive' },
                      pattern: {
                        value: /^\d*\.?\d+$/,
                        message: 'Please enter a valid number'
                      }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        className={`w-full px-4 py-3 bg-white/50 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg font-medium group-hover:shadow-md ${
                          errors.sellRate ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="0.00"
                      />
                    )}
                  />
                  <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                {errors.sellRate && (
                  <p className="text-red-500 text-sm mt-1">{errors.sellRate.message}</p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Calculator className="w-4 h-4 mr-2 text-blue-500" />
                  Mid Rate
                </label>
                <div className="relative">
                  <Controller
                    name="midRate"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-lg font-medium text-blue-700 cursor-not-allowed"
                        placeholder="Auto-calculated"
                        readOnly
                      />
                    )}
                  />
                  <Sparkles className="absolute right-3 top-3 w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="relative w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium text-left"
                >
                  <span className="block truncate">{selectedCategory}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                {categoryOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          setCategoryOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                      >
                        <span className={`block truncate ${selectedCategory === category ? 'font-semibold' : 'font-normal'}`}>
                          {category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                submitted
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-xl hover:shadow-2xl'
              }`}
            >
              {isSuccess ? (
                <span className="flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  Rate Added Successfully!
                </span>
              ) : isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Adding Rate...
                </span>
              ) : (
                'Add Exchange Rate'
              )}
            </button>
          </form>

          {/* Preview */}
          {watchedValues.ccy1 && watchedValues.ccy2 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">Preview</h3>
              <div className="space-y-1">
                <p className="text-gray-600">
                  Symbol: <span className="font-mono font-bold">{watchedValues.ccy1}/{watchedValues.ccy2}</span>
                </p>
                <p className="text-gray-600">
                  Category: <span className="font-semibold">{selectedCategory}</span>
                </p>
                {watchedValues.buyRate && watchedValues.sellRate && (
                  <p className="text-gray-600">
                    Spread: <span className="font-semibold">{(parseFloat(watchedValues.sellRate) - parseFloat(watchedValues.buyRate)).toFixed(2)}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
  );
};

export default CurrencyExchangeForm;