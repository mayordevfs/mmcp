import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/fetch-function';
import { useMutation, useQuery } from 'react-query';
import TextArea from '../ui/text-area';
import 'react-quill/dist/quill.snow.css'
import { useState } from 'react';

import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import useGetLookup from '@/hooks/useGetLookup';
import useGetCategoryCode from '@/hooks/useGetCategoryCode';

interface messagingTemplateType{
 categoryCode:{code:string,name:string};
 lookupCode:string;
 lookupName:string;
 lookupDesc:string;
 status:{id:string,name:string}
}

const defaultValues:messagingTemplateType = { 
  categoryCode:{code:'',name:''},
  lookupCode:'',
  lookupName:'',
  status:{id:'',name:''},
  lookupDesc:''
}

const status = [
  {id:"Active", name:"Active"},
  {id:"Inactive",name:"Inactive"}
]

export default function CreateLookupForm() {
  const { t } = useTranslation();
  const router = useRouter()
  
  const { register, handleSubmit, control,reset } = useForm<messagingTemplateType>({
    shouldUnregister: true,
    defaultValues: defaultValues,
  });

  const {data:dropdownData} = useGetCategoryCode()
  const categoryOptions = dropdownData?.data?.list
  
  console.log(dropdownData);
  
  const { mutate: saveLookupData, isLoading: isLookupLoading,data } = useMutation(
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
        reset()
        toast.success('Lookup Data created successfully!');
        reset()
        router.push(Routes.lookup_data)
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
          } else if (error.response.status === 422) {
            toast.error(t('Error creating lookup data'));
          } else if (error.response.status === 500) {
            toast.error(t('Error creating lookup data'));
          }
        } else {
          toast.error(t('Error creating lookup data'));
        }
      },
    }
  );

  console.log(data);
  

  const onSubmit = async (values:messagingTemplateType) => {
    
    const payload = {
      id:0,
      entityCode:'ETZ',
      countryCode:'NG',
      lookupDesc:values?.lookupDesc,
      lookupName:values?.lookupName,
      lookupCode:values?.lookupCode,
      status:values?.status?.id,
      categoryCode:values?.categoryCode?.code,
      usageAccess:'All'
    };
    
    saveLookupData(payload);
  };


  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <Input
            label={t('Lookup Name')}
            {...register('lookupName',{required:'This field is required'})}
            variant="outline"
            className="mb-5"
          />
          
          <div className="mb-5">
            <Label>{t('Category Code')}</Label>
            <SelectInput
              name="categoryCode"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.code}
              options={categoryOptions}
              rules={{
                required:'This field is required'
              }}
            />
          </div>

          <div className="mb-5">
            <Label>{t('Status')}</Label>
            <SelectInput
              name="status"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={status}
              rules={{
                required:'This field is required'
              }}
            />
          </div>

          <Input
            label={t('LookupCode')}
            {...register('lookupCode',{required:'This field is required'})}
            variant="outline"
            className="mb-5"
          />

          <TextArea
            label={t('Lookup Description')}
            {...register('lookupDesc',{required:'This field is required'})}
            variant="outline"
            className="mb-5"
          />

        </div>
        
        

        <div className="text-end mt-16">
          <Button loading={isLookupLoading} disabled={isLookupLoading}>
            {t('form:button-label-submit')}
          </Button>
        </div>
      </Card>
    </form>
  );
}