// import { useForm } from 'react-hook-form';
// import Button from '@/components/ui/button';
// import {
//   useModalAction,
//   useModalState,
// } from '@/components/ui/modal/modal.context';
// import TextArea from '@/components/ui/text-area';
// import Input from '@/components/ui/input';
// import { useTranslation } from 'next-i18next';
// import { useEffect, useState } from 'react';
// import SelectInput from '@/components/ui/select-input';
// import Label from '@/components/ui/label';
// import { useQuery, useMutation } from 'react-query';
// import axiosInstance from '@/utils/fetch-function';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/router';

// type SelectOption = {
//   id: string;
//   name: string;
// };

// type ProductFormValues = {
//   productId: string;
//   productCode: string;
//   productName: string;
//   productDesc: string;
//   amount: number;
//   amountType: string | SelectOption;
//   status: string | SelectOption;
// };

// type PaymentDataFormValues = {
//   fieldID: string;
//   fieldName: string;
//   fieldDataType: string | SelectOption;
//   maxLength: number;
//   mandatoryFlag: string | SelectOption;
//   inputOrOutput: string | SelectOption;
// };

// type FormValues = {
//   products: ProductFormValues[];
//   paymentData: PaymentDataFormValues[];
// };

// const BillerEdit = () => {
//   const { t } = useTranslation();
//   const router = useRouter();
//   const { data: modalData } = useModalState();
//   const { closeModal } = useModalAction();
//   const [activeTab, setActiveTab] = useState<'products' | 'paymentData'>('products');
//   const billerCode = modalData?.billerCode;

//   const { data: billerDetails, isLoading } = useQuery(
//     ['biller-details', billerCode],
//     async () => {
//       const response = await axiosInstance.get(
//         `billpayment/getbillerdetail?billerCode=${billerCode}`,
//         {
//           params: {
//             pageNumber: 1,
//             pageSize: 20,
//           },
//         }
//       );
//       return response.data;
//     },
//     {
//       enabled: !!billerCode,
//     }
//   );

//   const { data: statusData } = useQuery(
//     'status',
//     () =>
//       axiosInstance.get(
//         'lookupdata/getdatabycategorycode/STATUS?entityCode=ETZ'
//       ),
//     {
//       select: (data) =>
//         data.data.map((item: any) => ({
//           id: item.lookupCode,
//           name: item.lookupName,
//           description: item.lookupDesc,
//         })),
//     }
//   );

//   const amountTypeOptions: SelectOption[] = [
//     { id: 'FIXED', name: 'Fixed' },
//     { id: 'VARIABLE', name: 'Variable' }
//   ];

//   const datatypeOptions: SelectOption[] = [
//     { id: 'STRING', name: 'String' },
//     { id: 'NUMBER', name: 'Number' },
//     { id: 'DATE', name: 'Date' },
//   ];

//   const mandatoryFlagOptions: SelectOption[] = [
//     { id: 'Y', name: 'Yes' },
//     { id: 'N', name: 'No' },
//   ];

//   const inputOrOutputOptions: SelectOption[] = [
//     { id: 'I', name: 'Input' },
//     { id: 'O', name: 'Output' },
//   ];

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//     setError,
//   } = useForm<FormValues>();

//   useEffect(() => {
//     if (billerDetails) {
//       const initialValues: FormValues = {
//         products: billerDetails.products?.map((product: ProductFormValues) => ({
//           ...product,
//           amountType: product.amountType,
//           status: product.status
//         })) || [{
//           productId: '',
//           productCode: '',
//           productName: '',
//           productDesc: '',
//           amount: 0,
//           amountType: 'FIXED',
//           status: 'Active',
//         }],
//         paymentData: billerDetails.paymentData?.map((data: PaymentDataFormValues) => ({
//           ...data,
//           fieldDataType: data.fieldDataType,
//           mandatoryFlag: data.mandatoryFlag,
//           inputOrOutput: data.inputOrOutput || 'I'
//         })) || [{
//           fieldID: '',
//           fieldName: '',
//           fieldDataType: 'STRING',
//           maxLength: 0,
//           mandatoryFlag: 'Y',
//           inputOrOutput: 'I',
//         }]
//       };
//       reset(initialValues);
//     }
//   }, [billerDetails, reset]);

