import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import { Merchant, SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';

export type IProps = {
  terminals: Merchant[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const TerminalList = ({ terminals, onSort, onOrder }: IProps) => {
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
      title: t('table:table-item-terminal-serial-no'),
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      align: 'center',
      width: 80,
      render:(serialNumber:string)=>{
        return <span className='whitespace-nowrap'>{serialNumber}</span>
      }
    },
    {
      title: t('table:table-item-terminal-id'),
      dataIndex: 'terminalId',
      key: 'terminalId',
      align: 'center',
      width: 80,
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-name')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
    //       }
    //       isActive={sortingObj.column === 'name'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'name',
    //   key: 'name',
    //   align: alignLeft,
    //   width: 80,
    //   onHeaderCell: () => onHeaderClick('name'),
    // },
    {
      title: t('table:table-item-terminal-model'),
      dataIndex: 'terminalModel',
      key: 'terminalModel',
      align: alignLeft,
      width: 80,
    },
    {
      title: t('table:table-item-merchant-id'),
      dataIndex: 'merchantId',
      key: 'merchantId',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-bank-name'),
      dataIndex: 'bankName',
      key: 'bankName',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-teller'),
      dataIndex: 'name',
      key: 'teller',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-ptsp'),
      dataIndex: 'ptsp',
      key: 'ptsp',
      align: 'center',
      width: 80,
    },
    {
      title: t('table:table-item-address'),
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      width: 80,
      render:(address:string)=>{
        return <span className='whitespace-nowrap'>{address}</span>
      }
    },
    // {
    //   title: t('table:table-item-terminal-name'),
    //   dataIndex: 'name',
    //   key: 'terminalName',
    //   align: 'center',
    //   width: 80,
    // },
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
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 50,
      render: (id: string, { slug, is_active }: any) => (
        <ActionButtons
          id={id}
          editUrl={`${Routes.merchant.list}/edit/${id}`}
          detailsUrl={`/${slug}`}
          // addTerminalUrl={`${Routes.merchant.list}/${id}/add-terminal`}
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
        data={terminals}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default TerminalList;