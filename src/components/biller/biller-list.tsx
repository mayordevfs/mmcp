import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import { Merchant, SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';

export type IProps = {
  merchants: Merchant[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const BillerList = ({ merchants, onSort, onOrder }: IProps) => {
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
      // render: (text: any, record: any, index: number) => {
      //   // Calculate serial number based on current page and page size
      //   const { currentPage = 1, perPage = 20 } = paginatorInfo || {};
      //   return (currentPage - 1) * perPage + index + 1;
      // },
    },
    {
      title: t('table:table-item-biller-code'),
      dataIndex: 'billerCode',
      key: 'billerCode',
      align: 'center',
      width: 80,
      render: (billerCode:string)=>(
        <span className='whitespace-nowrap'>{billerCode}</span>
      )
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-biller-name')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'billerName'
          }
          isActive={sortingObj.column === 'billerName'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'billerName',
      key: 'billerName',
      align: alignLeft,
      width: 100,
      onHeaderCell: () => onHeaderClick('billerName'),
      render: (billerName:string)=>(
        <span className='whitespace-nowrap'>{billerName}</span>
      )
    },
    // {
    //   title: t('table:table-item-bank-name'),
    //   dataIndex: 'bankName',
    //   key: 'bankName',
    //   align: 'center',
    //   width: 80,
    //   render: (bankName:string)=>(
    //     <span className='whitespace-nowrap'>{bankName}</span>
    //   )
    // },
    {
      title: t('table:table-item-biller-short-name'),
      dataIndex: 'billerShortName',
      key: 'billerShortName',
      align: 'center',
      width: 80,
      render: (billerShortName:string)=>(
        <span className='whitespace-nowrap'>{billerShortName}</span>
      )
    },
    {
      title: t('table:table-item-biller-category'),
      dataIndex: 'billerCategory',
      key: 'billerCategory',
      align: 'center',
      width: 80,
      render: (billerCategory:string)=>(
        <span className='whitespace-nowrap'>{billerCategory}</span>
      )
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 80,
      render: (status: string) => (
        <span className="capitalize whitespace-nowrap">{status?.toLowerCase()}</span>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'billerCode',
      key: 'billerCode',
      align: 'center',
      width: 80,
      render: (billerCode: string, _: any, record: any) => (
        <ActionButtons
          id={billerCode}
          billerCode={record.billerCode}
          editUrl={`${Routes.biller.list}/edit/${billerCode}`}
          editModalView="BILLER_EDIT"
          editViewModal="BILLER_VIEW"
          // updateView="BILLER_UPDATE"
          // showBillerModal={true}
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
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default BillerList;