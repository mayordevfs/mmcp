import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { Routes } from '@/config/routes';
import Pagination from '@/components/ui/pagination';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { IProps } from '../transaction/transaction-list';
import Badge from '../ui/badge/badge';
import { get } from 'lodash';
import { getStatusColor } from '@/utils/data-mappers';

const MerchantList = ({
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
      title: t('table:table-item-serial-no'),
      dataIndex: 'serialNo',
      key: 'serialNo',
      align: 'center',
      width: 50,
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: t('table:table-item-merchant-id'),
      dataIndex: 'merchantId',
      key: 'merchantId',
      align: 'center',
      width: 240,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-name')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'businessName'
          }
          isActive={sortingObj.column === 'businessName'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'businessName',
      key: 'businessName',
      align: alignLeft,
      width: 140,
      onHeaderCell: () => onHeaderClick('businessName'),
    },
    {
      title: t('table:table-item-email'),
      dataIndex: 'email',
      key: 'email',
      align: alignLeft,
      width: 200,
    },
    {
      title: t('table:table-item-type-of-business'),
      dataIndex: 'businessType',
      key: 'businessType',
      align: 'center',
      width: 120,
    },
    {
      title: t('table:table-item-terminal-id'),
      dataIndex: 'terminalId',
      key: 'terminalId',
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
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 100,
      render: (status: string) => (
        <Badge text={status} color={getStatusColor(status)} />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'merchantId',
      key: 'merchantId',
      align: 'center',
      width: 50,
      render: (merchantId: string, { slug, is_active }: any) => (
        <ActionButtons
          id={merchantId}
          editUrl={`${Routes.merchant.list}/edit/${merchantId}`}
          detailsUrl={`${Routes.merchant.list}/${merchantId}`}
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

export default MerchantList;
