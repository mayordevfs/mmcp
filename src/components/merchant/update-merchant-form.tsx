import Input from '@/components/ui/input';
import { useForm, useWatch } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';

import Label from '@/components/ui/label';
import { Shipping, MerchantInput } from '@/types';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/fetch-function';
import { useMutation, useQuery } from 'react-query';
import useGetLookup from '@/hooks/useGetLookup';
import { randomNDigitNumber } from '@/lib/helper';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useEffect, useState } from 'react';
import { Routes } from '@/config/routes';

const defaultValues = {
  merchantId: '',
  name: '',
  type: '',
  email: '',
  mobileNo: '',
  address: '',
  firstName: '',
  lastName: '',
  bvn: '',
  businessName: '',
  bankAccountNo: '',
  bankAccountName: '',
  terminalId: '',
  terminalSerialNo: '',
  businessLogo: null,
  businessRegNo: '',
  sweepSessions:[''],
  settlementPeriodTypes:'',
  settlementAccountType:''
};

type IProps = {
  initialValues?: Shipping | undefined | null;
};

const stateOptions = [
  { id: 'Lagos', name: 'Lagos' },
  { id: 'Abuja', name: 'Abuja' },
];

// const settlementTypeOptions = [
//   { id: 'WALLET', name: 'Wallet' },
//   { id: 'BANK_ACCOUNT', name: 'Bank Account' },
//   { id: 'NO_SETTLEMENT', name: 'No Settlement' },
// ];

const genderOptions = [
  { id: 'male', name: 'Male' },
  { id: 'female', name: 'Female' },
];