//   const getOptionId = (value: string | SelectOption): string => {
//     return typeof value === 'object' ? value.id : value;
//   };

//   const { mutate: saveProduct, isLoading: savingProduct } = useMutation(
//     (formData: Omit<ProductFormValues, 'amountType' | 'status'> & {
//       amountType: string;
//       status: string;
//     }) =>
//       axiosInstance.request({
//         method: 'POST',
//         url: 'billpayment/saveBillerProduct',
//         data: {
//           ...formData,
//           billerCode,
//           countryCode: 'NG',
//           userlang: 'en',
//           deviceId: '0001',
//           channelType: 'POS',
//           entityCode: 'ETZ',
//         },
//       }),
//     {
//       onSuccess: (data) => {
//         if (data?.data?.code !== '000') {
//           toast.error(data?.data?.desc);
//           return;
//         }
//         toast.success(t('form:product-saved-success'));
//         closeModal();
//       },
//       onError: (error: any) => {
//         handleApiError(error, setError, t);
//       },
//     }
//   );

//   const { mutate: saveCollection, isLoading: savingCollection } = useMutation(
//     (formData: Omit<PaymentDataFormValues, 'fieldDataType' | 'mandatoryFlag' | 'inputOrOutput'> & {
//       fieldDataType: string;
//       mandatoryFlag: string;
//       inputOrOutput: string;
//     }) =>
//       axiosInstance.request({
//         method: 'POST',
//         url: 'billpayment/saveBillerCollectionField',
//         data: {
//           ...formData,
//           billerCode,
//           countryCode: 'NG',
//           userlang: 'en',
//           deviceId: '0001',
//           channelType: 'POS',
//           entityCode: 'ETZ',
//         },
//       }),
//     {
//       onSuccess: (data) => {
//         if (data?.data?.code !== '000') {
//           toast.error(data?.data?.desc);
//           return;
//         }
//         toast.success(t('form:collection-saved-success'));
//         closeModal();
//       },
//       onError: (error: any) => {
//         handleApiError(error, setError, t);
//       },
//     }
//   );

//   const handleApiError = (error: any, setError: any, t: any) => {
//     if (error?.response?.data) {
//       if (error.response.status === 400) {
//         toast.error('Bad request');
//       } else if (error.response.status === 422) {
//         toast.error(t('common:error-saving-data'));
//       } else if (error.response.status === 500) {
//         toast.error(t('common:error-saving-data'));
//       }
//       Object.keys(error.response.data).forEach((field: any) => {
//         setError(field as any, {
//           type: 'manual',
//           message: error.response.data[field][0],
//         });
//       });
//     } else {
//       toast.error(t('common:error-saving-data'));
//     }
//   };

//   const onSubmitProduct = (values: FormValues) => {
//     const productData = values.products[0];
//     saveProduct({
//       ...productData,
//       amountType: getOptionId(productData.amountType),
//       status: getOptionId(productData.status),
//     });
//   };

//   const onSubmitCollection = (values: FormValues) => {
//     const collectionData = values.paymentData[0];
//     saveCollection({
//       ...collectionData,
//       fieldDataType: getOptionId(collectionData.fieldDataType),
//       mandatoryFlag: getOptionId(collectionData.mandatoryFlag),
//       inputOrOutput: getOptionId(collectionData.inputOrOutput),
//     });
//   };

//   if (isLoading) {
//     return <div>Loading Collection Management...</div>;
//   }

//   return (
//     <div className="m-auto w-[800px] rounded bg-light px-4">
//       <div className="flex border-b border-dashed border-border-base py-2 sm:py-4">
//         <h1 className="text-lg font-semibold text-heading">
//           {t('form:title-biller-operations')}
//         </h1>
//       </div>
//       <div className="mt-7">
//         <div className="flex border-b border-border-200">
//           <button
//             className={`px-4 py-3 font-medium ${activeTab === 'products' ? 'border-b-2 border-accent text-accent' : 'text-body'}`}
//             onClick={() => setActiveTab('products')}
//           >
//             {t('common:products')}
//           </button>
//           <button
//             className={`px-4 py-3 font-medium ${activeTab === 'paymentData' ? 'border-b-2 border-accent text-accent' : 'text-body'}`}
//             onClick={() => setActiveTab('paymentData')}
//           >
//             {t('common:payment-data')}
//           </button>
//         </div>

