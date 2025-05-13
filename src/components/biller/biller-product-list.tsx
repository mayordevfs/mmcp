import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import { Merchant, SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';

export type IProps = {
  products: Merchant[] | undefined;
  // billerCode: Merchant[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const BillerProductList = ({ products, onSort, onOrder }: IProps) => {
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
      width: 30,
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: t('table:table-item-product-id'),
      dataIndex: 'productId',
      key: 'productId',
      align: 'center',
      width: 50,
    },
    {
      title: t('table:table-item-product-code'),
      dataIndex: 'productCode',
      key: 'productCode',
      align: 'center',
      width: 50,
    },
    {
      title: t('table:table-item-product-name'),
      dataIndex: 'productName',
      key: 'productName',
      align: 'center',
      width: 50,
    },
    {
      title: t('table:table-item-amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 50,
    },
    {
      title: t('table:table-item-amount-type'),
      dataIndex: 'amountType',
      key: 'amountType',
      align: 'center',
      width: 50,
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 50,
      render: (status: string) => (
        <span className="capitalize">{status?.toLowerCase()}</span>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 80,
      render: (id: string) => (
        <ActionButtons
          id={id}
          editUrl={`/billers/edit-product/${id}`}
          deleteModalView="DELETE_PRODUCT"
        />
      ),
    },
  ];

  return (
    <div className="mb-8 overflow-hidden rounded shadow">
      <Table
        //@ts-ignore
        columns={columns}
        emptyText={t('table:empty-table-data')}
        data={products}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default BillerProductList;