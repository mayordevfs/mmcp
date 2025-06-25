import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import Pagination from '@/components/ui/pagination';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';

const TemplateList = ({
  transType,
  onSort,
  onOrder,
  data,
  isFetching,
  paginatorInfo
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
      render: (text: any, record: any, index: number) => {
        // Calculate serial number based on current page and page size
        const { currentPage = 1, perPage = 20 } = paginatorInfo || {};
        return (currentPage - 1) * perPage + index + 1;
      },
    },
    {
      title: t('Title'),
      dataIndex: 'title',
      key: 'title',
      align: 'left',
      width: 240,
      render:(title:string)=>(
        <span className='whitespace-nowrap'>{title}</span>
      )
    },
    {
      title: t('Message Type'),
      dataIndex:"msgType" ,
      key: 'msgType',
      align: 'left',
      width: 240,
      render:(msgType:string)=>(
        <span className='whitespace-nowrap'>{msgType}</span>
      )
    },
    {
      title: t('Template Code'),
      dataIndex: 'templateCode',
      key: 'templateCode',
      align: alignLeft,
      width: 200,
      render:(templateCode:string)=>(
        <span className='whitespace-nowrap'>{templateCode}</span>
      )
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 50,
      render: (templateId: string, { slug, is_active }: any) => (
        <ActionButtons
          id={templateId}
          detailsUrl={`${Routes.fetch_templates}/${templateId}`}
          editUrl={`${Routes.fetch_templates}/edit/${templateId}`}
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
      {/* {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )} */}
    </>
  );
};

export default TemplateList;
