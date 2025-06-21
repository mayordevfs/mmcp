import CurrencyExchangeForm from '@/components/money_transfer/save-exchange_rate'
import { adminOnly} from '@/utils/auth-utils'
import { Globe } from 'lucide-react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'

const SaveExchangeRate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mb-4 shadow-xl">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Currency Exchange Rate
          </h1>
          <p className="text-gray-600 text-lg">
            Set competitive rates for your currency pairs
          </p>
        </div>
        <CurrencyExchangeForm/>
        </div>
    </div>
  )
}

// SaveExchangeRate.authenticate = {
//     permissions:adminOnly
// }

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});

export default SaveExchangeRate