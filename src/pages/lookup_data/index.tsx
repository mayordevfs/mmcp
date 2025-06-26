import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react'
import Layout from '@/components/layouts/admin';
import Card from '@/components/common/card';
import { useTranslation } from 'next-i18next';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import { useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import ErrorMessage from '@/components/ui/error-message';
import { adminOnly } from '@/utils/auth-utils';
import LookupList from '@/components/lookup_data/lookup-list';
import { ArrowUp } from 'lucide-react';
import { ArrowDown } from '@/components/icons/arrow-down';
import { cn } from '@/lib/utils';
import LookupTypeFilter from '@/components/lookup_data/lookupFilter';
import useGetCategoryCode from '@/hooks/useGetCategoryCode';

export default function LookupDataScreen (){
  const {t} = useTranslation()
  const [page,setPage] = useState(1)
  const [visible, setVisible] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [categoryCode,setCategoryCode] = useState('')
  const handleSubmit: () => void = () => {
    setApplyFilter((prev) => !prev);
    setPage(1);
  };
  const {data,isFetching,isError} = useQuery(
    ['lookup-data',page,applyFilter],
    ()=>axiosInstance.request({
      method:'GET',
      url:'lookupdata/getallcategorycode',
      params:{
        entityCode:'ETZ',
        categoryCode:categoryCode,
        pageNumber:page,
        pageSize:100
      }
    })
  )

  if (isError) return <ErrorMessage message='Something went wrong!'/>
  const toggleVisible = () => {
    setVisible((v) => !v);
  };
  console.log(data);
  function handlePagination(current: number) {
        setPage(current);
    }
  
  const newPaginatorInfo = {
    currentPage: page,
    firstPageUrl: '',
    from: 1,
    lastPage: data?.data?.totalPages,
    lastPageUrl: '',
    links: [],
    nextPageUrl: null,
    path: '',
    perPage: 100,
    prevPageUrl: null,
    to: 10,
    total: data?.data?.totalItems,
    hasMorePages: data?.data?.totalPages > page,
  };

  const handleCodeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryCode(e.target.value);
  };
  return (
    <>
      <Card className="mb-8 flex flex-col">
      <div className="flex w-full flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading whitespace-nowrap">
              {t('Lookup Data')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2 justify-end">
            <LinkButton
              href={`${Routes.create_lookup_data}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>
                {t('form:button-label-create')}{' '}
                {t('Lookup Data')}
              </span>
            </LinkButton>

            <button
              className="flex items-center whitespace-nowrap text-base font-semibold text-accent md:ms-5"
              onClick={toggleVisible}
            >
              {t('common:text-filter')}{' '}
              {visible ? (
                <ArrowUp className="ms-2" />
              ) : (
                <ArrowDown className="ms-2" />
              )}
            </button>
          </div>
      </div>
      <div
        className={cn('flex w-full transition', {
          'visible h-auto': visible,
          'invisible h-0': !visible,
        })}
      >
        <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
          
          <LookupTypeFilter
          handleApplyFilter={handleSubmit}
          onCodeFilter={handleCodeFilter}
          />
        </div>
      </div>
    </Card>
    <LookupList
      isFetching={isFetching}
      data={data?.data}
      paginatorInfo={newPaginatorInfo}
      onPagination={handlePagination}
    />
    </>
  )
}

LookupDataScreen.Layout = Layout
LookupDataScreen.authenticate = {
    permissions:adminOnly
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});