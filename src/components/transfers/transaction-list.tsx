import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import { MappedPaginatorInfo, Merchant, SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import Pagination from '@/components/ui/pagination';
import Badge from '../ui/badge/badge';
import { formatPrice } from '@/utils/use-price';
import Loader from '../ui/loader/loader';
import { getStatusColor } from '@/utils/data-mappers';
import { render } from '@headlessui/react/dist/utils/render';

export type IProps = {
  merchants: Merchant[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  onPagination: (current: number) => void;
  paginatorInfo: MappedPaginatorInfo | null;
  isFetching?: boolean;
};

const TransactionList = ({
  result,
  onSort,
  onOrder,
  paginatorInfo,
  onPagination,
  isFetching,
}: any) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const currencies: any = {
    MNGN: '₦',
    USDT: '$',
    GBP: '£'
  }

  const columns = [
    {
      title: t('table:table-item-serial-no'),
      dataIndex: 'serialNo',
      key: 'serialNo',
      align: 'center',
      width: 50,
      render: (_: any, __: any, index: number) => <span className="whitespace-nowrap">{index + 1}</span>,
    },

    {
      title: t('Beneficiary Name'),
      dataIndex: 'beneficiaryName',
      key: 'beneficiaryName',
      align: 'center',
      width: 80,
      render: (beneficiaryName: string) => (
        <span className='whitespace-nowrap'>{beneficiaryName?beneficiaryName:'N/A'}</span>
      )
    },

    {
      title: t('Sender Name'),
      dataIndex: 'senderName',
      key: 'senderName',
      align: 'center',
      width: 80,
      render: (senderName: string) => (
        <span className='whitespace-nowrap'>{senderName?senderName:'N/A'}</span>
      )
    },
    {
      title: t('Amount(Sent)'),
      dataIndex: 'sendAmount',
      key: 'sendAmount',
      align: 'center',
      width: 80,
      render: (sendAmount: string, record: any) => {
        const formattedAmount = formatPrice({
          amount: parseFloat(sendAmount) || 0,
          currencyCode: record.sendCcy,
          locale: 'en'
        });
        return (
          <span className='whitespace-nowrap'>
            {sendAmount?`${currencies[record.sendCcy] || ''}${parseFloat(sendAmount||'0').toLocaleString('en-us',{
              maximumFractionDigits:2,
              minimumFractionDigits:2
            }

            )}`:'N/A'}
          </span>
        );
      }
    },

    {
      title: t('Amount(Received)'),
      dataIndex: 'receiveAmount',
      key: 'receiveAmount',
      align: 'center',
      width: 80,
      render: (receiveAmount: string, record: any) => {
        const formattedAmount = formatPrice({
          amount: parseFloat(receiveAmount) || 0,
          currencyCode: record.receiveCcy,
          locale: 'en'
        });
        return (
          <span className='whitespace-nowrap'>
            {receiveAmount?`${currencies[record.sendCcy] || ''}${parseFloat(receiveAmount||'0').toLocaleString('en-us',{
              maximumFractionDigits:2,
              minimumFractionDigits:2
            }

            )}`:'N/A'}
          </span>
        );
      }
    },
    {
      title: t('Rate'),
      dataIndex: 'exchRate',
      key: 'exchRate',
      align: 'center',
      width: 80,
      render: (exchRate: string,record:any) => (
        <span className='whitespace-nowrap'>
            {exchRate?`${currencies[record.sendCcy] || ''}${parseFloat(exchRate||'0').toLocaleString('en-us',{
              maximumFractionDigits:2,
              minimumFractionDigits:2
            }

            )}`:'N/A'}
          </span>
      )
    },
    {
      title: t('Beneficiary Bank'),
      dataIndex: 'beneficiaryBankName',
      key: 'beneficiaryBankName',
      align: 'center',
      width: 80,
      render: (beneficiaryBankName: string) => (
        <span className='whitespace-nowrap'>{beneficiaryBankName?beneficiaryBankName:'N/A'}</span>
      )
    },
    {
      title: t('Beneficiary A/c No'),
      dataIndex: 'beneficiaryAccount',
      key: 'beneficiaryAccount',
      align: 'center',
      width: 80,
      render: (beneficiaryAccount: string) => (
        <span className='whitespace-nowrap'>{beneficiaryAccount?beneficiaryAccount:'N/A'}</span>
      )
    },
    {
      title: t('Created Date'),
      dataIndex: 'createdDate',
      key: 'createdDate',
      align: 'center',
      width: 80,
      render: (createdDate: string) => (
        <span className='whitespace-nowrap'>{createdDate?createdDate:'N/A'}</span>
      )
    },

    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 80,
      render: (status: string) => (
        <Badge text={status} color={getStatusColor(status)} />
      ),
    },
    {
      title: t('Purpose'),
      dataIndex: 'purpose',
      key: 'purpose',
      align: 'center',
      width: 80,
      render: (purpose: string) => (
        <span className='whitespace-nowrap'>{purpose?purpose:'N/A'}</span>
      )
    },
  ];

  if (isFetching) {
    return <Loader text={t('common:text-loading')} />;
  }

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={result}
          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>
      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default TransactionList;