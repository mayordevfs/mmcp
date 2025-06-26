import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm, useWatch } from 'react-hook-form';
import Card from '@/components/common/card';
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
import { useEffect, useState } from 'react';
import { Routes } from '@/config/routes';
import useGetLookup from '@/hooks/useGetLookup';
import { useFileUpload } from '@/hooks/useFileUpload';

type SelectOption = {
  id: string;
  name: string;
  description?: string;
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
  billerCategory: string;
  amountType: string;
  validationRequired: string;
  logoURL: string | File | null;
};

type FormValuesWithSelectObjects = Omit<FormValues, 'status' | 'billerCategory' | 'amountType' | 'validationRequired'> & {
  status: SelectOption | null;
  billerCategory: SelectOption | null;
  amountType: SelectOption | null;
  validationRequired: SelectOption | null;
};

const defaultValues: FormValuesWithSelectObjects = {
  billerCode: '',
  billerName: '',
  bankName: '',
  billerShortName: '',
  billerDescription: '',
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
};

const amountOptions: SelectOption[] = [
  { name: 'Fixed', id: 'FIXED' },
  { name: 'Variable', id: 'VARIABLE' },
  { name: 'Range', id: 'RANGE' },
];

const mandatoryFlagOptions: SelectOption[] = [
  { id: 'Y', name: 'Yes' },
  { id: 'N', name: 'No' },
];

type IProps = {
  initialValues?: FormValues | undefined | null;
};

