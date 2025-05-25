import React from 'react'
import Layout from '@/components/layouts/pos';
import OrderStatusNav from '@/components/pos/orders/order-header';
import SearchFilterBar from '@/components/pos/orders/order-filter';
import PosOrderList from '@/components/pos/orders/order-list';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
const PosOrders = () => {
  return (
    <div className='w-[95%]'>
        <OrderStatusNav/>
        <div className='h-[calc(100vh-160px)] mt-1 bg-white rounded-t-md overflow-y-auto'>
            <SearchFilterBar/>
            <PosOrderList/>
        </div>
    </div>
  )
}


PosOrders.Layout = Layout
PosOrders.authenticate = {
  permissions: adminOnly
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
export default PosOrders