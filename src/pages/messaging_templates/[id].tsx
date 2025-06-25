import Card from '@/components/common/card'
import React from 'react'
import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import { Routes } from '@/config/routes';
import { ArrowLeft } from 'lucide-react';
import { parseHTML } from '@/components/messaging_templates/parsed-html';

export async function getStaticPaths() {
  return {
    paths: [], // No paths pre-rendered at build time
    fallback: 'blocking' // Generate pages on-demand
  };
}
const IndividualMessagingTemplate = () => {
    const {query,push} = useRouter()

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

    console.log(data);
    
  return (
    <Card className='h-full overflow-y-auto'>
       <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={()=>push(Routes.fetch_templates)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Title Section */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">
              {data?.data?.messageTemplate?.title}
            </h1>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>ID: {data?.data?.messageTemplate?.id}</span>
              <span>Type: {data?.data?.messageTemplate?.msgType}</span>
              <span>Code: {data?.data?.messageTemplate?.templateCode}</span>
            </div>
          </div>

          {/* Template Message Content */}
          <div className="p-6 md:p-8">
            <div className="prose prose-gray max-w-none">
              {parseHTML(data?.data?.messageTemplate?.templateMsg)}
           
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

IndividualMessagingTemplate.Layout = Layout

IndividualMessagingTemplate.authenticate = {
    permissions:adminOnly
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default IndividualMessagingTemplate