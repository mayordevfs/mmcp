import Input from '@/components/ui/input';
import { useForm, useWatch } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Radio from '@/components/ui/radio/radio';
import Label from '@/components/ui/label';
import { ShippingType, Shipping, MerchantInput } from '@/types';
import {
  useCreateShippingMutation,
  useUpdateShippingMutation,
} from '@/data/shipping';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';


const defaultValues = {
  merchantId: '',
  name: '',
  type: '',
  registrationNo: '',
  email: '',
  mobileNo: '',
  address: '',
  state: '',
  settlementType: '',
  firstName: '',
  lastName: '',
  bvn: '',
  gender: '',
  businessName: '',
  businessType: '',  
  bank: '',
  settlementAccount: '',
  settlementAccountName: '',
  terminalId: '',
  terminalSerialNo: '',
  businessLogo: null,
};

type IProps = {
  initialValues?: Shipping | undefined | null;
};

const businessTypeOptions = [
  { id: 'individual', name: 'Individual' },
  { id: 'Corporate', name: 'Corporate' },
];

const stateOptions = [
  { id: 'lagos', name: 'Lagos' },
  { id: 'abuja', name: 'Abuja' },
];

const settlementTypeOptions = [
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
];

const bankOptions = [
  { id: 'access', name: 'Access Bank' },
  { id: 'zenith', name: 'Zenith Bank' },
];

const genderOptions = [
  { id: 'male', name: 'Male' },
  { id: 'female', name: 'Female' },
];

export default function CreateReportForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MerchantInput>({
    shouldUnregister: true,
    defaultValues: initialValues ?? defaultValues,
  });
  
  const { mutate: createShippingClass, isLoading: creating } =
    useCreateShippingMutation();
  const { mutate: updateShippingClass, isLoading: updating } =
    useUpdateShippingMutation();

  const onSubmit = async (values: MerchantInput) => {
    // Handle form submission
  };

  const type = useWatch({ name: 'type', control });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          details={t('form:merchant-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          {/* Personal Information */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2 pt-5 mt-2">
              <h3 className="text-lg font-semibold mb-5">
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
            
            <div className="mb-5">
              <Label>{t('form:input-label-gender')}</Label>
              <SelectInput
                name="gender"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={genderOptions}
                
              />
            </div>
          </div>

          {/* Merchant Information */}
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <div className="md:col-span-2 border-t border-gray-200 pt-5 mt-2">
              <h3 className="text-lg font-semibold mb-5">
                {t('form:section-title-merchant-info')}
              </h3>
            </div>
            
            <Input
              label={t('form:input-label-merchant-id')}
              {...register('merchantId')}
              variant="outline"
              className="mb-5"
            />
            
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
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <div className="md:col-span-2 border-t border-gray-200 pt-5 mt-2">
              <h3 className="text-lg font-semibold mb-5">
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
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <div className="md:col-span-2 border-t border-gray-200 pt-5 mt-2">
              <h3 className="text-lg font-semibold mb-5">
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
            <FileInput name="marchant.businessLogo" control={control} multiple={false} />
          </div>

        </Card>
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

        <Button loading={creating || updating} disabled={creating || updating}>
          {t('form:button-label-add-merchant')}
        </Button>
      </div>
    </form>
  );
}