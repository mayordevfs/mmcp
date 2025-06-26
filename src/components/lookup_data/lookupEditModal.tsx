import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/fetch-function';
import { useMutation } from 'react-query';
import TextArea from '../ui/text-area';
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react';

import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { useModalAction, useModalState } from '../ui/modal/modal.context';
import useGetCategoryCode from '@/hooks/useGetCategoryCode';

interface messagingTemplateType {
  categoryCode: { code: string, name: string } | null;
  lookupCode: string;
  lookupName: string;
  lookupDesc: string;
  status: { id: string, name: string } | null;
}

const defaultValues: messagingTemplateType = { 
  categoryCode: null,
  lookupCode: '',
  lookupName: '',
  status: null,
  lookupDesc: ''
}

const status = [
  { id: "Active", name: "Active" },
  { id: "Inactive", name: "Inactive" }
]

export default function LookupEditForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  const [isFormPopulated, setIsFormPopulated] = useState(false);
  
  // Get category code options
  const { data: dropdownData } = useGetCategoryCode();
  const categoryOptions = dropdownData?.data?.list;
  
  const { 
    register, 
    handleSubmit, 
    control, 
    reset, 
    setValue,
    getValues,
    formState: { errors }
  } = useForm<messagingTemplateType>({
    shouldUnregister: true,
    defaultValues: defaultValues,
  });

  console.log('Lookup data from modal:', data?.lookupData);

  const { mutate: saveLookupData, isLoading: isLookupLoading } = useMutation(
    (formData: any) =>
      axiosInstance.request({
        method: 'POST',
        url: 'lookupdata/save',
        data: formData,
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        
        if (data?.data?.responseCode !== '000') {
          toast.error(data?.data?.responseMessage);
          return;
        }
        toast.success('Lookup Data updated successfully!');
        reset();
        closeModal()
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
          } else if (error.response.status === 422) {
            toast.error(t('Error updating lookup data'));
          } else if (error.response.status === 500) {
            toast.error(t('Error updating lookup data'));
          }
        } else {
          toast.error(t('Error updating lookup data'));
        }
      },
    }
  );

  // Helper function to find option by value
  const findOptionByValue = (options: any[], value: any) => {
    if (!options || !Array.isArray(options) || value === null || value === undefined) return null;
    
    return options.find((option: any) => {
      // Direct equality check first
      if (option.id === value || option.name === value || option.code === value) {
        return true;
      }
      
      // String comparison (case-insensitive) only if both values can be converted to strings
      try {
        const valueStr = String(value).toLowerCase();
        const optionIdStr = String(option.id || '').toLowerCase();
        const optionNameStr = String(option.name || '').toLowerCase();
        const optionCodeStr = String(option.code || '').toLowerCase();
        
        return optionIdStr === valueStr || optionNameStr === valueStr || optionCodeStr === valueStr;
      } catch (error) {
        // If string conversion fails, skip string comparison
        return false;
      }
    }) || null;
  };

  // Populate form with lookup data
  useEffect(() => {
    const lookupData = data?.lookup;
    
    // Only proceed if we have lookup data and form hasn't been populated yet and categoryOptions are available
    if (lookupData && !isFormPopulated && categoryOptions) {
      console.log('Populating form with lookup data:', lookupData);
      
      // Debug: Log lookup data types
      console.log('Lookup data types:', {
        categoryCode: typeof lookupData.categoryCode,
        categoryCodeValue: lookupData.categoryCode,
        lookupCode: typeof lookupData.lookupCode,
        lookupCodeValue: lookupData.lookupCode,
        lookupName: typeof lookupData.lookupName,
        lookupNameValue: lookupData.lookupName,
        lookupDesc: typeof lookupData.lookupDesc,
        lookupDescValue: lookupData.lookupDesc,
        status: typeof lookupData.status,
        statusValue: lookupData.status
      });
      
      // Create form data with proper dropdown selections
      const formData = {
        lookupCode: lookupData?.lookupCode || '',
        lookupName: lookupData?.lookupName || '',
        lookupDesc: lookupData?.lookupDesc || '',
        
        // Handle dropdown fields - convert string to object
        categoryCode: findOptionByValue(categoryOptions, lookupData.categoryCode),
        status: findOptionByValue(status, lookupData.status),
      };
      
      console.log('Form data to be set:', formData);
      
      // Reset the entire form with the new data
      reset(formData);
      
      // Mark as populated to prevent re-population
      setIsFormPopulated(true);
    }
  }, [
    data?.lookup,
    categoryOptions,
    reset, 
    isFormPopulated
  ]);

  // Debug: Log current form values
  console.log('Current form values:', getValues());

  const onSubmit = async (values: any) => {
    console.log('Form values on submit:', values);
    
    const payload = {
      id: data?.lookup.id, // Use the existing lookup ID if available
      entityCode: 'ETZ',
      countryCode: 'NG',
      lookupDesc: values?.lookupDesc,
      lookupName: values?.lookupName,
      lookupCode: values?.lookupCode,
      status: values?.status?.id,
      categoryCode: values?.categoryCode?.code,
      usageAccess: 'All'
    };
    
    console.log('Submitting payload:', payload);
    saveLookupData(payload);
  };

 return (
  <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-md shadow-sm">
    <div className="border-b border-border-base pb-4 mb-6">
      <h1 className="text-xl font-semibold text-heading">
        {t('Edit Lookup Data')}
      </h1>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {t('Lookup Information')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('Lookup Name')}
            {...register('lookupName', { required: 'This field is required' })}
            variant="outline"
            error={t(errors.lookupName?.message!)}
          />

          <div>
            <Label>{t('Category Code')}</Label>
            <SelectInput
              name="categoryCode"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.code}
              options={categoryOptions}
              rules={{ required: 'This field is required' }}
              disabled
            />
          </div>

          <div>
            <Label>{t('Status')}</Label>
            <SelectInput
              name="status"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={status}
              rules={{ required: 'This field is required' }}
            />
          </div>

          <Input
            label={t('Lookup Code')}
            {...register('lookupCode', { required: 'This field is required' })}
            variant="outline"
            error={t(errors.lookupCode?.message!)}
          />

          <div className="md:col-span-2">
            <TextArea
              label={t('Lookup Description')}
              {...register('lookupDesc', { required: 'This field is required' })}
              variant="outline"
              error={t(errors.lookupDesc?.message!)}
            />
          </div>
        </div>
      </Card>

      <div className="text-end">
        <Button loading={isLookupLoading} disabled={isLookupLoading}>
          {t('form:button-label-update')}
        </Button>
      </div>
    </form>
  </div>
);

}