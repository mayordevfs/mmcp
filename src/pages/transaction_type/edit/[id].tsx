import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import UpdateTransactionTypeForm from '@/components/transaction_type/updateForm';
import { useTransactionTypeStore } from '@/contexts/editContext/transactionTypeContext';
import { useEffect, useState } from 'react';

// Import the TransactionType interface or define it inline if needed
interface TransactionType {
  id: number;
  entityCode: string;
  customerType: string;
  tranCode: string;
  tranName: string;
  maxLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailyFreq: number;
  status: string;
  agentCommission: number;
  platformCommission: number;
  networkCommission: number;
  bankCommission: number;
  aggregatorCommission: number;
  serviceFee: number;
  groupCommission: null | number;
  charge: number;
  chargeType: string;
  otherCharge: number;
  tranChannel: string;
  roleAllowed: null | string;
  minLimit: number;
  sharingType: string;
  feeDetail: null | any;
  glCodeCommission: string;
  glCode: null | string;
  branchCode: string;
  tax: number;
  setupRefNo: string;
  feeTiers: null | any;
  commissionParties: null | any;
  minHardTokenLimit: number;
  maxHardTokenLimit: number;
  dailyHardTokenLimit: number;
  capLimit: number;
}

export default function UpdateTransactionTypePage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { transactionTypes } = useTransactionTypeStore();
  const [filteredType, setFilteredType] = useState<TransactionType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (transactionTypes && transactionTypes.length > 0 && query.id) {
      // Handle both number and string ID comparisons
      const id = typeof query.id === 'string' ? parseInt(query.id, 10) : query.id;
      
      // Filter the transaction type based on the query id
      const foundType = transactionTypes.find(type => type.id === id);
      setFilteredType(foundType || null);
      setLoading(false);
    } else if (transactionTypes) {
      setLoading(false);
    }
  }, [transactionTypes, query.id]);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (!filteredType) return <ErrorMessage message={t('common:error-no-transaction-type-found')} />;
  

  console.log(filteredType);
  
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-update-transaction-type')} #{query?.id}
        </h1>
      </div>
      <UpdateTransactionTypeForm id={query?.id}/>
    </>
  );
}

UpdateTransactionTypePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});