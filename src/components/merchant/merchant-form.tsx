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
import { useMutation } from 'react-query';
import useGetLookup from '@/hooks/useGetLookup';
import { randomNDigitNumber } from '@/lib/helper';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Routes } from '@/config/routes';

const defaultValues = {
  merchantId: '',
  name: '',
  type: '',
  registrationNo: '',
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
  businessRegNo:'',
  sweepSessions:[''],
  settlementAccountType:''
};

type IProps = {
  initialValues?: Shipping | undefined | null;
};

const stateOptions = [
  { id: 'lagos', name: 'Lagos' },
  { id: 'abuja', name: 'Abuja' },
];

const settlementTypeOptions = [
  { id: 'WALLET', name: 'Wallet' },
  { id: 'BANK_ACCOUNT', name: 'Bank Account' },
  { id: 'NO_SETTLEMENT', name: 'No Settlement' },
];

const genderOptions = [
  { id: 'male', name: 'Male' },
  { id: 'female', name: 'Female' },
];

export default function CreateOrUpdateMerchantForm({
  initialValues,
}: Readonly<IProps>) {
  const router = useRouter();
  const { t } = useTranslation();
  const bankOptions = useGetLookup('BANK');
  // const stateOptions = useGetLookup('STATES');
  const businessTypeOptions = useGetLookup('BUSINESS_TYPE');
  const settlementPeriodType= useGetLookup('SETTLEMENT_PERIOD_TYPE')
  const sweepSessionType= useGetLookup('SWEEP_SESSION')
  const settlementAccountType= useGetLookup('SETTLEMENT_ACCOUNT_TYPE')
  
  console.log(settlementPeriodType);

  console.log(bankOptions);
  

  const { register, handleSubmit, control, watch,getValues } = useForm<MerchantInput>({
    shouldUnregister: true,
    defaultValues: defaultValues,
  });

  console.log(getValues());
  

  const {fileUrl,handleFileChange,fileInputRef,fileError,previewUrl,selectedFile,isUploadingFile} = useFileUpload()

  const { mutate: saveMerchant, isLoading: ismerchantLoading } = useMutation(
    (formData: any) =>
      axiosInstance.request({
        method: 'POST',
        url: 'merchant/onboard',
        data: {
          ...formData,
          currencyCode: 'NGN',
          state: 'Lagos',
          requestReference: new Date().getTime(),

          accountType: 'MERCHWAL',
          city: 'Lagos',
          referralCode: '000000',
          countryCode: 'NG',

          entityCode: 'ETZ',
          merchantGroupCode: 'M0001',
          identityLink: 'https://testt',
          // settlementBankCode: '000111',
          branchCode: 'ETZ_HO',
          id:0,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc);
          return;
        }
        toast.success('Merchant created successfully');
        router.push(Routes?.merchant?.list);
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request');
          } else if (error.response.status === 422) {
            toast.error(t('common:error-creating-user'));
          } else if (error.response.status === 500) {
            toast.error(t('common:error-creating-user'));
          }
        } else {
          toast.error(t('common:error-creating-user'));
        }
      },
    }
  );
  console.log(fileUrl);
  
  const onSubmit = async (values: MerchantInput) => {
     const sweepSessions = values?.sweepSessions?.map((item:any)=>item?.id)
    const payload = {
      // Personal Information
      firstname: values.firstName,
      lastname: values.lastName,
      bvn: values.bvn,
      // gender: values?.gender?.id,

      // Merchant Information
      // merchantId: values.merchantId,
      businessName: values.businessName,
      businessType: values?.businessType?.id,
      businessRegNo:values?.businessRegNo,
      // registrationNo: values.registrationNo,

      // Contact Information
      email: values.email,
      mobileNo: values.mobileNo,
      address: values.address,
      state: values.state?.id,
      settlementAccountType: values.settlementAccountType?.id,

      // Bank Information
      bankName: values.bankName?.name,
      bankCode:values.bankName?.id,
      bankAccountNo: values.bankAccountNo,
      bankAccountName:values?.bankAccountName,
      // settlementAccountName: values.settlementAccountName,
      terminalId: values.terminalId,
      terminalSerialNo: values.terminalSerialNo,

      // File
      businessLogo: fileUrl||'',
      username: values.firstName + randomNDigitNumber(5),
      password: 'password',
      settlementPeriodType:values?.settlementPeriodType?.id,
      sweepSessions:sweepSessions
    };
    saveMerchant(payload);
  };
  // const businessLogo = watch('businessLogo');
  // console.log(businessLogo);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          details={t('form:merchant-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        /> */}
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
            className="mb-5"
          />

          {/* <div className="mb-5">
            <Label>{t('form:input-label-gender')}</Label>
            <SelectInput
              name="gender"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={genderOptions}
              disabled={true}

            />
          </div> */}
        </div>

        {/* Merchant Information */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="mt-2 border-t border-gray-200 pt-5 md:col-span-2">
            <h3 className="mb-5 text-lg font-semibold">
              {t('form:section-title-merchant-info')}
            </h3>
          </div>

          {/* <Input
            label={t('form:input-label-merchant-id')}
            {...register('merchantId')}
            variant="outline"
            className="mb-5"
          /> */}

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
            <Card className="w-full  mb-5">
                      <div className="space-y-4">
                        <Label>{t('Business Logo')} *</Label>
            
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
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="me-4"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button loading={ismerchantLoading} disabled={ismerchantLoading||isUploadingFile}>
            {t('form:button-label-add-merchant')}
          </Button>
        </div>
      </Card>
      {/* </div> */}
    </form>
  );
}
