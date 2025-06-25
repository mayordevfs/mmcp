import { useState } from 'react';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import MerchantList from '@/components/merchant/merchant-list';
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
import MerchantTypeFilter from '@/components/merchant/category-type-filter';
import axiosInstance from '@/utils/fetch-function';
import { useQuery } from 'react-query';

export default function MerchantsPage() {
  const { t } = useTranslation();

  const [searchTerm, setSearch] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [applyFilter,setApplyFilter] = useState(false)
  const {
    data,
    isLoading: loading,
    isFetching,
    error,
  } = useQuery(
    ['merchants', page,applyFilter],
    () =>
      axiosInstance.request({
        method: 'GET',
        url: '/merchant/all',
        params: {
          pageNumber: page,
          pageSize: 100,
          name,
          merchantId:code
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
    perPage: 100,
    prevPageUrl: null,
    to: 10,
    total: data?.data?.totalItems,
    hasMorePages: data?.data?.totalPages > page,
  };

  console.log(data);
  

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  if (loading) return <Loader text={t('common:text-loading')} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearch(searchText);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  const handleNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCodeFilter = (selectedOption: any) => {
    setCode(selectedOption?.value || null);
  };

  const handleApplyFilter = ()=>{
    setPage(1)
    setApplyFilter(!applyFilter)
  }
  
  if(error) return <ErrorMessage message={`Something went wrong!`}/>
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-merchants')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
            <Search onSearch={handleSearch} />

            <LinkButton
              href={`${Routes.merchant.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>
                {t('form:button-label-create')}{' '}
                {t('form:button-label-merchant')}
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
            <MerchantTypeFilter
              onCodeFilter={handleCodeFilter}
              onNameFilter={handleNameFilter}
              handleApplyFilter ={handleApplyFilter}
            />
          </div>
        </div>
      </Card>

      <MerchantList
        isFetching={isFetching}
        onOrder={setOrder}
        onSort={setColumn}
        merchants={data?.data?.content ?? []}
        paginatorInfo={newPaginatorInfo}
        onPagination={handlePagination}
      />
    </>
  );
}

MerchantsPage.authenticate = {
  permissions: adminOnly,
};

MerchantsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
