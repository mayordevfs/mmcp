import { useState } from 'react';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import TransactionList from '@/components/transaction/transaction-list';
import Search from '@/components/common/search';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import CategoryTypeFilter from '@/components/transaction/category-type-filter';
import cn from 'classnames';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import axiosInstance from '@/utils/fetch-function';
import { useQuery } from 'react-query';
import { ActionMeta } from 'react-select';
export interface TranFilterType {
  transactionType: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  rrn: string;
  merchantCode: string;
  name: string;
  terminalId: string;
}
export default function TransactionsPage() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);

  const [transFilter, setTransFilter] = useState({
    transactionType: '',
    status: '',
    startDate: null,

    endDate: null,
    rrn: '',
    merchantCode: '',
    name: '',
    terminalId: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSelectChange = (
    selectedOption: any,
    actionMeta: ActionMeta<unknown>
  ) => {
    const name = actionMeta.name as string;
    setTransFilter((prev) => ({
      ...prev,
      [name]: selectedOption?.value ?? '',
    }));
  };
  const handleDateChange = (date: Date | null, name: string) => {
    setTransFilter((prev) => ({
      ...prev,
      [name]: date,
    }));
  };
  const [applyFilter, setApplyFilter] = useState(false);
  const handleSubmit: () => void = () => {
    setApplyFilter((prev) => !prev);
    setPage(1);
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

  const { error, data, isLoading, isFetching } = useQuery(
    ['transactions', page, applyFilter],
    () =>
      axiosInstance.request({
        method: 'GET',
        url: 'transactionmanager/tranmasterlist',
        params: {
          startDate: transFilter?.startDate
            ? formatDate(transFilter?.startDate)
            : firstDayOfYear,
          endDate: transFilter?.endDate
            ? formatDate(transFilter?.endDate)
            : today,
          pageNumber: page,
          pageSize: 10,
          searchFilter: searchTerm,
          rrn: transFilter.rrn || undefined,
          terminalId: transFilter.terminalId || undefined,
          status: transFilter.status || undefined,
          tranCode: transFilter.transactionType || undefined,
          name: transFilter.name || undefined,
          merchantCode: transFilter.merchantCode || undefined,
        },
      }),
    {
      keepPreviousData: true,
    }
  );

  const newPaginatorInfo = {
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
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:input-label-transactions')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-3/4">
            <Search onSearch={handleSearch} />
          </div>

          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
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
              tranFilter={transFilter}
            />
          </div>
        </div>
      </Card>

      <TransactionList
        isFetching={isFetching}
        merchants={data?.data?.transactions ?? []}
        onOrder={setOrder}
        onSort={setColumn}
        paginatorInfo={newPaginatorInfo}
        onPagination={handlePagination}
      />
    </>
  );
}

TransactionsPage.authenticate = {
  permissions: adminOnly,
};

TransactionsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