//         <div className="px-10 py-7">
//           {activeTab === 'products' && (
//             <div className="space-y-5">
//               <h3 className="text-lg font-semibold">{t('common:desc-products')}</h3>
//               <form onSubmit={handleSubmit(onSubmitProduct)}>
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
//                   <Input
//                     label={t('form:input-label-product-id')}
//                     {...register(`products.0.productId` as const)}
//                     variant="outline"
//                     error={t(errors.products?.[0]?.productId?.message!)}
//                   />

//                   <Input
//                     label={t('form:input-label-product-code')}
//                     {...register(`products.0.productCode` as const)}
//                     variant="outline"
//                     error={t(errors.products?.[0]?.productCode?.message!)}
//                   />

//                   <Input
//                     label={t('form:input-label-product-name')}
//                     {...register(`products.0.productName` as const)}
//                     variant="outline"
//                     error={t(errors.products?.[0]?.productName?.message!)}
//                   />

//                   <TextArea
//                     label={t('form:input-label-product-desc')}
//                     {...register(`products.0.productDesc` as const)}
//                     variant="outline"
//                     error={t(errors.products?.[0]?.productDesc?.message!)}
//                   />

//                   <Input
//                     label={t('form:input-label-amount')}
//                     type="number"
//                     {...register(`products.0.amount` as const)}
//                     variant="outline"
//                     error={t(errors.products?.[0]?.amount?.message!)}
//                   />

//                   <div>
//                     <Label>{t('form:input-label-amount-type')}</Label>
//                     <SelectInput
//                       name={`products.0.amountType` as const}
//                       control={control}
//                       getOptionLabel={(option: any) => option.name}
//                       getOptionValue={(option: any) => option.id}
//                       options={amountTypeOptions}
//                     />
//                   </div>

//                   <div className="mb-5">
//                     <Label>{t('form:input-label-status')}</Label>
//                     <SelectInput
//                       name="status"
//                       control={control}
//                       getOptionLabel={(option: any) => option.name}
//                       getOptionValue={(option: any) => option.id}
//                       options={statusData || []}
//                       isLoading={!statusData}
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-8 flex justify-end">
//                   <Button
//                     type="submit"
//                     loading={savingProduct}
//                     disabled={savingProduct}
//                   >
//                     {t('form:button-text-save-product')}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {activeTab === 'paymentData' && (
//             <div className="space-y-5">
//               <h3 className="text-lg font-semibold">{t('common:desc-payment-data')}</h3>
//               <form onSubmit={handleSubmit(onSubmitCollection)}>
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
//                   <Input
//                     label={t('form:input-label-field-id')}
//                     {...register(`paymentData.0.fieldID` as const)}
//                     variant="outline"
//                     error={t(errors.paymentData?.[0]?.fieldID?.message!)}
//                   />

//                   <Input
//                     label={t('form:input-label-field-name')}
//                     {...register(`paymentData.0.fieldName` as const)}
//                     variant="outline"
//                     error={t(errors.paymentData?.[0]?.fieldName?.message!)}
//                   />

//                   <div className="mb-5">
//                     <Label>{t('form:input-label-field-data-type')}</Label>
//                     <SelectInput
//                       name="paymentData.0.fieldDataType"
//                       control={control}
//                       getOptionLabel={(option: any) => option.name}
//                       getOptionValue={(option: any) => option.id}
//                       options={datatypeOptions}
//                     />
//                   </div>

//                   <Input
//                     label={t('form:input-label-max-length')}
//                     type="number"
//                     {...register(`paymentData.0.maxLength` as const)}
//                     variant="outline"
//                     error={t(errors.paymentData?.[0]?.maxLength?.message!)}
//                   />

