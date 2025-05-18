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

export type IProps = {
  merchants: Merchant[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  onPagination: (current: number) => void;
  paginatorInfo: MappedPaginatorInfo | null;
  isFetching?: boolean;
};

const TerminalHealthList = ({
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

  const columns = [
    {
      title: t('table:table-item-serial-no'),
      dataIndex: 'serialNo',
      key: 'serialNo',
      align: 'center',
      width: 50,
    },
    {
      title: t('table:table-item-terminal-id'),
      dataIndex: 'terminalId',
      key: 'terminalId',
      align: alignLeft,
      width: 180,
    },
    {
      title: t('table:table-item-log-date'),
      dataIndex: 'logDate',
      key: 'logDate',
      align: alignLeft,
      width: 180,
    },
    {
      title: t('table:table-item-merchant-location'),
      dataIndex: 'merchantLocation',
      key: 'merchantLocation',
      align: alignLeft,
      width: 150,
    },
    {
      title: t('table:table-item-geolocation'),
      dataIndex: 'geolocation',
      key: 'geolocation',
      align: alignLeft,
      width: 80,
      render: (amount: number) =>
        formatPrice({ amount, currencyCode: 'NGN', locale: 'en-NG' }),
    },

    {
      title: t('table:table-item-battery-status'),
      dataIndex: 'batteryStatus',
      key: 'batteryStatus',
      align: alignLeft,
      width: 80,
    },
    {
      title: t('table:table-item-network-data'),
      dataIndex: 'networkData',
      key: 'networkData',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-sim'),
      dataIndex: 'sim',
      key: 'sim',
      align: 'center',
      width: 80,
    },
        {
      title: t('table:table-item-charge-state'),
      dataIndex: 'chargeState',
      key: 'chargeState',
      align: alignLeft,
      width: 80,
    },
    {
      title: t('table:table-item-printer-status'),
      dataIndex: 'printerStatus',
      key: 'printerStatus',
      align: alignLeft,
      width: 80,
    },
    // {
    //   title: t('table:table-item-status'),
    //   dataIndex: 'status',
    //   key: 'status',
    //   align: 'center',
    //   width: 80,
    //   render: (status: string) => (
    //     <Badge text={status} color={getStatusColor(status)} />
    //   ),
    // },
    // {
    //   title: t('table:table-item-actions'),
    //   dataIndex: 'tranRefNo',
    //   key: 'actions',
    //   align: 'center',
    //   width: 50,
    //   render: (transactionRef: string) => (
    //     <ActionButtons
    //       id={transactionRef}
    //       // editUrl={`${Routes.merchant.list}/edit/${transactionRef}`}
    //       detailsUrl={`${Routes.transaction.list}/${transactionRef}`}
    //       // addTerminalUrl={`${Routes.merchant.list}/${id}/add-terminal`}
    //     />
    //   ),
    // },
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

export default TerminalHealthList;
