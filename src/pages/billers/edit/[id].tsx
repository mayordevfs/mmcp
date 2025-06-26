import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EditBillerForm from '@/components/biller/edit-biller-form';

export default function UpdateBillerPage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-update-biller')}
        </h1>
      </div>
      <EditBillerForm />
    </>
  );
}
UpdateBillerPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});


// import Layout from '@/components/layouts/admin';
// import { useRouter } from 'next/router';
// import CreateOrUpdateMerchantForm from '@/components/merchant/merchant-form';
// import ErrorMessage from '@/components/ui/error-message';
// import Loader from '@/components/ui/loader/loader';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useTranslation } from 'next-i18next';
// import { useEffect, useState } from 'react';
// import axiosInstance from '@/utils/fetch-function';
// import { toast } from 'react-toastify';

// export default function UpdateBillerPage() {
//   const { query } = useRouter();
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [billerData, setBillerData] = useState<any>(null);

//   useEffect(() => {
//     if (query.billerCode) {
//       fetchBillerDetails(query.billerCode as string);
//     }
//   }, [query.billerCode]);

//   const fetchBillerDetails = async (billerCode: string) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axiosInstance.get(
//         `billpayment/getbillerdetail?billerCode=${billerCode}`,
//         {
//           params: {
//             pageNumber: 1,
//             pageSize: 20,
//           },
//         }
//       );

//       if (response.data?.code !== '000') {
//         throw new Error(response.data?.desc || 'Failed to fetch biller details');
//       }

//       setBillerData(response.data);
//     } catch (err: any) {
//       console.error('Error fetching biller details:', err);
//       setError(err.message || 'Failed to load biller details');
//       toast.error(t('common:error-fetching-data'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (values: any) => {
//     try {
//       setLoading(true);
      
//       const response = await axiosInstance.post(
//         'billpayment/updatebiller',
//         {
//           ...values,
//           billerCode: query.billerCode,
//           countryCode: 'NG',
//           userlang: 'en',
//           deviceId: '0001',
//           channelType: 'POS',
//           entityCode: 'ETZ',
//         }
//       );

//       if (response.data?.code !== '000') {
//         throw new Error(response.data?.desc || 'Failed to update biller');
//       }

//       toast.success(t('common:successfully-updated'));
//       // Optionally refresh data
//       await fetchBillerDetails(query.billerCode as string);
//     } catch (err: any) {
//       console.error('Error updating biller:', err);
//       setError(err.message || 'Failed to update biller');
//       toast.error(t('common:error-updating-data'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <Loader text={t('common:text-loading')} />;
//   if (error) return <ErrorMessage message={error} />;
//   if (!billerData) return <ErrorMessage message={t('common:no-data-found')} />;

//   return (
//     <>
//       <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
//         <h1 className="text-lg font-semibold text-heading">
//           {t('form:form-title-update-biller')}: {billerData.billerName}
//         </h1>
//       </div>
//       <CreateOrUpdateMerchantForm 
//         initialValues={billerData}
//         // onSubmit={handleSubmit}
//         // loading={loading}
//         // isBiller={true}
//       />
//     </>
//   );
// }

// UpdateBillerPage.Layout = Layout;

// export const getServerSideProps = async ({ locale }: any) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
//   },
// });