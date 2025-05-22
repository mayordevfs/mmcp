import { useEffect, useState } from 'react';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';

import Search from '@/components/common/search';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';

import cn from 'classnames';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import axiosInstance from '@/utils/fetch-function';
import { useQuery } from 'react-query';
import { ActionMeta } from 'react-select';
import CategoryTypeFilter from '@/components/reconciled_transaction/category-type-filter';
import Button from '@/components/ui/button';
import StickerCard from '@/components/widgets/sticker-card';
import TransactionList from '@/components/reconciled_transaction/transaction-list';
import UploadReconciledTransactionModal from './link';
import ReconciledTransactionsCards from '@/components/reconciled_transaction/reconciledTransactionsCard';
export interface ReconciledTransactionFilterType {
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  rrn: string;
}
export default function ReconcileTransactionsPage() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [page, setPage] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isUploadModal,setisUploadModal] = useState(false)

  const [termFilter, setTermFilter] = useState({
    status: '',
    startDate: null,
    endDate: null,
    rrn: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTermFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSelectChange = (
    selectedOption: any,
    actionMeta: ActionMeta<unknown>
  ) => {
    const name = actionMeta.name as string;
    setTermFilter((prev) => ({
      ...prev,
      [name]: selectedOption?.value ?? '',
    }));
  };

  console.log(termFilter);
  
  const handleDateChange = (date: Date | null, name: string) => {
    setTermFilter((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  
  const [applyFilter, setApplyFilter] = useState(false);
  const handleSubmit: () => void = () => {
    setApplyFilter((prev) => !prev);
    setPage(0);
  };
  const getFirstDayOfYear = () => {
    const year = new Date().getFullYear();
    return `01-01-${year}`;
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const today = formatDate(new Date());
  const firstDayOfYear = getFirstDayOfYear();
  console.log(firstDayOfYear);
 
  const { error, data, isLoading, isFetching } = useQuery(
    ['settlementTrans',applyFilter],
    () =>
      axiosInstance.request({
        method: 'GET',
        url: 'settletrans/list',
        params: {
          startDate: termFilter?.startDate
            ? formatDate(termFilter?.startDate)
            : "01-01-2020",
          endDate: termFilter?.endDate
            ? formatDate(termFilter?.endDate)
            : today,
          status:termFilter?.status||"",
          pageNumber:page,
          pageSize:20,
          rrn:termFilter?.rrn||undefined
        },
      }),
    {
      keepPreviousData: true,
    }
  );  
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

  console.log(data);
  
  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error)
    return (
      <ErrorMessage
        message={(error as any)?.message ?? t('common:text-error')}
      />
    );

  return (
    <>
     <ReconciledTransactionsCards/>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/2">
            <h1 className="text-lg font-semibold text-heading">
              {t('Reconciled Transactions')}
            </h1>
          </div>
          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2 lg:justify-end">
            <Button
              onClick={() => setisUploadModal(true)}
              className=""
            > <span>{t('form:input-label-upload')}</span></Button>
             
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
            <CategoryTypeFilter
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleDateChange={handleDateChange}
              handleSubmit={handleSubmit}
              termFilter={termFilter}
            />
          </div>
        </div>
      </Card>

      <TransactionList
        isFetching={isFetching}
        result={data?.data?.transactions ?? []}
        onOrder={setOrder}
        onSort={setColumn}
        paginatorInfo={newPaginatorInfo}
        onPagination={handlePagination}
      />

      {/* Upload reconciled transaction modal */}
      <UploadReconciledTransactionModal
      open={isUploadModal}
      onClose={()=>setisUploadModal(false)}
      />
    </>

  );
}

ReconcileTransactionsPage.authenticate = {
  permissions: adminOnly,
};

ReconcileTransactionsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
