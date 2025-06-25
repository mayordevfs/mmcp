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
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';

const ReactQuill = dynamic(() => import('react-quill'), {
      ssr: false,
      loading: () => <p>Loading Editor...</p>
    })

interface messagingTemplateType{
 title:string;
 templateMsg:string;
 templateCode:string;
 msgType:{id:string,name:string}
}

const defaultValues:messagingTemplateType = { 
  title:'',
  templateMsg:'',
  templateCode:'',
  msgType:{id:'',name:''}
}

const msgType = [
  {id:"email", name:"Email"},
  {id:"sms",name:"SMS"}
]

export default function UpdateTemplateMessageForm({data}:{data:any}) {
  const { t } = useTranslation();
  const [value, setValue] = useState('')
  const router = useRouter()
  const { register, handleSubmit, control, reset, setValue: setFormValue } = useForm<messagingTemplateType>({
    shouldUnregister: true,
    defaultValues: defaultValues,
  });

  // Effect to populate form fields when data is loaded
  useEffect(() => {
    if (data) {
      // Set form values
      setFormValue('title', data.title || '');
      setFormValue('templateCode', data.templateCode || '');
      
      
      // Set message type - find the matching option from msgType array
      const selectedMsgType = msgType.find(type => type.id === data.msgType);
      if (selectedMsgType) {
        setFormValue('msgType', selectedMsgType);
      }
      
      // Set ReactQuill value
      setValue(data.templateMsg || '');
    }
  }, [data, setFormValue]);

  const { mutate: saveMessagingTemplate, isLoading: isTemplateLoading } = useMutation(
    (formData: any) =>
      axiosInstance.request({
        method: 'POST', 
        url: 'messagingTemplate/save', 
        data: formData,
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc);
          return;
        }
        toast.success('Messaging Template updated successfully!');
        reset()
        router.push(Routes.fetch_templates)
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
          } else if (error.response.status === 422) {
            toast.error(t('Error updating messaging template'));
          } else if (error.response.status === 500) {
            toast.error(t('Error updating messaging template'));
          }
        } else {
          toast.error(t('Error updating messaging template'));
        }
      },
    }
  );

  const onSubmit = async (values: messagingTemplateType) => {
    if (!value) {
      toast.error('Please enter a message template');
      return;
    }
    
    const msgTypeId = values?.msgType?.id;
    
    const payload = {
      id: data?.id || 0, // Include the ID for update operation
      entityCode: 'ETZ',
      msgType: msgTypeId,
      title: values?.title,
      templateCode: values?.templateCode,
      templateMsg: value
    };
    
    saveMessagingTemplate(payload);
  };

  // Show loading state while data is being fetched
  if (!data) {
    return (
      <Card className="w-full">
        <div className="flex justify-center items-center py-10">
          <p>Loading template data...</p>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="mb-5">
            <Label>{t('Message Type')}</Label>
            <SelectInput
              name="msgType"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={msgType}
              rules={{
                required:'This field is required'
              }}
              disabled
            />
          </div>

          <Input
            label={t('Template Code')}
            {...register('templateCode',{required:'This field is required'})}
            variant="outline"
            className="mb-5"
            disabled
          />
          
          <Input
            label={t('Template Title')}
            {...register('title',{required:'This field is required'})}
            variant="outline"
            className="mb-5"
          />

        </div>
        
        {/* ReactQuill as a separate section with proper spacing */}
        <div className='mb-12'>
          <Label className="mb-2 block">Messaging Template</Label>
          <ReactQuill
            theme='snow'
            value={value}
            onChange={setValue}
            className='h-36'
          />
        </div>

        <div className="text-end mt-16">
          <Button loading={isTemplateLoading} disabled={isTemplateLoading}>
            {t('form:button-label-update')}
          </Button>
        </div>
      </Card>
    </form>
  );
}