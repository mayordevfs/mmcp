import Layout from '@/components/layouts/admin';

import { useRouter } from 'next/router';

import Loader from '@/components/ui/loader/loader';

import { ITransactionDetails } from '@/types';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ReactNode } from 'react';

import { useQuery } from 'react-query';

import axiosInstance from '@/utils/fetch-function';

import { OrderIcon } from '@/components/icons/order-icon';
import { UserIcon } from '@/components/icons/user-icon';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query } = useRouter();

  const { data, isLoading } = useQuery(
    ['transaction-details'],
    () => axiosInstance.get(`transactionmanager/${query?.id}`),
    {}
  );

  const transaction: ITransactionDetails = data?.data;
  const isSuccessful = transaction?.status?.toLowerCase() === 'successful';
  const format = (val: string) => val || 'N/A';
  if (isLoading) return <Loader text={t('common:text-loading')} />;

  async function handleDownloadInvoice(data: string) {
    // const { data } = await refetch();

    if (data) {
      const a = document.createElement('a');
      a.href = data;
      a.setAttribute('download', 'order-invoice');
      a.click();
    }
  }

  return (
    <div className="mx-auto mt-4 max-w-5xl px-4">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Transaction Details - {query.id}
          </h1>
          <p className="text-sm text-gray-500">
            {format(transaction.tranDate)}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-1 font-semibold text-white shadow-md ${
            isSuccessful ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {format(transaction.status)}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card title="Transaction Info" icon={<OrderIcon />}>
          <Info label="Reference No" value={transaction.tranRefNo} />
          <Info label="Transaction Type" value={transaction.tranType} />
          <Info label="Narration" value={transaction.narration} />
          <Info label="Amount" value={`₦${transaction.amount}`} />
          <Info label="Charge" value={`₦${transaction.charge}`} />
          <Info label="Currency" value={transaction.currencyCode} />
          <Info label="Response Message" value={transaction.responseMessage} />
          <Info label="Status" value={transaction.status} />
        </Card>

        <Card title="Sender Info" icon={<UserIcon />}>
          <Info label="Sender Name" value={transaction.senderName} />
          <Info label="Sender Mobile" value={transaction.senderMobile} />
          <Info label="Account No" value={transaction.sourceAccount} />
          <Info label="Created By" value={transaction.createdBy} />
          <Info label="Created Date" value={transaction.createdDate} />
        </Card>

        <Card title="Beneficiary Info" icon={<UserIcon />}>
          <Info label="Name" value={transaction.beneficiaryName} />
          <Info label="Mobile" value={transaction.beneficiaryMobile} />
          <Info label="Account" value={transaction.beneficiaryAccount} />
          <Info label="Bank Code" value={transaction.beneficiaryBankCode} />
        </Card>

        <Card title="Terminal & Payment Info" icon={<OrderIcon />}>
          <Info label="Payment Method" value={transaction.paymentMethod} />
          <Info label="Card No" value={transaction.cardNo} />
          <Info label="Terminal ID" value={transaction.terminalId} />
          <Info label="RRN" value={transaction.rrn} />
          <Info label="STAN" value={transaction.stan} />
          <Info label="Payment Ref No" value={transaction.paymentRefNo} />
          <Info label="External Ref No" value={transaction.externalRefNo} />
        </Card>
      </div>
    </div>
  );
}
const Card = ({
  title,
  children,
  icon,
}: {
  title: string;
  children: ReactNode;
  icon: ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white/60 p-6 shadow-lg backdrop-blur-md transition-shadow duration-300 hover:shadow-xl">
    <div className="mb-4 flex items-center gap-2 text-gray-700">
      {icon}
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <div className="grid grid-cols-1 gap-3 text-sm">{children}</div>
  </div>
);

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-1">
    <p className="text-gray-500">{label}</p>
    <p className="text-right font-medium">{value || 'N/A'}</p>
  </div>
);

OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
