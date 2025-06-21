import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layouts/pos';
import React from 'react'
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import CreateCategoryForm from '@/components/pos/create-categories/create-categories-form';


const CreateCategory = () => {
    const { t } = useTranslation();
  return (
    <div className='w-[90%] min-h-screen bg-inherit'>
        <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
            <h1 className="text-lg font-semibold text-heading">
                {t('Create Category')}
            </h1>
        </div>
        <CreateCategoryForm/>
    </div>
  )
}

CreateCategory.Layout = Layout
CreateCategory.authenticate = {
  permissions: adminOnly
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default CreateCategory