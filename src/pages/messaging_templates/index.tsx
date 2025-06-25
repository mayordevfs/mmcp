import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react'
import Layout from '@/components/layouts/admin';
import Card from '@/components/common/card';
import { useTranslation } from 'next-i18next';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import TemplateList from '@/components/messaging_templates/template-list';
import { useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import ErrorMessage from '@/components/ui/error-message';
import { adminOnly } from '@/utils/auth-utils';
import Pagination from '@/components/ui/pagination';

export default function MessagingTemplatesScreen (){
  const {t} = useTranslation()
  const [page,setPage] = useState(1)
  const {data,isFetching,isError} = useQuery(
    ['template-lists',page],
    ()=>axiosInstance.request({
      method:'GET',
      url:'/messagingTemplate/getMessageTemplates',
      params:{
        pageNumber:page,
        pageSize:100
      }
    })
  )

  if (isError) return <ErrorMessage message='Something went wrong!'/>

   // Create paginatorInfo object from API response for the component's use
  const paginatorInfo = {
    currentPage: page,
    firstPageUrl: '',
    from: 1,
    lastPage: data?.data?.totalPages,
    lastPageUrl: '',
    links: [],
    nextPageUrl: null,
    path: '',
    perPage: 10,
    prevPageUrl: null,
    to: 10,
    total: data?.data?.totalCount,
    hasMorePages: data?.data?.totalPages > page,
  };

  console.log(data?.data);
  function handlePagination(current: number) {
        setPage(current);
    }
  
  return (
    <>
      <Card className="mb-8 flex flex-col">
      <div className="flex w-full flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading whitespace-nowrap">
              {t('Messaging Templates')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2 justify-end">
            <LinkButton
              href={`${Routes.save_template}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>
                {t('form:button-label-create')}{' '}
                {t('Messaging Template')}
              </span>
            </LinkButton>

            {/* <button
              className="flex items-center whitespace-nowrap text-base font-semibold text-accent md:ms-5"
              onClick={toggleVisible}
            >
              {t('common:text-filter')}{' '}
              {visible ? (
                <ArrowUp className="ms-2" />
              ) : (
                <ArrowDown className="ms-2" />
              )}
            </button> */}
          </div>
      </div>
    </Card>
    <TemplateList
      isFetching={isFetching}
      data={data?.data}
      paginatorInfo={paginatorInfo}
    />

    <div className='flex w-full justify-end'>
                <Pagination
                    total={paginatorInfo?.total}
                    current={paginatorInfo?.currentPage}
                    pageSize={paginatorInfo?.perPage}
                    onChange={handlePagination}
                    className='mt-3'
                />
            </div>
    </>
  )
}

MessagingTemplatesScreen.Layout = Layout
MessagingTemplatesScreen.authenticate = {
  permissions:adminOnly
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});