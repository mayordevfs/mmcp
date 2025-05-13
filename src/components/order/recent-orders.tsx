import { Table } from '@/components/ui/table';
import usePrice from '@/utils/use-price';

import { Order, OrderStatus } from '@/types';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import { useIsRTL } from '@/utils/locals';

type IProps = {
  orders: Order[];
  title?: string;
};

const RecentOrders = ({ orders, title }: IProps) => {
  const { t } = useTranslation();

  const { alignLeft } = useIsRTL();
  const rowExpandable = (record: any) => record.children?.length;
  const { data: summaryData } = useQuery('tran-summary', () =>
    axiosInstance.get('/dashboard/reportSection', {
      params: {
        rptCategory: 'TRAN_SUMMARY_STATUS',
        startDate: '10-01-2025',
        endDate: '31-10-2025',
        merchantCode: '',
        datePeriod: '',
      },
    })
  );

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      align: alignLeft,
      width: 150,
    },
    {
      title: 'amount',
      dataIndex: 'amount',
      key: 'amount',
      align: alignLeft,
      render: function Render(value: any) {
        const { price } = usePrice({
          amount: value,
        });
        return <span className="whitespace-nowrap">{price}</span>;
      },
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      align: alignLeft,
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: alignLeft,
      render: (status: OrderStatus) => (
        <span
          className="whitespace-nowrap font-semibold"
          style={{ color: status?.color! }}
        >
          {status?.name}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded shadow">
        <h3 className="border-b border-border-200 bg-light px-4 py-3 text-center font-semibold text-heading">
          Tran Summary
        </h3>
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={summaryData?.data?.rowList}
          rowKey="id"
          scroll={{ x: 200 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>
    </>
  );
};

export default RecentOrders;
