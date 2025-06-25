import { useState } from 'react';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import LinkButton from '@/components/ui/link-button';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import { SortOrder } from '@/types';
import cn from 'classnames';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import TransactionTypeFilter from '@/components/transaction_type/category-type-filter.tsx';
import TransactionTypeList from '@/components/transaction_type/transaction-type-list';

import { useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import { useTransactionTypeStore } from '@/contexts/editContext/transactionTypeContext';
import { adminOnly } from '@/utils/auth-utils';

export default function TransactionTypePage() {
  const { t } = useTranslation();
  
  // Local component state for UI and API parameters
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [tranCode, setTranCode] = useState('');
  const [applyFilter, setApplyFilter] = useState(false);

  // Get the setter function from our store
  const { setTransactionTypes } = useTransactionTypeStore();
  
  // Keep the API call in the component
  const {
    data,
    isLoading: loading,
    isFetching,
    error,
  } = useQuery(
    ['transType', page, applyFilter],
    () =>
      axiosInstance.request({
        method: 'GET',
        url: 'transTypeSetup/getTransactionTypes',
        params: {
          pageNumber: page,
          pageSize: 10,
          entityCode:"ETZ",
          tranCode
        },
      }),
    {
      onSuccess: (response) => {
        // When data is successfully fetched, update our store with JUST the transaction data array
        if (response?.data?.data) {
          setTransactionTypes(response.data.data);
        }
      }
    }
  );

  const handleSubmit = () => {
    setApplyFilter(!applyFilter);
    setPage(1);
  };

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={t('common:error-something-wrong')} />;

  function handlePagination(current: number) {
    setPage(current);
  }

  const handleTranCodeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setTranCode(e.target.value);
  };
  
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

  console.log(data);
  
  
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('Transaction Types')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2 justify-end">
            <LinkButton
              href={`${Routes.create_transaction_type}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>
                {t('form:button-label-create')}{' '}
                {t('Transaction Type')}
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
            <TransactionTypeFilter
              onTranCodeFilter={handleTranCodeFilter}
              handleSubmit={handleSubmit}
              tranCode={tranCode}
            />
          </div>
        </div>
      </Card>

      <TransactionTypeList
        isFetching={isFetching}
        onOrder={setOrder}
        onSort={setColumn}
        transType={data?.data?.data || []}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
      />
    </>
  );
}

TransactionTypePage.Layout = Layout;

TransactionTypePage.authenticate = {
  permissions:adminOnly
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});