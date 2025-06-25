import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import CreateOrUpdateMerchantForm from '@/components/merchant/merchant-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useShippingQuery } from '@/data/shipping';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EditMerchantForm from '@/components/merchant/update-merchant-form';

export default function UpdateMerchantPage() {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-update-merchant')}
        </h1>
      </div>
      <EditMerchantForm />
    </>
  );
}
UpdateMerchantPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
