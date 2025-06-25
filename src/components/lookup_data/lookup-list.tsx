import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import Pagination from '@/components/ui/pagination';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';

const LookupList = ({
  onSort,
  onOrder,
  data,
  isFetching,
  paginatorInfo,
  onPagination
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
      title: t('Category'),
      dataIndex:"categoryCode" ,
      key: 'categoryCode',
      align: 'left',
      width: 240,
      render:(categoryCode:string)=>(
        <span className='whitespace-nowrap'>{categoryCode}</span>
      )
    },
    {
      title: t('Name'),
      dataIndex: 'lookupName',
      key: 'lookupName',
      align: 'left',
      width: 240,
      render:(lookupName:string)=>(
        <span className='whitespace-nowrap'>{lookupName}</span>
      )
    },
    {
      title: t('Description'),
      dataIndex: 'lookupDesc',
      key: 'lookupDesc',
      align: alignLeft,
      width: 200,
      render:(lookupDesc:string)=>(
        <span className='whitespace-nowrap'>{lookupDesc}</span>
      )
    },


    {
      title: t('table:table-item-actions'),
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      align: 'center',
      width: 50,
      render: (categoryCode: string, record: any) => (
        <ActionButtons
          id={categoryCode}
          lookupEditModal={'LOOKUP_MODAL'}
          lookup={record}
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

export default LookupList;
