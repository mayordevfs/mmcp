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
import CategoryTypeFilter from '@/components/terminal_monitoring/category-type-filter';
import TerminalHealthList from '@/components/terminal_monitoring/terminal-health-list';

export interface TerminalFilterType {
  // status: string;
  startDate: Date | null;
  endDate: Date | null;
  terminalId: string;
}
export default function TransactionsPage() {
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);

  const [termFilter, setTermFilter] = useState({
    startDate: null,
    endDate: null,
    terminalId: '',
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
  const handleDateChange = (date: Date | null, name: string) => {
    setTermFilter((prev) => ({
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
    ['terminalmonitoring', applyFilter],
    () =>
      axiosInstance.request({
        method: 'GET',
        url: 'terminal-health/list',
        params: {
          startDate: termFilter?.startDate
            ? formatDate(termFilter?.startDate)
            : firstDayOfYear,
          endDate: termFilter?.endDate
            ? formatDate(termFilter?.endDate)
            : today,
          // pageNumber: page,
          // pageSize: 10,
          terminalId: termFilter.terminalId||undefined,
          // status: termFilter.status || undefined,
        },
      }),
    {
      keepPreviousData: true,
    }
  );

  console.log(data);
  

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
        <div className="flex w-full flex-col items-center md:flex-row md:justify-between">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:input-label-terminal-monitoring')}
            </h1>
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
              termFilter={termFilter}
            />
          </div>
        </div>
      </Card>

      <TerminalHealthList
        isFetching={isFetching}
        result={data?.data?.data ?? []}
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
