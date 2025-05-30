import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layouts/pos';
import React from 'react'
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import EditProductForm from '@/components/pos/edit_product/edit_product_form';
 // Adjust path as needed

 export async function getStaticPaths() {
  return {
    paths: [], // No paths pre-rendered at build time
    fallback: 'blocking' // Generate pages on-demand
  };
}

const EditProduct = () => {
    const { t } = useTranslation();
  return (
    <div className='w-[90%] min-h-screen bg-inherit'>
        <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
            <h1 className="text-lg font-semibold text-heading">
                {t('Edit Product')}
            </h1>
        </div>
        <EditProductForm/>
    </div>
  )
}

EditProduct.Layout = Layout
EditProduct.authenticate = {
  permissions: adminOnly
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default EditProduct