export default function EditBillerForm({ initialValues }: Readonly<IProps>) {
  const router = useRouter();
  const { t } = useTranslation();
  const { query } = router;
  const [originalBiller, setOriginalBiller] = useState<any>(null);
  const [isFormPopulated, setIsFormPopulated] = useState(false);

  const statusOptions = useGetLookup('STATUS');
  const billerCategoryOptions = useGetLookup('BILLER_CATEGORY');

  const { data: billerData, isLoading: billerLoading } = useQuery(
    ['billerDetails', query?.id],
    () =>
      axiosInstance.request({
        method: 'GET',
        url: `billpayment/getbillerdetail?billerCode=${query?.id}`,
        params: {
            pageNumber: 1,
            pageSize: 20,
        },
      }),
    {
      enabled: !!query?.id,
    }
  );

  const { register, handleSubmit, control, watch, setValue, reset, getValues } = useForm<FormValuesWithSelectObjects>({
    resolver: yupResolver(billerValidationSchema),
    shouldUnregister: true,
    defaultValues: defaultValues,
  });

  const { fileUrl, handleFileChange, fileInputRef, fileError, previewUrl, selectedFile, isUploadingFile, setInitialImage, hasNewImage } = useFileUpload();

  const findOptionByValue = (options: any[], value: any) => {
    if (!options || !Array.isArray(options) || value === null || value === undefined) return null;
    
    return options.find((option: any) => {
      if (option.id === value || option.name === value) {
        return true;
      }
      
      try {
        const valueStr = String(value).toLowerCase();
        const optionIdStr = String(option.id).toLowerCase();
        const optionNameStr = String(option.name).toLowerCase();
        
        return optionIdStr === valueStr || optionNameStr === valueStr;
      } catch (error) {
        return false;
      }
    }) || null;
  };

  useEffect(() => {
    const biller = billerData?.data;
    
    if (biller && statusOptions?.length > 0 && billerCategoryOptions?.length > 0 && !isFormPopulated) {
      console.log('Populating form with biller data:', biller);
      
      setOriginalBiller(biller);
      
      if (biller.logoURL) {
        setInitialImage(biller.logoURL);
      }
      
      const formData = {
        billerCode: biller?.billerCode || '',
        billerName: biller?.billerName || '',
        bankName: biller?.bankName || '',
        billerShortName: biller?.billerShortName || '',
        billerDescription: biller?.billerDescription || '',
        billerRef: biller?.billerRef || '',
        serviceProvider: biller?.serviceProvider || '',
        minAmount: biller?.minAmount || 0,
        maxAmount: biller?.maxAmount || 0,
        logoURL: biller?.logoURL || null,
        
        status: findOptionByValue(statusOptions, biller.status),
        billerCategory: findOptionByValue(billerCategoryOptions, biller.billerCategory),
        amountType: findOptionByValue(amountOptions, biller.amountType),
        validationRequired: findOptionByValue(mandatoryFlagOptions, biller.validationRequired),
      };
      
      console.log('Form data to be set:', formData);
      
      reset(formData);
      
      setIsFormPopulated(true);
    }
  }, [billerData, statusOptions, billerCategoryOptions, reset, setInitialImage, isFormPopulated]);

  const { mutate: updateBiller, isLoading: isUpdatingBiller } = useMutation(
    (formData: any) =>
      axiosInstance.request({
        method: 'POST',
        url: `billpayment/saveBiller`,
        data: {
            // billerCode : billerCode,
          ...formData,
          countryCode: 'NG',
          entityCode: 'ETZ',
          id: originalBiller?.id
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc);
          return;
        }
        toast.success('Biller updated successfully');
        router.push(Routes?.biller?.list);
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request');
          } else if (error.response.status === 422) {
            toast.error(t('Error Updating Biller'));
          } else if (error.response.status === 500) {
            toast.error(t('Error Updating Biller'));
          }
        } else {
          toast.error(t('Error Updating Biller'));
        }
      },
    }
  );

  const onSubmit = async (values: FormValuesWithSelectObjects) => {
    let finalImageURL = '';
  
    if (originalBiller) {
      finalImageURL = originalBiller?.logoURL || '';
      if (hasNewImage && fileUrl) {
        finalImageURL = fileUrl;
      }
    }
    
    const payload = {
      billerCode: values.billerCode,
      billerName: values.billerName,
      bankName: values.bankName,
      billerShortName: values.billerShortName,
      billerDescription: values.billerDescription,
      billerRef: values.billerRef,
      serviceProvider: values.serviceProvider,
      minAmount: values.minAmount,
      maxAmount: values.maxAmount,
      logoURL: finalImageURL,
      
      status: values.status?.id,
      billerCategory: values.billerCategory?.id,
      amountType: values.amountType?.id,
      validationRequired: values.validationRequired?.id,
    };
    
    console.log('Submitting payload:', payload);
    updateBiller(payload);
  };

  if (billerLoading || !statusOptions || !billerCategoryOptions) {
    return (
      <Card className="w-full">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading biller data...</div>
        </div>
      </Card>
    );
  }

  if (!billerLoading && !billerData?.data) {
    return (
      <Card className="w-full">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-red-600">Biller not found</div>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            disabled
          />

          <Input
            label={t('form:input-label-biller-name')}
            {...register('billerName')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-bank-name')}
            {...register('bankName')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-biller-short-name')}
            {...register('billerShortName')}
            variant="outline"
            className="mb-5"
          />

          <TextArea
            label={t('form:input-label-biller-description')}
            {...register('billerDescription')}
            variant="outline"
            className="mb-5 md:col-span-2"
          />

          <div className="mb-5">
            <Label>{t('form:input-label-biller-category')}</Label>
            <SelectInput
              name="billerCategory"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={billerCategoryOptions}
            />
          </div>

          <div className="mb-5">
            <Label>{t('form:input-label-validation-required')}</Label>
            <SelectInput
              name="validationRequired"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={mandatoryFlagOptions}
            />
          </div>

          {/* File upload */}
          <div className="mb-5 md:col-span-2">
            <Label>{t('form:input-label-logo-url')}</Label>
            
            {/* Show existing logo if available */}
            {originalBiller?.logoURL && !previewUrl && (
              <div className="mb-4">
                <Label>Current Logo:</Label>
                <div className="mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img
                    src={originalBiller.logoURL}
                    alt="Current biller logo"
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
                    alt="Biller logo preview"
                    className="max-w-full max-h-32 object-contain mx-auto"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-5">
            <Label>{t('form:input-label-status')}</Label>
            <SelectInput
              name="status"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={statusOptions}
            />
          </div>

          <Input
            label={t('form:input-label-biller-ref')}
            {...register('billerRef')}
            variant="outline"
            className="mb-5"
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
          </div>

          <Input
            label={t('form:input-label-service-provider')}
            {...register('serviceProvider')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-min-amount')}
            type="number"
            {...register('minAmount')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-max-amount')}
            type="number"
            {...register('maxAmount')}
            variant="outline"
            className="mb-5"
          />
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

          <Button 
            loading={isUpdatingBiller} 
            disabled={isUpdatingBiller || isUploadingFile}
          >
            {t('Update biller')}
          </Button>
        </div>
      </Card>
    </form>
  );
}