export default function EditMerchantForm({
  initialValues,
}: Readonly<IProps>) {
  const router = useRouter();
  const { t } = useTranslation();
  const { query } = router;
  const [originalMerchant, setOriginalMerchant] = useState<any>(null);
  const [isFormPopulated, setIsFormPopulated] = useState(false);
  
  const bankOptions = useGetLookup('BANK');
  const businessTypeOptions = useGetLookup('BUSINESS_TYPE');
  const settlementPeriodType= useGetLookup('SETTLEMENT_PERIOD_TYPE')
  const sweepSessionType= useGetLookup('SWEEP_SESSION')
  const settlementAccountType= useGetLookup('SETTLEMENT_ACCOUNT_TYPE')

  // Fetch merchant details for editing
  const { data: merchantData, isLoading: merchantLoading } = useQuery(
    ['merchantDetails', query?.id],
    () =>
      axiosInstance.request({
        method: 'GET',
        url: `merchant/${query?.id}`,
        params: {
          merchantCode: query?.id,
          entityCode: 'ETZ',
        },
      }),
    {
      enabled: !!query?.id,
    }
  );

  console.log(merchantData?.data?.merchantDto);

  const { register, handleSubmit, control, watch, setValue, reset, getValues } = useForm<MerchantInput>({
    shouldUnregister: true,
    defaultValues: defaultValues,
  });

  const { fileUrl, handleFileChange, fileInputRef, fileError, previewUrl, selectedFile, isUploadingFile, setInitialImage, hasNewImage } = useFileUpload();

  // Helper function to find option by value - FIXED VERSION
  const findOptionByValue = (options: any[], value: any) => {
    if (!options || !Array.isArray(options) || value === null || value === undefined) return null;
    
    return options.find((option: any) => {
      // Direct equality check first
      if (option.id === value || option.name === value) {
        return true;
      }
      
      // String comparison (case-insensitive) only if both values can be converted to strings
      try {
        const valueStr = String(value).toLowerCase();
        const optionIdStr = String(option.id).toLowerCase();
        const optionNameStr = String(option.name).toLowerCase();
        
        return optionIdStr === valueStr || optionNameStr === valueStr;
      } catch (error) {
        // If string conversion fails, skip string comparison
        return false;
      }
    }) || null;
  };

  // Populate form with existing merchant data
  useEffect(() => {
    const merchant = merchantData?.data?.merchantDto;
    const terminalDetail = merchantData?.data?.terminalDtoList?.[0];
    
    // Only proceed if we have merchant data and all required options are loaded
    if (merchant && bankOptions?.length > 0 && businessTypeOptions?.length > 0 && !isFormPopulated) {
      console.log('Populating form with merchant data:', merchant);
      
      // Debug: Log merchant data types to understand what we're working with
      console.log('Merchant data types:', {
        businessType: typeof merchant.businessType, 
        businessTypeValue: merchant.businessType,
        state: typeof merchant.state,
        stateValue: merchant.state,
        settlementType: typeof merchant.settlementType,
        settlementTypeValue: merchant.settlementType,
        bankName: typeof merchant.bankName,
        bankNameValue: merchant.bankName,
        settlementPeriodType: typeof merchant.settlementPeriodType,
        settlementPeriodTypeValue: merchant.settlementPeriodType,
        sweepSessions: typeof merchant.sweepSessions,
        sweepSessionsValue: merchant.sweepSessions
      });
      
      setOriginalMerchant(merchant);
      
      // Reset file upload state
      if (merchant.businessLogo) {
        setInitialImage(merchant.businessLogo);
      }
      
      // Create the form data object with proper dropdown selections
      const formData = {
        firstName: merchant?.firstname || '',
        lastName: merchant?.lastname || '',
        bvn: merchant?.bvn || '',
        businessName: merchant?.businessName || '',
        businessRegNo: merchant?.businessRegNo || '',
        email: merchant?.email || '',
        mobileNo: merchant?.mobileNo || '',
        address: merchant?.address || '',
        bankAccountNo: merchant?.bankAccountNo || '',
        bankAccountName: merchant?.bankAccountName || '',
        terminalId: terminalDetail?.terminalId || '',
        terminalSerialNo: terminalDetail?.serialNo || '',
        
        // Handle dropdown fields - convert strings to objects
        businessType: findOptionByValue(businessTypeOptions, merchant.businessType),
        state: findOptionByValue(stateOptions, merchant.state),
        settlementType: findOptionByValue(settlementAccountType, merchant.settlementType),
        bankName: findOptionByValue(bankOptions, merchant.bankName),
        settlementPeriodType: findOptionByValue(settlementPeriodType, merchant?.settlementPeriodType),
        sweepSessions: findOptionByValue(sweepSessionType, merchant?.sweepSessions)
      };
      
      console.log('Form data to be set:', formData);
      console.log('Available options:', {
        businessTypeOptions,
        bankOptions,
        stateOptions,
        settlementAccountType
      });
      
      // Reset the entire form with the new data
      reset(formData);
      
      // Mark as populated to prevent re-population
      setIsFormPopulated(true);
    }
  }, [
    merchantData, 
    bankOptions, 
    businessTypeOptions, 
    settlementPeriodType,
    sweepSessionType,
    settlementAccountType,
    reset, 
    setInitialImage, 
    isFormPopulated
  ]);

  // Debug: Log current form values
  console.log('Current form values:', getValues());

  const { mutate: updateMerchant, isLoading: isUpdatingMerchant } = useMutation(
    (formData: any) =>
      axiosInstance.request({
        method: 'POST',
        url: `merchant/onboard`,
        data: {
          ...formData,
          currencyCode: 'NGN',
          state: formData.state || 'Lagos',
          requestReference: new Date().getTime(),
          accountType: 'MERCHWAL',
          city: 'Lagos',
          referralCode: '000000',
          countryCode: 'NG',
          entityCode: 'ETZ',
          merchantGroupCode: 'M0001',
          identityLink: 'https://testt',
          branchCode: 'ETZ_HO',
          id:merchantData?.data?.merchantDto?.id
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc);
          return;
        }
        toast.success('Merchant updated successfully');
        router.push(Routes?.merchant?.list);
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request');
          } else if (error.response.status === 422) {
            toast.error(t('Error Updating Merchant'));
          } else if (error.response.status === 500) {
            toast.error(t('Error Updating Merchant'));
          }
        } else {
          toast.error(t('Error Updating Merchant'));
        }
      },
    }
  );

  const onSubmit = async (values: MerchantInput) => {
    let finalImageURL = '';
  
    if (originalMerchant) {
      // Edit mode
      finalImageURL = originalMerchant?.businessLogo || '';
      if (hasNewImage && fileUrl) {
        finalImageURL = fileUrl;
      }
    } else {
      // Create mode
      finalImageURL = fileUrl;
    }
    
    // Handle sweepSessions - ensure it's an array and extract IDs safely
    let sweepSessions = [];
    if (values?.sweepSessions) {
      if (Array.isArray(values.sweepSessions)) {
        sweepSessions = values.sweepSessions.map((item: any) => item?.id || item);
      } else {
        // If it's a single value, wrap it in an array
        sweepSessions = [values.sweepSessions?.id || values.sweepSessions];
      }
    }
    
    const payload = {
      firstname: values?.firstName,
      lastname: values?.lastName,
      bvn: values.bvn,
      businessName: values.businessName,
      businessType: values?.businessType?.id,
      businessRegNo: values?.businessRegNo,
      email: values.email,
      mobileNo: values.mobileNo,
      address: values.address,
      state: values.state?.id,
      settlementAccountType: values.settlementAccountType?.id,
      bankName: values.bankName?.name,
      bankCode: values.bankName?.id,
      bankAccountNo: values.bankAccountNo,
      bankAccountName: values?.bankAccountName,
      terminalId: values.terminalId,
      terminalSerialNo: values.terminalSerialNo,
      businessLogo: finalImageURL,
      username: originalMerchant?.username,
      settlementPeriodType: values?.settlementPeriodType?.id,
      sweepSessions: sweepSessions
      // Don't send password on update
    };
    
    console.log('Submitting payload:', payload);
    updateMerchant(payload);
  };

  // Show loading state while fetching merchant data or options
  if (merchantLoading || !bankOptions || !businessTypeOptions) {
    return (
      <Card className="w-full">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading merchant data...</div>
        </div>
      </Card>
    );
  }

  // Show error if merchant not found
  if (!merchantLoading && !merchantData?.data?.merchantDto) {
    return (
      <Card className="w-full">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-red-600">Merchant not found</div>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        {/* Personal Information */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="mt-2 pt-5 md:col-span-2">
            <h3 className="mb-5 text-lg font-semibold">
              {t('form:section-title-personal-info')}
            </h3>
          </div>

          <Input
            label={t('form:input-label-firstname')}
            {...register('firstName')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-lastname')}
            {...register('lastName')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-bvn')}
            {...register('bvn')}
            variant="outline"
            disabled
            className="mb-5"
          />
        </div>

        {/* Merchant Information */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="mt-2 border-t border-gray-200 pt-5 md:col-span-2">
            <h3 className="mb-5 text-lg font-semibold">
              {t('form:section-title-merchant-info')}
            </h3>
          </div>

          <Input
            label={t('form:input-label-business-name')}
            {...register('businessName')}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t('form:input-label-business-type')}</Label>
            <SelectInput
              name="businessType"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={businessTypeOptions}
            />
          </div>

          <Input
            label={t('form:input-label-registration-no')}
            {...register('businessRegNo')}
            variant="outline"
            className="mb-5"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="mt-2 border-t border-gray-200 pt-5 md:col-span-2">
            <h3 className="mb-5 text-lg font-semibold">
              {t('form:section-title-contact-details')}
            </h3>
          </div>

          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-mobile-no')}
            {...register('mobileNo')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-address')}
            {...register('address')}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t('form:input-label-state')}</Label>
            <SelectInput
              name="state"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={stateOptions}
            />
          </div>

        </div>

         {/* Bank Information */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="mt-2 border-t border-gray-200 pt-5 md:col-span-2">
            <h3 className="mb-5 text-lg font-semibold">
              {t('form:section-title-bank-info')}
            </h3>
          </div>
          <div className="mb-5">
            <Label>{t('form:input-label-bank')}</Label>
            <SelectInput
              name="bankName"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={bankOptions}
            />
          </div>

          <Input
            label={t('form:input-label-settlement-account')}
            {...register('bankAccountNo')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-terminal-serial-no')}
            {...register('terminalSerialNo')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-terminal-id')}
            {...register('terminalId')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-settlement-account-name')}
            {...register('bankAccountName')}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t('Settlement Account Type')}</Label>
            <SelectInput
              name="settlementAccountType"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={settlementAccountType}
            />
          </div>

          <div className="mb-5">
            <Label>{t('Settlement Period Type')}</Label>
            <SelectInput
              name="settlementPeriodType"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={settlementPeriodType}
            />
          </div>

          <div className="mb-5">
            <Label>{t('Sweep Session')}</Label>
            <SelectInput
              name="sweepSessions"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={sweepSessionType}
              isMulti
            />
          </div>
        </div>

        {/* File upload */}
        <Card className="w-full mb-5">
          <div className="space-y-4">
            <Label>{t('Business Logo')} *</Label>

            {/* Show existing logo if available */}
            {merchantData?.data?.merchantDto?.businessLogo && !previewUrl && (
              <div className="mb-4">
                <Label>Current Logo:</Label>
                <div className="mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img
                    src={merchantData.data.merchantDto.businessLogo}
                    alt="Current business logo"
                    className="max-w-full max-h-32 object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {/* File Input */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>

            {/* Error Message */}
            {fileError && (
              <p className="text-sm text-red-600 mt-1">{fileError}</p>
            )}

            {/* File Info */}
            {selectedFile && !fileError && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p><strong>Selected:</strong> {selectedFile[0].name}</p>
                <p><strong>Size:</strong> {(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Type:</strong> {selectedFile[0].type}</p>
              </div>
            )}

            {/* Image Preview */}
            {previewUrl && !fileError && (
              <div className="mt-4">
                <Label>Preview:</Label>
                <div className="mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img
                    src={previewUrl}
                    alt="Category logo preview"
                    className="max-w-full max-h-32 object-contain mx-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="mb-4 text-end">
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>

          <Button 
            loading={isUpdatingMerchant} 
            disabled={isUpdatingMerchant || isUploadingFile}
          >
            {t('Update merchant')}
          </Button>
        </div>
      </Card>
    </form>
  );
}