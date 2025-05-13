import Input from '@/components/ui/input';
import { useForm, useWatch } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';

import Label from '@/components/ui/label';
import { Shipping, MerchantInput } from '@/types';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/fetch-function';
import { useMutation } from 'react-query';
import useGetLookup from '@/hooks/useGetLookup';

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
  settlementAccount: '',
  settlementAccountName: '',
  terminalId: '',
  terminalSerialNo: '',
  businessLogo: null,
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

  const { register, handleSubmit, control, watch } = useForm<MerchantInput>({
    shouldUnregister: true,
    defaultValues: defaultValues,
  });

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
          settlementBankCode: '000111',
          branchCode: 'ETZ_HO',
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc);
          return;
        }
        toast.success('Merchant created successfully');
        router.back();
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

  const onSubmit = async (values: MerchantInput) => {
    const payload = {
      // Personal Information
      // firstName: values.firstName,
      // lastName: values.lastName,
      bvn: values.bvn,
      // gender: values?.gender?.id,

      // Merchant Information
      // merchantId: values.merchantId,
      businessName: values.businessName,
      businessType: values?.businessType?.id,
      // registrationNo: values.registrationNo,

      // Contact Information
      email: values.email,
      mobileNo: values.mobileNo,
      address: values.address,
      state: values.state?.id,
      settlementType: values.settlementType?.id,

      // Bank Information
      settlementBank: values.bank?.id,
      settlementBankAccount: values.settlementAccount,
      // settlementAccountName: values.settlementAccountName,
      terminalId: values.terminalId,
      terminalSerialNo: values.terminalSerialNo,

      // File
      businessLogo: values.businessLogo,
      username: values.firstName + values.merchantId,
      password: 'password',
    };
    saveMerchant(payload);
  };
  const businessLogo = watch('businessLogo');
  console.log(businessLogo);

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
            {...register('registrationNo')}
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

          <div className="mb-5">
            <Label>{t('form:input-label-settlement-type')}</Label>
            <SelectInput
              name="settlementType"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={settlementTypeOptions}
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
              name="bank"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={bankOptions}
            />
          </div>

          <Input
            label={t('form:input-label-settlement-account')}
            {...register('settlementAccount')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-settlement-account-name')}
            {...register('settlementAccountName')}
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
            label={t('form:input-label-terminal-serial-no')}
            {...register('terminalSerialNo')}
            variant="outline"
            className="mb-5"
          />
        </div>

        <div className="mb-5">
          <Label>{t('form:input-label-business-logo')}</Label>
          <FileInput
            name="merchant.businessLogo"
            control={control}
            multiple={false}
          />
        </div>
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

          <Button loading={ismerchantLoading} disabled={ismerchantLoading}>
            {t('form:button-label-add-merchant')}
          </Button>
        </div>
      </Card>
      {/* </div> */}
    </form>
  );
}
