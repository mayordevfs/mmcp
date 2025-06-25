import Layout from '@/components/layouts/admin';
import CreateOrUpdateMerchantForm from '@/components/merchant/merchant-form';
import CreateTransactionTypeForm from '@/components/transaction_type/createTransactionTypeForm';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateTransactionTypePage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex  py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('Transaction Type')}
        </h1>
      </div>
      <CreateTransactionTypeForm />
    </>
  );
}
CreateTransactionTypePage.Layout = Layout;
CreateTransactionTypePage.authenticate = {
  permissions:adminOnly
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
