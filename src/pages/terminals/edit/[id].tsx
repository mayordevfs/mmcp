import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import CreateOrUpdateMerchantForm from '@/components/merchant/merchant-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useShippingQuery } from '@/data/shipping';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function UpdateMerchantPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const {
    data,
    isLoading: loading,
    error,
  } = useShippingQuery(query.id as string);
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-update-merchant')} #{data?.id}
        </h1>
      </div>
      <CreateOrUpdateMerchantForm initialValues={data} />
    </>
  );
}
UpdateMerchantPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
