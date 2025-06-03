import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import { MappedPaginatorInfo, Merchant, SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';

import { getStatusColor } from '@/utils/data-mappers';
import Badge from '@/components/ui/badge/badge';
import Loader from '@/components/ui/loader/loader';
import { formatPrice } from '@/utils/use-price';
import Pagination from '@/components/ui/pagination';
import { useModalState } from '@/components/ui/modal/modal.context';

const PosOrderList = ({
 data,
 isFetching,
 onPagination,
 paginatorInfo
}: any) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
  const {isOpen} = useModalState()
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const columns = [
    {
      title: t('table:table-item-serial-no'),
      dataIndex: 'serialNo',
      key: 'serialNo',
      align: 'center',
      width: 50,
      render: (text: any, record: any, index: number) => {
        // Calculate serial number based on current page and page size
        const { currentPage = 1, perPage = 20 } = paginatorInfo || {};
        return (currentPage - 1) * perPage + index + 1;
      },
    },
    {
      title: t('table:table-item-order-no'),
      dataIndex: 'orderNo',
      key: 'orderNo',
      align: alignLeft,
      width: 180,
    },
    {
      title: t('table:table-item-customer-name'),
      dataIndex: 'customerName',
      key: 'customerName',
      align: alignLeft,
      width: 180,
    },
    // {
    //   title: t('table:table-item-customer-id'),
    //   dataIndex: 'customerId',
    //   key: 'customerId',
    //   align: alignLeft,
    //   width: 180,
    // },
    {
      title: t('table:table-item-payment-method'),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      align: alignLeft,
      width: 150,
    },
    {
      title: t('table:table-item-amount-paid'),
      dataIndex: 'amount',
      key: 'amount',
      align: alignLeft,
      width: 80,
      render: (amount: number) => (
        <span>
          {formatPrice({
            amount:amount,
            currencyCode:"NGN",
            locale:'ng'
          })}
        </span>
      )
    },
    {
      title: t('table:table-item-date'),
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      align: alignLeft,
      width: 180,
    },  
    {
      title: t('table:table-item-order-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 80,
      render: (status: string) => (
        <Badge text={status} color={getStatusColor(status)} />
      ),
    },
     {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 50,
      render: (id:any,order:any) => (
        <ActionButtons
        id={id}
        detailsModal='POS_ORDER_VIEW'
        orderItems={order?.orderItemInfos}
        />
      ),
    },
  ];

  console.log(isOpen);
  

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
          data={data}
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

export default PosOrderList;