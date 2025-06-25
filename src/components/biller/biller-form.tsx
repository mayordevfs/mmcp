import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { billerValidationSchema } from './biller-validation-schema';
import axiosInstance from '@/utils/fetch-function';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import TextArea from '@/components/ui/text-area';
import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { useEffect } from 'react';
import FileInput from '../ui/file-input';
import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth';


type SelectOption = {
  id: string;
  name: string;
  description?: string;
};

type Product = {
  productCode: string;
  productDesc: string;
  productName: string;
  amount: number;
  amountType: string;
  status: string;
};

type PaymentField = {
  fieldID: string;
  fieldDataType: string;
  fieldName: string;
  fieldValue: string;
  maxLength: number;
  mandatoryFlag: string;
  inputOrOutput: string;
};

type FormValues = {
  billerCode: string;
  billerName: string;
  bankName: string;
  billerShortName: string;
  billerDescription: string;
  status: string;
  billerRef: string;
  countryCode: string;
  serviceProvider: string;
  minAmount: number;
  maxAmount: number;
  products: Product[];
  paymentData: PaymentField[];
  billerCategory: string;
  amountType: string;
  validationRequired: string;
  logoURL: File | null; 
};

type FormValuesWithSelectObjects = Omit<FormValues, 'status' | 'billerCategory' | 'amountType'  | 'validationRequired' |'products' | 'paymentData'> & {
  status: SelectOption | null;
  billerCategory: SelectOption | null
  amountType: SelectOption | null
  validationRequired: SelectOption | null

  products: Array<Omit<Product, 'amountType' | 'status'> & {
    amountType: SelectOption | null;
    status: SelectOption | null;
  }>;

  paymentData: Array<Omit<PaymentField, 'fieldDataType' | 'mandatoryFlag' | 'inputOrOutput'> & {
    fieldDataType: SelectOption | null;
    mandatoryFlag: SelectOption | null;
    inputOrOutput: SelectOption | null;
  }>;
};

const defaultValues: FormValuesWithSelectObjects = {
  billerCode: '',
  billerName: '',
  bankName: '',
  billerShortName: '',
  billerDescription: '',
  // billerCategoryCode: '',
  billerCategory: null,
  logoURL: null,
  amountType: null,
  validationRequired: null,
  status: null,
  billerRef: '',
  countryCode: 'NG',
  serviceProvider: '',
  minAmount: 0,
  maxAmount: 0,
  products: [
    {
      productCode: '',
      productDesc: '',
      productName: '',
      amount: 0,
      amountType: null,
      status: null,
    },
  ],
  paymentData: [
    {
      fieldID: '',
      fieldName: '',
      fieldValue: '',
      maxLength: 0,
      fieldDataType: null,
      mandatoryFlag: null,
      inputOrOutput: null,
    },
  ],
};

const amountOptions: SelectOption[] = [
  { name: 'Fixed', id: 'FIXED' },
  { name: 'Variable', id: 'VARIABLE' },
  { name: 'Range', id: 'RANGE' }, 
  
];

const datatypeOptions: SelectOption[] = [
  { id: 'STRING', name: 'String' },
  { id: 'NUMBER', name: 'Number' },
  { id: 'DATE', name: 'Date' },
];

const inputOrOutputOptions: SelectOption[] = [
  { id: 'I', name: 'Input' },
  { id: 'O', name: 'Output' },
];

const mandatoryFlagOptions: SelectOption[] = [
  { id: 'Y', name: 'Yes' },
  { id: 'N', name: 'No' },
];

