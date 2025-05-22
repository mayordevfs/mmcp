import Input from '@/components/ui/input';
import { useForm, useWatch } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import { TransTypeInput } from '@/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/fetch-function';
import { useMutation } from 'react-query';
import useGetLookup from '@/hooks/useGetLookup';
import { random20DigitNumber } from '@/lib/helper';
import { useTransactionTypeStore } from '@/contexts/editContext/transactionTypeContext';
import { useEffect } from 'react';

const defaultValues: TransTypeInput = {
  tranName: '',
  tranType: {
    id: '',
    name: '',
  },
  merchCategory: {
    id: '',
    name: '',
  },
  dailyFreq: 0,
  maxLimit: 0,
  dailyLimit: 0,
  agentCommission: 0,
  platformCommission: 0,
  networkCommission: 0,
  aggregatorCommission: 0,
  serviceFee: 0,
  charge: 0,
  chargeType: {
    id: '',
    name: '',
  },
  minLimit: 0,
  capLimit: 0.0,
};

const chargeType = [
  { id: 'fixed', name: 'FIXED' },
  { id: 'percentage', name: 'PERCENTAGE' },
];

export default function UpdateTransactionTypeForm({ id }: { id: string | string[] | undefined }) {
  const router = useRouter();
  const { t } = useTranslation();
  const merchantCategoryOptions = useGetLookup('MERCHANT_GROUP');
  const transactionTypeOptions = useGetLookup('TRAN_CODE');
  const setUpRefNo = random20DigitNumber();
  const { transactionTypes } = useTransactionTypeStore();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
  } = useForm<TransTypeInput>({
    shouldUnregister: true,
    defaultValues,
  });

  console.log(getValues().merchCategory,getValues().tranType);
  
  
  useEffect(() => {
    if (transactionTypes && id) {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
      const match = transactionTypes.find((t) => t.id === numericId);

      if (match) {
        const tranTypeName = transactionTypeOptions.find((t)=>t.id==match?.tranCode)
        const merchCategoryName = merchantCategoryOptions.find((t)=>t.id==match?.branchCode)
        
        reset({
          tranName: match.tranName,
          tranType: {
            id: match.tranCode,
            name: tranTypeName?.name,
          },
          merchCategory: {
            id: match.branchCode,
            name: merchCategoryName?.name,
          },
          dailyFreq: match.dailyFreq,
          maxLimit: match.maxLimit,
          dailyLimit: match.dailyLimit,
          agentCommission: match.agentCommission,
          platformCommission: match.platformCommission,
          networkCommission: match.networkCommission,
          aggregatorCommission: match.aggregatorCommission,
          serviceFee: match.serviceFee,
          charge: match.charge,
          chargeType: {
            id: match.chargeType,
            name: match.chargeType,
          },
          minLimit: match.minLimit,
          capLimit: match.capLimit,
        });
      }
    }
  }, [transactionTypes, id, reset]);

  const { mutate: updateTransactionType, isLoading } = useMutation(
    (formData: any) =>
      axiosInstance.request({
        method: 'POST',
        url: 'transTypeSetup/create',
        data: {
          ...formData,
          id:Number(id),
          entityCode: 'ETZ',
          customerType: 'MERCHANT',
          tranCode: getValues()?.tranType?.id,
          status: 'ACTIVE',
          bankCommission: 0,
          groupCommission: 0,
          otherCharge: 0,
          tranChannel: 'MOBILE',
          roleAllowed: '',
          sharingType: '',
          branchCode: getValues()?.merchCategory.id,
          tax: 0,
          setUpRefNo,
          FeeTiers: [{}],
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc);
          return;
        }
        toast.success('Transaction type updated successfully');
        router.back();
      },
      onError: (error: any) => {
        console.error(error);
        toast.error(t('Error updating transaction type'));
      },
    }
  );

  const onSubmit = (values: TransTypeInput) => {
    const payload = {
      tranName: values?.tranName,
      chargeType: values?.chargeType?.id,
      maxLimit: Number(values?.maxLimit),
      minLimit: Number(values?.minLimit),
      dailyLimit: Number(values?.dailyLimit),
      capLimit: Number(values?.capLimit),
      networkCommission: Number(values?.networkCommission),
      platformCommission: Number(values?.platformCommission),
      aggregatorCommission: Number(values?.aggregatorCommission),
      agentCommission: Number(values?.agentCommission),
      serviceFee: Number(values.serviceFee),
      charge: Number(values.charge),
      dailyFreq: Number(values?.dailyFreq),
    };
    updateTransactionType(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="mb-5">
            <Label>{t('form:input-label-merchant-category')}</Label>
            <SelectInput
              name="merchCategory"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={merchantCategoryOptions}
              disabled
            />
          </div>

          <div className="mb-5">
            <Label>{t('form:input-label-transaction-type')}</Label>
            <SelectInput
              name="tranType"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={transactionTypeOptions}
              disabled
            />
          </div>

          <Input
            label={t('form:input-label-name')}
            {...register('tranName')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-minimum-limit')}
            {...register('minLimit')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-maximum-limit')}
            {...register('maxLimit')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-daily-limit')}
            {...register('dailyLimit')}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t('form:input-label-charge-type')}</Label>
            <SelectInput
              name="chargeType"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={chargeType}
            />
          </div>

          <Input
            label={t('form:input-label-charge-fee')}
            {...register('charge')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-cap-limit')}
            {...register('capLimit')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-daily-frequency')}
            {...register('dailyFreq')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-agent-commission')}
            {...register('agentCommission')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-platform-commission')}
            {...register('platformCommission')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-network-commission')}
            {...register('networkCommission')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-aggregator-commission')}
            {...register('aggregatorCommission')}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('form:input-label-service-fee')}
            {...register('serviceFee')}
            variant="outline"
            className="mb-5"
          />
        </div>

        <div className="mt-6 text-end">
          <Button type="submit" loading={isLoading}>
            {t('form:button-label-submit')}
          </Button>
        </div>
      </Card>
    </form>
  );
}
