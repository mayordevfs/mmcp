import React, { useState } from 'react'
import Layout from '@/components/layouts/pos';
import { adminOnly } from '@/utils/auth-utils';
import Categories from '@/components/pos/categories';
import Input from '@/components/ui/input';
import Products from '@/components/pos/products';
import Cart from '@/components/pos/Cart';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function PosPage() {
  const [showMobileCart, setShowMobileCart] = useState(false);

  return (
    <div className='w-[95%] lg:flex p-3 h-full relative lg:space-x-5'>
      <main className='lg:flex-1 w-full h-full overflow-y-auto'>
        <Categories/>
        <div className='bg-white rounded-full mt-3 p-3'>
          <input className="focus:border-none outline-none w-full" placeholder='search..'/>
        </div>
        <Products/>
      </main>

      {/* Desktop Cart */}
      <div className="hidden lg:flex-[0.5] w-full lg:block bg-white h-full">
        <Cart/>
      </div>

      {/* Mobile Cart Button */}
      <button
        onClick={() => setShowMobileCart(true)}
        className="lg:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg z-40 hover:bg-blue-700 transition-colors"
        aria-label="Open Cart"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8a2 2 0 104 0 2 2 0 00-4 0zm8 0a2 2 0 104 0 2 2 0 00-4 0z" />
        </svg>
        {/* Optional: Cart item count badge */}
        {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span> */}
      </button>

      {/* Mobile Cart Modal */}
      {showMobileCart && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowMobileCart(false)}
          />
          
          {/* Cart Modal */}
          <div className="relative ml-auto h-full w-full max-w-sm bg-white shadow-xl transform transition-transform">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Cart</h2>
              <button
                onClick={() => setShowMobileCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Cart Content */}
            <div className="h-full overflow-y-auto pb-16">
              <Cart/>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

PosPage.Layout = Layout
PosPage.authenticate = {
  permissions: adminOnly
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});