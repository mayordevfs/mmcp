import { useTranslation } from 'next-i18next';
import { Table } from '@/components/ui/table';
import useGenerateReport from '@/hooks/useGenerateReport';
import Layout from '@/components/layouts/admin';
import { generateReportColumn } from '@/utils/locals';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';

const Generate = () => {
  const { t } = useTranslation();
  const { reports, isLoading, code, downloadMutation } = useGenerateReport();
  const [searchTerm, setSearch] = useState('');

  function handleSearch({ searchText }: { searchText: string }) {
    setSearch(searchText);
  }

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-view-report')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
            <Search onSearch={handleSearch} />
            
            <button
              onClick={handleDownload}
              disabled={downloadMutation.isLoading}
              className="ml-5 inline-flex h-12 flex-shrink-0 items-center justify-center rounded border border-transparent bg-accent px-5 py-0 font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-accent-hover focus:shadow focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {downloadMutation.isLoading ? (
                <span>{t('form:button-label-downloading')}</span>
              ) : (
                <span>{t('form:button-label-download-report')}</span>
              )}
            </button>
          </div>
        </div>
      </Card>

      <Table
        //@ts-ignore
        columns={generateReportColumn(reports)}
        emptyText={t('table:empty-table-data')}
        data={reports}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default Generate;
Generate.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});