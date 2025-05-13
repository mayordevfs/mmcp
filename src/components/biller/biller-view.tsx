import { Table } from '@/components/ui/table';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useShippingClassesQuery } from '@/data/merchant';
import { SortOrder } from '@/types';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import axiosInstance from '@/utils/fetch-function';
import ActionButtons from '@/components/common/action-buttons';
import BillerProductList from '@/components/biller/biller-product-list';
import BillerCollectionList from '@/components/biller/biller-collection-list';

const BillerView = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: modalData } = useModalState();
  const billerCode = modalData?.billerCode;
  const { closeModal } = useModalAction();
  const locale = router.locale;
  
  const [searchTerm, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [activeTab, setActiveTab] = useState<'products' | 'paymentData'>('products');

  // Get biller details
  // const { data: billerDetails, isLoading } = useQuery(
  //   ['biller-details', modalData?.billerCode],
  //   async () => {
  //     const response = await axiosInstance.get(
  //       'getbillerdetail',
  //       {
  //         params: {
  //           billerCode: modalData?.billerCode,
  //         },
  //       }
  //     );
  //     return response.data;
  //   },
  //   {
  //     enabled: !!modalData?.billerCode, // Only run query if billerCode exists
  //   }
  // );

  const { data: billerDetails, isLoading } = useQuery(
    ['biller-details', billerCode],
    async () => {
      const response = await axiosInstance.get(
        `billpayment/getbillerdetail?billerCode=${billerCode}`,
        {
          params: {
            pageNumber: 1,
            pageSize: 20,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!billerCode,
      onSuccess: (data) => {
        console.log('Biller Details:', data);
      },
    }
  ); 

  const billerCollections = billerDetails?.paymentData || [];
  const billerProducts = billerDetails?.products || [];

  return (
    <div className="m-auto w-[1000px] rounded bg-light px-4">
      <div className="flex border-b border-dashed border-border-base py-2 sm:py-4">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:title-biller-operations')}
        </h1>
      </div>
      <div className="mt-7">
        <div className="flex border-b border-border-200">
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'products' ? 'border-b-2 border-accent text-accent' : 'text-body'}`}
            onClick={() => setActiveTab('products')}
          >
            {t('common:view-products')}
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'paymentData' ? 'border-b-2 border-accent text-accent' : 'text-body'}`}
            onClick={() => setActiveTab('paymentData')}
          >
            {t('common:view-payment-data')}
          </button>
        </div>

        <div className="px-4 py-7">
          {isLoading ? (
            <div>Loading biller details...</div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold">{billerDetails?.billerName}</h2>
                <p className="text-sm text-gray-600">Biller Code: {billerDetails?.billerCode}</p>
              </div>

              {activeTab === 'products' && (
                <div className="space-y-5">
                  <BillerProductList
                    onOrder={setOrder}
                    onSort={setColumn}
                    products={billerProducts}
                  />
                </div>
              )}

              {activeTab === 'paymentData' && (
                <div className="space-y-5">
                  <BillerCollectionList
                    onOrder={setOrder}
                    onSort={setColumn}
                    collections={billerCollections}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillerView;