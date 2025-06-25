import { adminOnly } from '@/utils/auth-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/layouts/admin';
import React from 'react'

export async function getStaticPaths() {
  return {
    paths: [], // No paths pre-rendered at build time
    fallback: 'blocking' // Generate pages on-demand
  };
}
const LookupData = () => {
  return (
    <div>LookupData</div>
  )
}
LookupData.Layout = Layout

LookupData.authenticate = {
    permissions:adminOnly
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
export default LookupData