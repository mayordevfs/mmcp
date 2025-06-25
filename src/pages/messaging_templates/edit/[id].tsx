import Layout from '@/components/layouts/admin';
import UpdateTemplateMessageForm from '@/components/messaging_templates/update-template-form';
import { adminOnly } from '@/utils/auth-utils';
import axiosInstance from '@/utils/fetch-function';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

export async function getStaticPaths() {
  return {
    paths: [], // No paths pre-rendered at build time
    fallback: 'blocking' // Generate pages on-demand
  };
}
export default function EditMessagingTemplate() {
  const { t } = useTranslation();
  const {query} = useRouter()
  
      const {data} = useQuery(
          ['individual-template'],
          ()=>axiosInstance.request({
              method:'GET',
              url:`messagingTemplate/getMessageTemplateById`,
              params:{
                  id:query?.id
              }
          })
      )
  return (
    <>
      <div className="flex  py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('Edit Messaging Template')}
        </h1>
      </div>
      <UpdateTemplateMessageForm data={data?.data?.messageTemplate}/>
    </>
  );
}
EditMessagingTemplate.Layout = Layout;
EditMessagingTemplate.authenticate = {
    permissions:adminOnly
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
