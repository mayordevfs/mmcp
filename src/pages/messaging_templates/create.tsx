import Layout from '@/components/layouts/admin';
import CreateTemplateForm from '@/components/messaging_templates/create-template-form';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function SaveMessagingTemplate() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex  py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('Save Messaging Template')}
        </h1>
      </div>
      <CreateTemplateForm />
    </>
  );
}
SaveMessagingTemplate.Layout = Layout;
SaveMessagingTemplate.authenticate = {
    permissions:adminOnly
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
