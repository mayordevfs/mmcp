import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import { Merchant, SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';

export type IProps = {
  collections: Merchant[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const BillerCollectionList = ({ collections, onSort, onOrder }: IProps) => {
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
      title: t('table:table-item-field-id'),
      dataIndex: 'fieldID',
      key: 'fieldID',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-field-name'),
      dataIndex: 'fieldName',
      key: 'fieldName',
      align: 'center',
      width: 50,
    },
    {
      title: t('table:table-item-data-type'),
      dataIndex: 'fieldDataType',
      key: 'fieldDataType',
      align: 'center',
      width: 50,
    },
    {
      title: t('table:table-item-max-length'),
      dataIndex: 'maxLength',
      key: 'maxLength',
      align: 'center',
      width: 100,
    },
    {
      title: t('table:table-item-mandatory'),
      dataIndex: 'mandatoryFlag',
      key: 'mandatoryFlag',
      align: 'center',
      width: 50,
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
          editUrl={`/billers/edit-payment-data/${id}`}
          deleteModalView="DELETE_PAYMENT_DATA"
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
        data={collections}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default BillerCollectionList;