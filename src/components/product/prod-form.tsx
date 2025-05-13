import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Label from '@/components/ui/label';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const defaultValues = {
  productCode: '',
  productName: '',
  productType: '',
  priceType: 'FIXED',
  status: '',
  amount: '',
  charge: '',
  chargeType: 'FIXED',
  validationRequired: false,
  minAmount: '',
  maxAmount: '',
};

type ProductFormValues = {
  productCode: string;
  productName: string;
  productType: string;
  priceType: string;
  status: string;
  amount: string;
  charge: string;
  chargeType: string;
  validationRequired: boolean;
  minAmount: string;
  maxAmount: string;
};

type IProps = {
  initialValues?: ProductFormValues | null;
};

const priceTypeOptions = [
  { value: 'FIXED', label: 'Fixed' },
  { value: 'VARIABLE', label: 'Variable' },
  { value: 'RANGE', label: 'Range' },
];

const chargeTypeOptions = [
  { value: 'FIXED', label: 'Fixed' },
  { value: 'PERCENT', label: 'Percent' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'DRAFT', label: 'Draft' },
];

const yesNoOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

export default function CreateProductForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: initialValues ?? defaultValues,
  });

  const priceType = watch('priceType');

  const onSubmit = async (values: ProductFormValues) => {
    // Handle form submission
    console.log('Product submitted:', values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:product-description')}
          details={t('form:product-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Product Code */}
            <Input
              label={t('form:input-label-product-code')}
              {...register('productCode', { required: 'Product code is required' })}
              variant="outline"
              error={t(errors.productCode?.message!)}
            />

            {/* Product Name */}
            <Input
              label={t('form:input-label-product-name')}
              {...register('productName', { required: 'Product name is required' })}
              variant="outline"
              error={t(errors.productName?.message!)}
            />

            {/* Product Type */}
            <Input
              label={t('form:input-label-product-type')}
              {...register('productType')}
              variant="outline"
            />

            {/* Price Type */}
            <div>
              <Label>{t('form:input-label-price-type')}</Label>
              <SelectInput
                name="priceType"
                control={control}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                options={priceTypeOptions}
              />
            </div>

            {/* Status */}
            <div>
              <Label>{t('form:input-label-status')}</Label>
              <SelectInput
                name="status"
                control={control}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                options={statusOptions}
              />
            </div>

            {/* Amount (shown only when price type is FIXED) */}
            {priceType === 'FIXED' && (
              <Input
                label={t('form:input-label-amount')}
                {...register('amount')}
                variant="outline"
                type="number"
              />
            )}

            {/* Charge */}
            <Input
              label={t('form:input-label-charge')}
              {...register('charge')}
              variant="outline"
              type="number"
            />

            {/* Type of Charge */}
            <div>
              <Label>{t('form:input-label-charge-type')}</Label>
              <SelectInput
                name="chargeType"
                control={control}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                options={chargeTypeOptions}
              />
            </div>

            {/* Validation Required */}
            <div>
              <Label>{t('form:input-label-validation-required')}</Label>
              <SelectInput
                name="validationRequired"
                control={control}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                options={yesNoOptions}
              />
            </div>

            {/* Minimum Amount */}
            <Input
              label={t('form:input-label-min-amount')}
              {...register('minAmount')}
              variant="outline"
              type="number"
            />

            {/* Maximum Amount */}
            <Input
              label={t('form:input-label-max-amount')}
              {...register('maxAmount')}
              variant="outline"
              type="number"
            />
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button
          variant="outline"
          onClick={router.back}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button>

        <Button type="submit">
          {t('form:button-label-save-product')}
        </Button>
      </div>
    </form>
  );
}