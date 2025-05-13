import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { MappedPaginatorInfo, SortOrder, User } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import Badge from '../ui/badge/badge';

type IProps = {
  customers: User[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CustomerList = ({
  customers,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: any | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: any | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );

      onOrder(column);

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
      width: 80,
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-username')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'username'
          }
          isActive={sortingObj.column === 'username'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'username',
      key: 'username',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('username'),
      render: (username: string) => (
        <span className="whitespace-nowrap">{username}</span>
      ),
    },
    {
      title: t('table:table-item-fullname'),
      dataIndex: 'name',
      key: 'fullName',
      align: alignLeft,
      render: (_: any, record: User) => <span>{`${record?.fullname} `}</span>,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-email')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'email'
          }
          isActive={sortingObj.column === 'email'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'email',
      key: 'email',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('email'),
    },
    {
      title: t('table:table-item-mobile-no'),
      dataIndex: 'mobileNo',
      key: 'mobileNo',
      align: 'center',
      render: (mobileNo: any) => <span className="capitalize">{mobileNo}</span>,
    },
    {
      title: t('table:table-item-user-role'),
      dataIndex: 'userRole',
      key: 'userRole',
      align: 'center',
      render: (userRole: any) => <span className="capitalize">{userRole}</span>,
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: string) => (
        <Badge
          text={status ? t('common:active') : t('common:inactive')}
          color={status ? 'bg-green-400' : 'bg-red-500'}
        />
      ),
    },
    {
      title: t('table:table-item-branch'),
      dataIndex: 'branchCode',
      key: 'branchCode',
      align: 'center',
      render: (branchCode: any) => branchCode,
    },
    // {
    //   title: t('table:table-item-actions'),
    //   dataIndex: 'id',
    //   key: 'actions',
    //   align: 'right',
    //   render: function Render(id: string, { status }: any) {
    //     const { data } = useMeQuery();
    //     return (
    //       <>
    //         {data?.id != id && (
    //           <ActionButtons
    //             id={id}
    //             userStatus={true}
    //             isUserActive={status?.toLowerCase() === 'active'}
    //             showAddWalletPoints={true}
    //             showMakeAdminButton={true}
    //           />
    //         )}
    //       </>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={customers}
          rowKey="id"
          scroll={{ x: 800 }}
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

export default CustomerList;
