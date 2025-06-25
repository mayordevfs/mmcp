import Input from '@/components/ui/input';
import { useForm, useWatch } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';

import Label from '@/components/ui/label';
import { ShippingType, Shipping, TerminalInput } from '@/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/fetch-function';
import { useMutation, useQuery } from 'react-query';
import useGetLookup from '@/hooks/useGetLookup';
import { useModalAction, useModalState } from '../ui/modal/modal.context';
import { useEffect, useState } from 'react';

const defaultValues = {
  terminalId: '',
  terminalSerialNo: '',
  terminalModel: '',
  operatingSystem: '',
  appVersion: '',
  bank: '',
  terminalStatus: '',
  condition: '',
};

type IProps = {
  initialValues?: Shipping | undefined | null;
};

const conditionOptions = [
  { id: 'new', name: 'New' },
  { id: 'used', name: 'Used' },
  { id: 'refurbished', name: 'Refurbished' },
];

export default function UpdateTerminalForm({ initialValues }: IProps) {
  const { data } = useModalState();
  const {closeModal} = useModalAction()
  const { t } = useTranslation();
  const [isFormPopulated, setIsFormPopulated] = useState(false);
  
  const terminalModelOptions = useGetLookup('TERMINAL_MODEL');
  const bankOptions = useGetLookup('BANK');
  const terminalStatusOptions = useGetLookup('TERMINAL_STATUS');

  console.log('Terminal data from modal:', data?.terminal);
  console.log('Available options:', {
    terminalModelOptions,
    bankOptions,
    terminalStatusOptions
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<any>({
    shouldUnregister: true,
    defaultValues: defaultValues,
  });
  
  
  const { mutate: saveTerminal, isLoading: isTerminalLoading } = useMutation(
    (formData: any) =>
      axiosInstance.request({
        method: 'POST',
        url: '/terminals/save',
        data: formData,
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.responseCode !== '000') {
          toast.error(data?.data?.responseMessage);
          return;
        }
        toast.success('Terminal updated successfully');
        // Optionally close modal or navigate back
        closeModal()
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request');
          } else if (error.response.status === 422) {
            toast.error(t('common:error-updating-terminal'));
          } else if (error.response.status === 500) {
            toast.error(t('common:error-updating-terminal'));
          }
        } else {
          toast.error(t('common:error-updating-terminal'));
        }
      },
    }
  );

  // Helper function to find option by value - same as the merchant form
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

  // Populate form with terminal data
  useEffect(() => {
    const terminal = data?.terminal;
    
    // Only proceed if we have terminal data and all required options are loaded
    if (terminal && terminalModelOptions?.length > 0 && bankOptions?.length > 0 && terminalStatusOptions?.length > 0 && !isFormPopulated) {
      console.log('Populating form with terminal data:', terminal);
      
      // Debug: Log terminal data types
      console.log('Terminal data types:', {
        terminalModel: typeof terminal.terminalModel,
        terminalModelValue: terminal.terminalModel,
        bankName: typeof terminal.bankName,
        bankNameValue: terminal.bankName,
        status: typeof terminal.status,
        statusValue: terminal.status
      });
      
      // Create form data with proper dropdown selections
      const formData = {
        terminalId: terminal?.terminalId || '',
        terminalSerialNo: terminal?.serialNumber || '',
        operatingSystem: terminal?.operatingSystem || '',
        appVersion: terminal?.appVersion || '',
        
        // Handle dropdown fields - convert strings to objects
        terminalModel: findOptionByValue(terminalModelOptions, terminal.terminalModel),
        bank: findOptionByValue(bankOptions, terminal.bankName),
        terminalStatus: findOptionByValue(terminalStatusOptions, terminal.status),
        condition: findOptionByValue(conditionOptions, terminal.condition),
      };
      
      console.log('Form data to be set:', formData);
      
      // Reset the entire form with the new data
      reset(formData);
      
      // Mark as populated to prevent re-population
      setIsFormPopulated(true);
    }
  }, [
    data?.terminal, 
    terminalModelOptions, 
    bankOptions, 
    terminalStatusOptions,
    reset, 
    isFormPopulated
  ]);

  // Debug: Log current form values
  console.log('Current form values:', getValues());

  const onSubmit = async (values: TerminalInput) => {
    console.log('Form values on submit:', values);
    
    const payload = {
      terminalId: values.terminalId,
      serialNumber: values.terminalSerialNo,
      terminalModel: values.terminalModel?.id,
      operatingSystem: values.operatingSystem,
      appVersion: values.appVersion,
      bankName: values.bank?.name,
      bankCode: values?.bank?.id,
      terminalStatus: values.terminalStatus?.id,
      condition: values.condition?.id,
      id: data?.terminal?.id || 0 // Use the existing terminal ID if available
    };
    
    console.log('Submitting payload:', payload);
    saveTerminal(payload);
  };

  // Show loading state while options are being fetched
  if (!terminalModelOptions || !bankOptions || !terminalStatusOptions) {
    return (
      <div className='h-full bg-white w-[max(90vw,600px)] p-5'>
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading terminal data...</div>
        </div>
      </div>
    );
  }

  return (
     <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-md shadow-sm">
    <div className="border-b border-border-base pb-4 mb-6">
      <h1 className="text-xl font-semibold text-heading">
        {t('Update Terminal')}
      </h1>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {t('form:section-title-terminal-info')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('form:input-label-terminal-id')}
            {...register('terminalId')}
            variant="outline"
            error={t(errors.terminalId?.message!)}
          />

          <Input
            label={t('form:input-label-terminal-serial-no')}
            {...register('terminalSerialNo')}
            variant="outline"
            error={t(errors.terminalSerialNo?.message!)}
          />

          <div>
            <Label>{t('form:input-label-terminal-model')}</Label>
            <SelectInput
              name="terminalModel"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={terminalModelOptions}
            />
          </div>

          <Input
            label={t('form:input-label-operating-system')}
            {...register('operatingSystem')}
            variant="outline"
            error={t(errors.operatingSystem?.message!)}
          />

          <Input
            label={t('form:input-label-app-version')}
            {...register('appVersion')}
            variant="outline"
            error={t(errors.appVersion?.message!)}
          />

          <div>
            <Label>{t('form:input-label-bank')}</Label>
            <SelectInput
              name="bank"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={bankOptions}
            />
          </div>

          <div>
            <Label>{t('form:input-label-terminal-status')}</Label>
            <SelectInput
              name="terminalStatus"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={terminalStatusOptions}
              isLoading={!terminalStatusOptions}
            />
          </div>

          <div>
            <Label>{t('form:input-label-condition')}</Label>
            <SelectInput
              name="condition"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={conditionOptions}
            />
          </div>
        </div>
      </Card>

      <div className="text-end">
        <Button loading={isTerminalLoading} disabled={isTerminalLoading}>
          {t('Update Terminal')}
        </Button>
      </div>
    </form>
  </div>
  );
}