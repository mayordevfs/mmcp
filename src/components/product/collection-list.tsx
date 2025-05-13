import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import { Merchant, SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import SelectInput from '@/components/ui/select-input';

export type IProps = {
  merchants: Merchant[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const CollectionList = ({ merchants, onSort, onOrder }: IProps) => {
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
      title: t('table:table-item-field-code'),
      dataIndex: 'fieldCode',
      key: 'fieldCode',
      align: 'center',
      width: 50,
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: t('table:table-item-field-name'),
      dataIndex: 'name',
      key: 'fieldName',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-field-length'),
      dataIndex: 'name',
      key: 'fieldLength',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-mandatory'),
      dataIndex: 'name',
      key: 'mandatory',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-input-type'),
      dataIndex: 'name',
      key: 'inputType',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-lookup-data'),
      dataIndex: 'name',
      key: 'lookupData',
      align: 'center',
      width: 80,
      render: (lookupData: string) => (
        <div className="max-w-[200px] truncate" title={lookupData}>
          {lookupData}
        </div>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 100,
      render: (id: string) => (
        <ActionButtons
          id={id}
          editUrl={`${Routes.merchant.list}/edit/${id}`}
          deleteModalView="DELETE_COLLECTION_FIELD"
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
        data={merchants}
        rowKey="id"
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default CollectionList;