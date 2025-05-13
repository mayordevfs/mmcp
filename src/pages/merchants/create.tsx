import Layout from '@/components/layouts/admin';
import CreateOrUpdateMerchantForm from '@/components/merchant/merchant-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateMerchantPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex  py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-merchant')}
        </h1>
      </div>
      <CreateOrUpdateMerchantForm />
    </>
  );
}
CreateMerchantPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
