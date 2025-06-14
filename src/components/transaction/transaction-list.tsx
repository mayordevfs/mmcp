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

const TransactionList = ({
  merchants,
  onSort,
  onOrder,
  paginatorInfo,
  onPagination,
  isFetching,
}: IProps) => {
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
      title: t('table:table-item-transaction-serial-no'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 50,
      render: (id:string)=>(
        <span className='whitespace-nowrap'>{id}</span>
      )
    },
    {
      title: t('table:table-item-transaction-ref'),
      dataIndex: 'tranRefNo',
      key: 'transactionRef',
      align: alignLeft,
      width: 180,
      render: (tranRefNo:string)=>(
        <span className='whitespace-nowrap'>{tranRefNo}</span>
      )
    },
    {
      title: t('table:table-item-posted-date'),
      dataIndex: 'createdDate',
      key: 'postedDate',
      align: alignLeft,
      width: 180,
      render: (createdDate:string)=>(
        <span className='whitespace-nowrap'>{createdDate}</span>
      )
    },
    {
      title: t('table:table-item-transaction-type'),
      dataIndex: 'tranType',
      key: 'tranType',
      align: alignLeft,
      width: 150,
      render: (tranType:string)=>(
        <span className='whitespace-nowrap'>{tranType}</span>
      )
    },
    {
      title: t('table:table-item-amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: alignLeft,
      width: 80,
      render: (amount: number) =>(
        <span className='whitespace-nowrap'>{formatPrice({ amount, currencyCode: 'NGN', locale: 'en-NG' })}</span>
      )
        
      
        
    },

    {
      title: t('table:table-item-terminal-id'),
      dataIndex: 'terminalId',
      key: 'terminalID',
      align: alignLeft,
      width: 80,
      render: (terminalId:string)=>(
        <span className='whitespace-nowrap'>{terminalId}</span>
      )
    },
    // {
    //   title: t('table:table-item-rrn'),
    //   dataIndex: 'rrn',
    //   key: 'rrn',
    //   align: 'center',
    //   width: 80,
    // },
    // {
    //   title: t('table:table-item-stan'),
    //   dataIndex: 'stan',
    //   key: 'stan',
    //   align: 'center',
    //   width: 80,
    // },
    //     {
    //   title: t('table:table-item-wallet-id'),
    //   dataIndex: 'name',
    //   key: 'walletID',
    //   align: alignLeft,
    //   width: 80,
    // },
    {
      title: t('table:table-item-posted-by'),
      dataIndex: 'createdBy',
      key: 'postedBy',
      align: alignLeft,
      width: 80,
      render: (createdBy:string)=>(
        <span className='whitespace-nowrap'>{createdBy}</span>
      )
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 80,
      render: (status: string) => (
        <Badge className='whitespace-nowrap' text={status} color={getStatusColor(status)} />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'tranRefNo',
      key: 'actions',
      align: 'center',
      width: 50,
      render: (transactionRef: string) => (
        <ActionButtons
          id={transactionRef}
          // editUrl={`${Routes.merchant.list}/edit/${transactionRef}`}
          detailsUrl={`${Routes.transaction.list}/${transactionRef}`}
          // addTerminalUrl={`${Routes.merchant.list}/${id}/add-terminal`}
        />
      ),
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
          data={merchants}
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
