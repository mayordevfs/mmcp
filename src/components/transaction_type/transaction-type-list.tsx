import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import Pagination from '@/components/ui/pagination';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
// import { IProps } from '../transaction/transaction-list';
import Badge from '../ui/badge/badge';
import { get } from 'lodash';
import { getStatusColor } from '@/utils/data-mappers';

// export type IProps = {
//   merchants: Merchant[] | undefined;
//   onSort: (current: any) => void;
//   onOrder: (current: string) => void;
//   onPagination: (current: number) => void;
//   paginatorInfo: MappedPaginatorInfo | null;
//   isFetching?: boolean;
// };
const TransactionTypeList = ({
  transType,
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
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: t('table:table-item-transaction-name'),
      dataIndex: 'tranName',
      key: 'tranName',
      align: 'center',
      width: 340,
    },
    {
      title: t('table:table-item-transaction-id'),
      dataIndex:"tranCode" ,
      key: 'tranCode',
      align: 'center',
      width: 240,
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-name')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc &&
    //         sortingObj.column === 'businessName'
    //       }
    //       isActive={sortingObj.column === 'businessName'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'businessName',
    //   key: 'businessName',
    //   align: alignLeft,
    //   width: 140,
    //   onHeaderCell: () => onHeaderClick('businessName'),
    // },
    {
      title: t('table:table-item-min-limit'),
      dataIndex: 'minLimit',
      key: 'minLimit',
      align: alignLeft,
      width: 200,
    },
    {
      title: t('table:table-item-max-limit'),
      dataIndex: 'maxLimit',
      key: 'maxLimit',
      align: 'center',
      width: 120,
    },
    {
      title: t('table:table-item-daily-limit'),
      dataIndex: 'dailyLimit',
      key: 'dailyLimit',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-charge-type'),
      dataIndex: 'chargeType',
      key: 'chargeType',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-charge'),
      dataIndex: 'charge',
      key: 'charge',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-cap-limit'),
      dataIndex: 'capLimit',
      key: 'capLimit',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-network-commission'),
      dataIndex: 'networkCommission',
      key: 'networkCommission',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-platform-commission'),
      dataIndex: 'platformCommission',
      key: 'platformCommission',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-merchant-commission'),
      dataIndex: 'agentCommission',
      key: 'agentCommission',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-aggregator-commission'),
      dataIndex: 'aggregatorCommission',
      key: 'aggregatorCommission',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-service-fee'),
      dataIndex: 'serviceFee',
      key: 'serviceFee',
      align: 'center',
      width: 80,
    },
    // {
    //   title: t('table:table-item-show-logo'),
    //   dataIndex: 'showLogo',
    //   key: 'showLogo',
    //   align: 'center',
    //   width: 120,
    //   render: (showLogo: boolean) => (
    //     <span>{showLogo ? t('common:text-yes') : t('common:text-no')}</span>
    //   ),
    // },
    // {
    //   title: t('table:table-item-verify-status'),
    //   dataIndex: 'verifyStatus',
    //   key: 'verifyStatus',
    //   align: 'center',
    //   width: 120,
    //   render: (verifyStatus: string) => (
    //     <span className="capitalize">{verifyStatus?.toLowerCase()}</span>
    //   ),
    // },
    // {
    //   title: t('table:table-item-status'),
    //   dataIndex: 'status',
    //   key: 'status',
    //   align: 'center',
    //   width: 100,
    //   render: (status: string) => (
    //     <Badge text={status} color={getStatusColor(status)} />
    //   ),
    // },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 50,
      render: (tranTypeId: string, { slug, is_active }: any) => (
        <ActionButtons
          id={tranTypeId}
          editUrl={`${Routes.transaction_type}/edit/${tranTypeId}`}
          
          // detailsUrl={`${Routes.transaction}/${tranTypeId}`}
          // addTerminalUrl={`${Routes.merchant.list}/${id}/add-terminal`}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={transType}
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

export default TransactionTypeList;