//                   <div className="mb-5">
//                     <Label>{t('form:input-label-mandatory-flag')}</Label>
//                     <SelectInput
//                       name="paymentData.0.mandatoryFlag"
//                       control={control}
//                       getOptionLabel={(option: any) => option.name}
//                       getOptionValue={(option: any) => option.id}
//                       options={mandatoryFlagOptions}
//                     />
//                   </div>
//                   <div className="mb-5">
//                     <Label>{t('form:input-label-input-or-output')}</Label>
//                     <SelectInput
//                       name="paymentData.0.inputOrOutput"
//                       control={control}
//                       getOptionLabel={(option: any) => option.name}
//                       getOptionValue={(option: any) => option.id}
//                       options={inputOrOutputOptions}
//                     />
//                     {/* {errors.paymentData?.[0]?.inputOrOutput?.message && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {t(errors.paymentData[0].inputOrOutput.message)}
//                       </p>
//                     )} */}
//                   </div>
//                 </div>
//                 <div className="mt-8 flex justify-end">
//                   <Button
//                     type="submit"
//                     loading={savingCollection}
//                     disabled={savingCollection}
//                   >
//                     {t('form:button-text-save-collection')}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillerEdit;

import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import TextArea from '@/components/ui/text-area';
import Input from '@/components/ui/input';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { useQuery, useMutation } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { FieldError, FieldErrors } from 'react-hook-form';

type SelectOption = {
  id: string;
  name: string;
};

type ProductFormValues = {
  productId: string;
  productCode: string;
  productName: string;
  productDesc: string;
  amount: number;
  amountType: string | SelectOption;
  status: string | SelectOption;
};

type PaymentDataFormValues = {
  fieldID: string;
  fieldName: string;
  fieldDataType: string | SelectOption;
  maxLength: number;
  mandatoryFlag: string | SelectOption;
  inputOrOutput: string | SelectOption;
};

type FormValues = {
  products: ProductFormValues[];
  paymentData: PaymentDataFormValues[];
};