const BillerCreateForm = () => {
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

  const { data: ProductStatusData } = useQuery(
    'productStatus',
    () =>
      axiosInstance.get(
        'lookupdata/getdatabycategorycode/STATUS',
        {
          params: {
            entityCode: 'ETZ',
          }
        }
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

  const { data: BillerCategoryData } = useQuery(
    'billerCategory',
    () =>
      axiosInstanceNoAuth.get(
        'lookupdata/new-list', 
        {
          params: {
            categoryCode: 'BILLER_CATEGORY',
            entityCode: 'ETZ'
          }
        }
      ),
    {
      select: (data) => {
        return data.data.list.map((item: any) => ({
          id: item.code,
          name: item.name,
        }));
      },
    }
  );

  const { t } = useTranslation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValuesWithSelectObjects>({
    defaultValues,
    resolver: yupResolver(billerValidationSchema),
  });

  useEffect(() => {
    console.log('Form errors:', errors);
  }, [errors]);

  
  const { mutate: createBiller, isLoading: saving } = useMutation(
    (formData: FormValues) =>
      axiosInstance.request({
        method: 'POST',
        url: 'billpayment/createBiller',
        data: {
          ...formData,
          countryCode: 'NG',
          state: 'Lagos',
          businessRegion: 'Lagos',
          bvn: '00000011101',
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
        toast.success(t('form:biller-created-success'));
        router.back();
      },
      onError: (error: any) => {
        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request');
          } else if (error.response.status === 422) {
            toast.error(t('common:error-creating-biller'));
          } else if (error.response.status === 500) {
            toast.error(t('common:error-creating-biller'));
          }
          Object.keys(error.response.data).forEach((field: any) => {
            setError(field as any, {
              type: 'manual',
              message: error.response.data[field][0],
            });
          });
        } else {
          toast.error(t('common:error-creating-biller'));
        }
      },
    }
  );

  const onSubmit = (values: FormValuesWithSelectObjects) => {
    const payload: FormValues = {
      ...values,
      status: values.status?.id || '',
      billerCategory: values.billerCategory?.id || '',
      amountType: values.amountType?.id || '',
      validationRequired: values.validationRequired?.id || '',

      logoURL:values.logoURL,
      products: values.products.map((product) => ({
        ...product,
        amountType: product.amountType?.id || '',
        status: product.status?.id || '',
      })),
      paymentData: values.paymentData.map((data) => ({
        ...data,
        fieldDataType: data.fieldDataType?.id || '',
        mandatoryFlag: data.mandatoryFlag?.id || '',
        inputOrOutput: data.inputOrOutput?.id || '',
      })),
    };
    createBiller(payload);
  };
  const logoURL = watch('logoURL');
  console.log(logoURL);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        {/* <Description
          title={t('form:item-description')}
          details={t('form:biller-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        /> */}
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="mt-2 pt-5 md:col-span-2">
              <h3 className="mb-5 text-lg font-semibold">
                {t('form:section-title-biller-info')}
              </h3>
            </div>

            <Input
              label={t('form:input-label-biller-code')}
              {...register('billerCode')}
              variant="outline"
              className="mb-5"
              error={t(errors.billerCode?.message!)}
            />

            <Input
              label={t('form:input-label-biller-name')}
              {...register('billerName')}
              variant="outline"
              className="mb-5"
              error={t(errors.billerName?.message!)}
            />

            {/* <Input
              label={t('form:input-label-bank-name')}
              {...register('bankName')}
              variant="outline"
              className="mb-5"
              error={t(errors.bankName?.message!)}
            /> */}

            <Input
              label={t('form:input-label-biller-short-name')}
              {...register('billerShortName')}
              variant="outline"
              className="mb-5"
              error={t(errors.billerShortName?.message!)}
            />

            <TextArea
              label={t('form:input-label-biller-description')}
              {...register('billerDescription')}
              variant="outline"
              className="mb-5"
              error={t(errors.billerDescription?.message!)}
            />

            {/* <Input
              label={t('form:input-label-biller-category-code')}
              {...register('billerCategoryCode')}
              variant="outline"
              className="mb-5"
              error={t(errors.billerCategoryCode?.message!)}
            /> */}

            {/* <Input
              label={t('form:input-label-biller-category')}
              {...register('billerCategory')}
              variant="outline"
              className="mb-5"
              error={t(errors.billerCategory?.message!)}
            /> */}

            <div className="mb-5">
              <Label>{t('form:input-label-biller-category')}</Label>
              <SelectInput
                name="billerCategory"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={BillerCategoryData || []}
                isLoading={!BillerCategoryData}
              />
              {/* {errors.products?.[0]?.status?.message && (
                <p className="mt-1 text-xs text-red-500">
                  {t(errors.products[0].status.message)}
                </p>
              )} */}
            </div>

            {/* <Input
              label={t('form:input-label-logo-url')}
              {...register('logoURL')}
              variant="outline"
              className="mb-5"
              error={t(errors.logoURL?.message!)}
            /> */}
            <div className="mb-5">
              <Label>{t('form:input-label-validation-required')}</Label>
              <SelectInput
                name="validationRequired"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={mandatoryFlagOptions}
              />
              {/* {errors.paymentData?.[0]?.mandatoryFlag?.message && (
                <p className="mt-1 text-xs text-red-500">
              {t(errors.paymentData[0].mandatoryFlag.message)}
                </p>
              )} */}
            </div>
            <div className="mb-5">
              <Label>{t('form:input-label-logo-url')}</Label>
              <FileInput
                {...register('logoURL')}
                name="biller.logoURL"
                control={control}
                multiple={false}
                error={t(errors.logoURL?.message!)}
              />
            </div>
      
            <div className="mb-5">
              <Label>{t('form:input-label-status')}</Label>
              <SelectInput
                name="status"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={statusData || []}
                isLoading={!statusData}
              />
              {/* {errors.status?.message && (
                <p className="mt-1 text-xs text-red-500">
                  {t(errors.status.message)}
                </p>
              )} */}
            </div>

            <Input
              label={t('form:input-label-biller-ref')}
              {...register('billerRef')}
              variant="outline"
              className="mb-5"
              error={t(errors.billerRef?.message!)}
            />

            <div className="mb-5">
                <Label>{t('form:input-label-amount-type')}</Label>
                <SelectInput
                  name="amountType"
                  control={control}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  options={amountOptions}
                />
                {/* {errors.products?.[0]?.amountType?.message && (
                  <p className="mt-1 text-xs text-red-500">
                  {t(errors.products[0].amountType.message)}
                </p>
              )} */}
            </div>

            <Input
              label={t('form:input-label-service-provider')}
              {...register('serviceProvider')}
              variant="outline"
              className="mb-5"
              error={t(errors.serviceProvider?.message!)}
            />

            <Input
              label={t('form:input-label-min-amount')}
              type="number"
              {...register('minAmount')}
              variant="outline"
              className="mb-5"
              error={t(errors.minAmount?.message!)}
            />

            <Input
              label={t('form:input-label-max-amount')}
              type="number"
              {...register('maxAmount')}
              variant="outline"
              className="mb-5"
              error={t(errors.maxAmount?.message!)}
            />

            <div className="mb-5 md:col-span-2">
              <h4 className="mb-3 text-sm font-semibold">
                {t('form:section-title-products')}
              </h4>
              <div className="rounded border p-4">
                <Input
                  label={t('form:input-label-product-code')}
                  {...register('products.0.productCode')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.products?.[0]?.productCode?.message!)}
                />
                <Input
                  label={t('form:input-label-product-name')}
                  {...register('products.0.productName')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.products?.[0]?.productName?.message!)}
                />
                <TextArea
                  label={t('form:input-label-product-desc')}
                  {...register('products.0.productDesc')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.products?.[0]?.productDesc?.message!)}
                />
                <Input
                  label={t('form:input-label-amount')}
                  type="number"
                  {...register('products.0.amount')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.products?.[0]?.amount?.message!)}
                />
                <div className="mb-5">
                  <Label>{t('form:input-label-amount-type')}</Label>
                  <SelectInput
                    name="products.0.amountType"
                    control={control}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                    options={amountOptions}
                  />
                  {/* {errors.products?.[0]?.amountType?.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {t(errors.products[0].amountType.message)}
                    </p>
                  )} */}
                </div>
                <div className="mb-5">
                  <Label>{t('form:input-label-status')}</Label>
                  <SelectInput
                    name="products.0.status"
                    control={control}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                    options={ProductStatusData || []}
                    isLoading={!ProductStatusData}
                  />
                  {/* {errors.products?.[0]?.status?.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {t(errors.products[0].status.message)}
                    </p>
                  )} */}
                </div>
              </div>
            </div>

            <div className="mb-5 md:col-span-2">
              <h4 className="mb-3 text-sm font-semibold">
                {t('form:section-title-payment-data')}
              </h4>
              <div className="rounded border p-4">
                <Input
                  label={t('form:input-label-field-id')}
                  {...register('paymentData.0.fieldID')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.paymentData?.[0]?.fieldID?.message!)}
                />
                <Input
                  label={t('form:input-label-field-name')}
                  {...register('paymentData.0.fieldName')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.paymentData?.[0]?.fieldName?.message!)}
                />
                <div className="mb-5">
                  <Label>{t('form:input-label-field-data-type')}</Label>
                  <SelectInput
                    name="paymentData.0.fieldDataType"
                    control={control}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                    options={datatypeOptions}
                  />
                  {/* {errors.paymentData?.[0]?.fieldDataType?.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {t(errors.paymentData[0].fieldDataType.message)}
                    </p>
                  )} */}
                </div>
                <Input
                  label={t('form:input-label-max-length')}
                  type="number"
                  {...register('paymentData.0.maxLength')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.paymentData?.[0]?.maxLength?.message!)}
                />
                <div className="mb-5">
                  <Label>{t('form:input-label-mandatory-flag')}</Label>
                  <SelectInput
                    name="paymentData.0.mandatoryFlag"
                    control={control}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                    options={mandatoryFlagOptions}
                  />
                  {/* {errors.paymentData?.[0]?.mandatoryFlag?.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {t(errors.paymentData[0].mandatoryFlag.message)}
                    </p>
                  )} */}
                </div>
                <div className="mb-5">
                  <Label>{t('form:input-label-input-or-output')}</Label>
                  <SelectInput
                    name="paymentData.0.inputOrOutput"
                    control={control}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                    options={inputOrOutputOptions}
                  />
                  {/* {errors.paymentData?.[0]?.inputOrOutput?.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {t(errors.paymentData[0].inputOrOutput.message)}
                    </p>
                  )} */}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4 text-end">
            <Button type="submit" loading={saving} disabled={saving}>
              {t('form:button-label-add-biller')}
            </Button>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default BillerCreateForm;