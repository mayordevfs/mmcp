import { useState } from 'react';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import TerminalList from '@/components/terminal/terminal-list';
import Search from '@/components/common/search';
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
import CategoryTypeFilter from '@/components/terminal/category-type-filter';
import LinkTerminalModal from './link';
import LinkButton from '@/components/ui/link-button';
import axiosInstance from '@/utils/fetch-function';
import { useQuery } from 'react-query';
import Link from 'next/link';

export default function TerminalsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const locale = router.locale;

  const [searchTerm, setSearch] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [terminalId, setTerminalId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [bankCode,setBankCode] = useState('')
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [applyFilter,setApplyFilter] = useState(false)
  const { data, isLoading: loading } = useQuery(
    ['terminals',page,applyFilter],
    () =>
      axiosInstance.request({
        method: 'GET',
        url: '/terminals/all',
        params: {
          pageNumber: page,
          pageSize: 100,
          name:searchTerm,
          entityCode: 'ETZ',
          status,
          bankCode:bankCode,
          terminalId:terminalId,
        },
      }),
    {}
  );

  console.log(bankCode);
  

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
    total: data?.data?.totalCount,
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

  const handleTerminalIdFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerminalId(e.target.value);
  };

  const handleStatusFilter = (selectedOption: any) => {
    setStatus(selectedOption?.value || null);
  };

  const handleBankCodeFilter = (selectedOption: any) => {
    setBankCode(selectedOption?.id || null);
  };

  const handleApplyFilter = ()=>{
    setApplyFilter(!applyFilter)
  }
  
  
  
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-terminals')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
            {/* <Search onSearch={handleSearch} /> */}
            {/* <button className="ml-5 inline-flex h-12 flex-shrink-0 items-center justify-center rounded border border-transparent bg-accent px-5 py-0 font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-accent-hover focus:shadow focus:outline-none">
              <Link href={'/terminals/create'}>Create Terminal</Link>
            </button> */}

            <button
              onClick={() => setIsLinkModalOpen(true)}
              className="ml-5 inline-flex h-12 flex-shrink-0 items-center justify-center rounded border border-transparent bg-accent px-5 py-0 font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-accent-hover focus:shadow focus:outline-none"
            >
              <span>{t('form:button-label-link-terminal')}</span>
            </button>

            <LinkButton
              href={`${Routes.terminal.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>
                + {t('form:button-label-add')} {t('form:button-label-terminal')}
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
            <CategoryTypeFilter
              onStatusFilter={handleStatusFilter}
              onTerminalIdFilter={handleTerminalIdFilter}
              onBankCodeFilter={handleBankCodeFilter}
              onApplyFilter={handleApplyFilter}
            />
          </div>
        </div>
      </Card>

      <TerminalList
        onOrder={setOrder}
        onSort={setColumn}
        terminals={data?.data?.terminalList ?? []}
        paginatorInfo={newPaginatorInfo}
        onPagination={handlePagination}
      />

      {/* Link Terminal Modal */}
      <LinkTerminalModal
        open={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </>
  );
}

TerminalsPage.authenticate = {
  permissions: adminOnly,
};

TerminalsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
