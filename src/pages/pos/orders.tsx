import React, { useState } from 'react'
import Layout from '@/components/layouts/pos';
import SearchFilterBar from '@/components/pos/orders/order-filter';
import PosOrderList from '@/components/pos/orders/order-list';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';

import ErrorMessage from '@/components/ui/error-message';
import { useTranslation } from 'next-i18next';
import useUser from '@/stores/userStore';

const PosOrders = () => {
  const {t} = useTranslation()
  const [showFilters, setShowFilters] = useState(false)
  const [page,setPage] = useState(1)
  const {user} = useUser()
  const [filter,setFilter] = useState({
    startDate:"",
    endDate:"",
    orderNo:'',
    customerId:""
  })

   const handleDateChange = (date: Date | null, name: string) => {
    setFilter((prev) => ({
      ...prev,
      [name]: date,
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [applyFilter, setApplyFilter] = useState(false);
  const handleSubmit: () => void = () => {
    setApplyFilter((prev) => !prev);
    setPage(1);
  };
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // const getFirstDayOfYear = () => {
  //   const year = new Date().getFullYear();
  //   return `01-01-${year}`;
  // };
  const today = formatDate(new Date());
  // const firstDayOfYear = getFirstDayOfYear();
  // console.log(firstDayOfYear);

  
  
  const {data,isError,isFetching} = useQuery({
    queryKey:["pos-orders",page,applyFilter],
    queryFn:()=>axiosInstance({
      url:'/stock-management/orders/dynamic',
      method:'GET',
      params:{
        storeId:"2001",
        entityId:user?.entityCode,
        startDate: filter?.startDate
            ? formatDate(filter?.startDate as any)
            : "01-01-2020",
        endDate:filter?.endDate
            ? formatDate(filter?.endDate as any)
            : today,
        orderNo: filter?.orderNo || '',
        pageNumber:page,
        pageSize:20
      }
    })
  })
  console.log(filter);
  
  if(isError) return <ErrorMessage message='Something went wrong!!'/>
  console.log(data?.data);
   const newPaginatorInfo = {
    currentPage: page,
    firstPageUrl: '',
    from: 0,
    lastPage: data?.data?.totalPages,
    lastPageUrl: '',
    links: [],
    nextPageUrl: null,
    path: '',
    perPage: 20,
    prevPageUrl: null,
    to: 20,
    total: data?.data?.totalCount,
    hasMorePages: data?.data?.totalPages > page,
  };

  function handlePagination(current: number) {
    setPage(current);
  }

  console.log(user);
  
  
  return (
    <div className='w-[95%] space-y-3'>
        {/* <OrderStatusNav/> */}
        <h1 className='text-lg md:text-xl lg:text-2xl font-bold mt-2'>{t("common:text-orders")}</h1>
        <div className='h-[calc(100vh-160px)] mt-1 bg-white rounded-t-md overflow-y-auto'>
            {/* Filter Toggle Button */}
            <div className='p-3 border-b'>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-3'
              >
                <svg 
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {/* Collapsible Filter Section */}
            {showFilters && (
              <div className='animate-slideDown'>
                <SearchFilterBar
                  filter={filter}
                  onDateChange={handleDateChange}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                />
              </div>
            )}
            
            <PosOrderList
              data={data?.data?.data||[]}
              isFetching={isFetching}
              paginatorInfo={newPaginatorInfo}
              onPagination={handlePagination}
            />
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