const BillerEdit = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();
  const [activeTab, setActiveTab] = useState<'products' | 'paymentData'>('products');
  const billerCode = modalData?.billerCode;

  const { data: statusData } = useQuery(
    'status',
    () =>
      axiosInstance.get(
        'lookupdata/getdatabycategorycode/STATUS?entityCode=ETZ'
      ),
    {
      select: (data) =>
        data.data.map((item: any) => ({
          id: item.lookupCode,
          name: item.lookupName,
          description: item.lookupDesc,
        })),
    }
  );

  const amountTypeOptions: SelectOption[] = [
    { id: 'FIXED', name: 'Fixed' },
    { id: 'VARIABLE', name: 'Variable' }
  ];

  const datatypeOptions: SelectOption[] = [
    { id: 'STRING', name: 'String' },
    { id: 'NUMBER', name: 'Number' },
    { id: 'DATE', name: 'Date' },
  ];

  const mandatoryFlagOptions: SelectOption[] = [
    { id: 'Y', name: 'Yes' },
    { id: 'N', name: 'No' },
  ];

  const inputOrOutputOptions: SelectOption[] = [
    { id: 'I', name: 'Input' },
    { id: 'O', name: 'Output' },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      products: [{
        productId: "",
        productCode: '',
        productName: '',
        productDesc: '',
        amount: 0,
        amountType: 'FIXED',
        status: 'Active',
      }],
      paymentData: [{
        fieldID: "",
        fieldName: '',
        fieldDataType: 'STRING',
        maxLength: 0,
        mandatoryFlag: 'Y',
        inputOrOutput: 'I',
      }]
    }
  });

  const getOptionId = (value: string | SelectOption): string => {
    return typeof value === 'object' ? value.id : value;
  };

  const { mutate: saveProduct, isLoading: savingProduct } = useMutation(
    (formData: Omit<ProductFormValues, 'amountType' | 'status'> & {
      amountType: string;
      status: string;
    }) =>
      axiosInstance.request({
        method: 'POST',
        url: 'billpayment/saveBillerProduct',
        data: {
          ...formData,
          billerCode,
          countryCode: 'NG',
          userlang: 'en',
          deviceId: '0001',
          channelType: 'POS',
          entityCode: 'ETZ',
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc);
          return;
        }
        toast.success(t('form:product-saved-success'));
        reset({
          products: [{
            productId: "",
            productCode: '',
            productName: '',
            productDesc: '',
            amount: 0,
            amountType: 'FIXED',
            status: 'Active',
          }]
        });
      },
      onError: (error: any) => {
        handleApiError(error, setError, t);
      },
    }
  );

  const { mutate: saveCollection, isLoading: savingCollection } = useMutation(
    (formData: Omit<PaymentDataFormValues, 'fieldDataType' | 'mandatoryFlag' | 'inputOrOutput'> & {
      fieldDataType: string;
      mandatoryFlag: string;
      inputOrOutput: string;
    }) =>
      axiosInstance.request({
        method: 'POST',
        url: 'billpayment/saveBillerCollectionField',
        data: {
          ...formData,
          billerCode,
          countryCode: 'NG',
          userlang: 'en',
          deviceId: '0001',
          channelType: 'POS',
          entityCode: 'ETZ',
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc);
          return;
        }
        toast.success(t('form:collection-saved-success'));
        reset({
          paymentData: [{
            fieldID: "",
            fieldName: '',
            fieldDataType: 'STRING',
            maxLength: 0,
            mandatoryFlag: 'Y',
            inputOrOutput: 'I',
          }]
        });
      },
      onError: (error: any) => {
        handleApiError(error, setError, t);
      },
    }
  );

  const handleApiError = (error: any, setError: any, t: any) => {
    if (error?.response?.data) {
      if (error.response.status === 400) {
        toast.error('Bad request');
      } else if (error.response.status === 422) {
        toast.error(t('common:error-saving-data'));
      } else if (error.response.status === 500) {
        toast.error(t('common:error-saving-data'));
      }
      Object.keys(error.response.data).forEach((field: any) => {
        setError(field as any, {
          type: 'manual',
          message: error.response.data[field][0],
        });
      });
    } else {
      toast.error(t('common:error-saving-data'));
    }
  };

  const onSubmitProduct = (values: FormValues) => {
    const productData = values.products[0];
    saveProduct({
      ...productData,
      amountType: getOptionId(productData.amountType),
      status: getOptionId(productData.status),
    });
  };

  const onSubmitCollection = (values: FormValues) => {
    const collectionData = values.paymentData[0];
    saveCollection({
      ...collectionData,
      fieldDataType: getOptionId(collectionData.fieldDataType),
      mandatoryFlag: getOptionId(collectionData.mandatoryFlag),
      inputOrOutput: getOptionId(collectionData.inputOrOutput),
    });
  };

  return (
    <div className="m-auto w-[800px] rounded bg-light px-4">
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
            {t('common:products')}
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'paymentData' ? 'border-b-2 border-accent text-accent' : 'text-body'}`}
            onClick={() => setActiveTab('paymentData')}
          >
            {t('common:payment-data')}
          </button>
        </div>

        <div className="px-10 py-7">
          {activeTab === 'products' && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">{t('common:desc-products')}</h3>
              <form onSubmit={handleSubmit(onSubmitProduct)}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
                 <Input
                    label={t('form:input-label-product-id')}
                    {...register(`products.0.productId` as const, {
                      required: 'Product ID is required',
                    })}
                    variant="outline"
                    error={t(errors.products?.[0]?.productId?.message!)}
                  />
                  <Input
                    label={t('form:input-label-product-code')}
                    {...register(`products.0.productCode` as const, {
                      required: 'Product code is required',
                    })}
                    variant="outline"
                    error={t(errors.products?.[0]?.productCode?.message!)}
                  />

                  <Input
                    label={t('form:input-label-product-name')}
                    {...register(`products.0.productName` as const, {
                      required: 'Product name is required',
                    })}
                    variant="outline"
                    error={t(errors.products?.[0]?.productName?.message!)}
                  />

                  <TextArea
                    label={t('form:input-label-product-desc')}
                    {...register(`products.0.productDesc` as const)}
                    variant="outline"
                    error={t(errors.products?.[0]?.productDesc?.message!)}
                  />

                  <Input
                    label={t('form:input-label-amount')}
                    type="number"
                    {...register(`products.0.amount` as const, {
                      required: 'Amount is required',
                      min: { value: 0, message: 'Amount must be positive' }
                    })}
                    variant="outline"
                    error={t(errors.products?.[0]?.amount?.message!)}
                  />

                  <div>
                    <Label>{t('form:input-label-amount-type')}</Label>
                    <SelectInput
                      name={`products.0.amountType` as const}
                      control={control}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      options={amountTypeOptions}
                      rules={{ required: 'Amount type is required' }}
                    />
                    {errors.products?.[0]?.amountType && (
                      // <p className="mt-1 text-xs text-red-500">
                      //   {t(errors.products[0].amountType.message)}
                      // </p>
                      <p>dj</p>
                    )}
                  </div>

                  <div className="mb-5">
                    <Label>{t('form:input-label-status')}</Label>
                    <SelectInput
                      name={`products.0.status` as const}
                      control={control}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      options={statusData || []}
                      isLoading={!statusData}
                      rules={{ required: 'Status is required' }}
                    />
                    {errors.products?.[0]?.status && (
                      // <p className="mt-1 text-xs text-red-500">
                      //   {t(errors.products[0].status.message)}
                      // </p>
                      <p>dj</p>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button 
                    type="submit"
                    loading={savingProduct}
                    disabled={savingProduct}
                  >
                    {t('form:button-text-save-product')}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'paymentData' && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">{t('common:desc-payment-data')}</h3>
              <form onSubmit={handleSubmit(onSubmitCollection)}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
                  <Input
                     label={t('form:input-label-field-id')}
                     {...register(`paymentData.0.fieldID` as const, {
                      required: 'Field ID is required',
                    })}
                     error={t(errors.paymentData?.[0]?.fieldID?.message!)}
                   />
                  <Input
                    label={t('form:input-label-field-name')}
                    {...register(`paymentData.0.fieldName` as const, {
                      required: 'Field name is required',
                    })}
                    variant="outline"
                    error={t(errors.paymentData?.[0]?.fieldName?.message!)}
                  />

                  <div className="mb-5">
                    <Label>{t('form:input-label-field-data-type')}</Label>
                    <SelectInput
                      name={`paymentData.0.fieldDataType` as const}
                      control={control}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      options={datatypeOptions}
                      rules={{ required: 'Data type is required' }}
                    />
                    {errors.paymentData?.[0]?.fieldDataType && (
                      // <p className="mt-1 text-xs text-red-500">
                      //   {t(errors.paymentData[0].fieldDataType.message)}
                      // </p>
                      <p>dj</p>
                    )}
                  </div>

                  <Input
                    label={t('form:input-label-max-length')}
                    type="number"
                    {...register(`paymentData.0.maxLength` as const, {
                      required: 'Max length is required',
                      min: { value: 0, message: 'Max length must be positive' }
                    })}
                    variant="outline"
                    error={t(errors.paymentData?.[0]?.maxLength?.message!)}
                  />

                  <div className="mb-5">
                    <Label>{t('form:input-label-mandatory-flag')}</Label>
                    <SelectInput
                      name={`paymentData.0.mandatoryFlag` as const}
                      control={control}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      options={mandatoryFlagOptions}
                      rules={{ required: 'Mandatory flag is required' }}
                    />
                    {errors.paymentData?.[0]?.mandatoryFlag && (
                      // <p className="mt-1 text-xs text-red-500">
                      //   {t(errors.paymentData[0].mandatoryFlag.message)}
                      // </p>
                      <p>dj</p>
                    )}
                  </div>

                  <div className="mb-5">
                    <Label>{t('form:input-label-input-or-output')}</Label>
                    <SelectInput
                      name={`paymentData.0.inputOrOutput` as const}
                      control={control}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      options={inputOrOutputOptions}
                      rules={{ required: 'Input/Output is required' }}
                    />
                    {errors.paymentData?.[0]?.inputOrOutput && (
                      // <p className="mt-1 text-xs text-red-500">
                      //   {t(errors.paymentData[0].inputOrOutput.message)}
                      // </p>
                      <p>dj</p>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button 
                    type="submit"
                    loading={savingCollection}
                    disabled={savingCollection}
                  >
                    {t('form:button-text-save-collection')}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillerEdit;