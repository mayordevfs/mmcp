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
import LinkButton from '@/components/ui/link-button';
import useGetLookup from '@/hooks/useGetLookup';

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
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const reportCodes = useGetLookup('REPORT_CODE');

  console.log(reportCodes);
  

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  function handleSearch({ searchText }: { searchText: string }) {
    setSearch(searchText);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  const handleTerminalIdFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setTerminalId(e.target.value);
  };

  const handleStatusFilter = (selectedOption: any) => {
    setPage(1);
    setStatus(selectedOption?.value || null);
  };

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-report')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
            <Search onSearch={handleSearch} />

            {/* <LinkButton
              href={`${Routes.report.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>
                + {t('form:button-label-add')} {t('form:button-label-report')}
              </span>
            </LinkButton> */}

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
            />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-240 gap-8">
        {reportCodes?.map((reportCode) => (
          <Card key={reportCode.id} className="mb-4 flex flex-col gap-5">
            <h1 className="text-xl font-semibold text-heading">
              {reportCode.name}
            </h1>

            <LinkButton
              href={`${'/reports/generate'}?code=${reportCode.id}`}
              className="!h-8 w-full max-w-[100px] "
            >
              <span>View</span>
            </LinkButton>
          </Card>
        ))}
      </div>

      {/* <TerminalList
        onOrder={setOrder}
        onSort={setColumn}
        merchants={terminals}
      /> */}

      {/* Link Terminal Modal */}
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
