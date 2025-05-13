import { useState } from 'react';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import BillerList from '@/components/biller/biller-list';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useShippingClassesQuery } from '@/data/merchant';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import axiosInstance from '@/utils/fetch-function';
import { useQuery } from 'react-query';
import BillerTypeFilter from '@/components/biller/category-type-filter';
import { billerValidationSchema } from '@/components/biller/biller-validation-schema';

export default function BillersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const locale = router.locale;

  const [searchTerm, setSearch] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const { data, isLoading, error } = useQuery(
    'billers',
    () =>
      axiosInstance.request({
        method: 'GET',
        url: 'mbillcollection/getBillersList',
        params: {
          pageNumber: page,
          pageSize: 20,
          // billerCode: "HOP12"
        },
      }),
    {}
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
    perPage: 20,
    prevPageUrl: null,
    to: 10,
    total: data?.data?.totalCount,
    hasMorePages: data?.data?.totalPages > page,
  };

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  if (isLoading) return <Loader text={t('common:text-loading')} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearch(searchText);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  const handleNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setName(e.target.value);
  };

  const handleCodeFilter = (selectedOption: any) => {
    setPage(1);
    setCode(selectedOption?.value || null);
  };

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-billers')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
            <Search onSearch={handleSearch} />

            <LinkButton
              href={`${Routes.biller.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>
                {t('form:button-label-create')} {t('form:button-label-biller')}
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
            <BillerTypeFilter
              onCodeFilter={handleCodeFilter}
              onNameFilter={handleNameFilter}
            />
          </div>
        </div>
      </Card>

      <BillerList
        onOrder={setOrder}
        onSort={setColumn}
        merchants={data?.data?.billers ?? []}
      />
    </>
  );
}

BillersPage.authenticate = {
  permissions: adminOnly,
};

BillersPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
