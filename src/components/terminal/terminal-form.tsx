import Input from '@/components/ui/input';
import { useForm, useWatch } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Radio from '@/components/ui/radio/radio';
import Label from '@/components/ui/label';
import { ShippingType, Shipping, TerminalInput } from '@/types';
import {
  useCreateShippingMutation,
  useUpdateShippingMutation,
} from '@/data/shipping';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/fetch-function';
import { useMutation, useQuery } from 'react-query';
import useGetLookup from '@/hooks/useGetLookup';


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

export default function CreateTerminalForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const terminalModelOptions = useGetLookup('TERMINAL_MODEL');
  const bankOptions = useGetLookup('BANK');
  const terminalStatusOptions = useGetLookup('TERMINAL_STATUS');

  console.log(terminalStatusOptions);
  console.log(bankOptions);
  
  
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TerminalInput>({
    shouldUnregister: true,
    // defaultValues,
  });
  
  const { mutate: createShippingClass, isLoading: creating } =
    useCreateShippingMutation();
  const { mutate: updateShippingClass, isLoading: updating } =
    useUpdateShippingMutation();
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
          // router.back
          return;
        }
        toast.success('Terminal created successfully');
        router.back();
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request');
          } else if (error.response.status === 422) {
            toast.error(t('common:error-creating-terminal'));
          } else if (error.response.status === 500) {
            toast.error(t('common:error-creating-terminal'));
          }
        } else {
          toast.error(t('common:error-creating-terminal'));
        }
      },
    }
  );

  const onSubmit = async (values: TerminalInput) => {
    const payload = {
      terminalId: values.terminalId,
      serialNumber: values.terminalSerialNo,
      terminalModel: values.terminalModel?.id,
      // : values.operatingSystem,
      appVersion: values.appVersion,
      bankName: values.bank?.name,
      bankCode:values?.bank?.id,
      terminalStatus: values.terminalStatus?.id,
      condition: values.condition?.id,
      id: 0
    };
    saveTerminal(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full sm:w-8/12 md:w-2/3">
        {/* Terminal Information */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="mt-2 pt-5 md:col-span-2">
            <h3 className="mb-5 text-lg font-semibold">
              {t('form:section-title-terminal-info')}
            </h3>
          </div>

          <Input
            label={t('form:input-label-terminal-id')}
            {...register('terminalId')}
            variant="outline"
            className="mb-5"
            error={t(errors.terminalId?.message!)}
          />

          <Input
            label={t('form:input-label-terminal-serial-no')}
            {...register('terminalSerialNo')}
            variant="outline"
            className="mb-5"
            error={t(errors.terminalSerialNo?.message!)}
          />

          <div className="mb-5">
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
            className="mb-5"
            error={t(errors.operatingSystem?.message!)}
          />

          <Input
            label={t('form:input-label-app-version')}
            {...register('appVersion')}
            variant="outline"
            className="mb-5"
            error={t(errors.appVersion?.message!)}
          />

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

          <div className="mb-5">
            <Label>{t('form:input-label-terminal-status')}</Label>
            <SelectInput
              name="terminalStatus"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={terminalStatusOptions || []}
              isLoading={!terminalStatusOptions}
            />
          </div>

          <div className="mb-5">
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

        <Button loading={isTerminalLoading} disabled={isTerminalLoading}>
          {t('form:button-label-add-terminal')}
        </Button>
      </div>
    </form>
  );
}