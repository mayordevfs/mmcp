import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
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

const defaultValues = { 
  transName: "",
  tranType:{
    id:'',
    name:''
  },
  merchCategory:{
    id:'',
    name:''
  },
  dailyFreq:0,
  maxLimit: 0,
  dailyLimit:0,
  agentCommission: 0,
  platformCommission: 0,
  networkCommission: 0,
  aggregatorCommission: 0,
  serviceFee: 0,
  charge: 0,
  chargeType: {
    id:'',
    name:''
  },
  minLimit:0,
  capLimit: 0.0,
}

const chargeType = [
  {id:"fixed", name:"FIXED"},
  {id:"percentage",name:"PERCENTAGE"}
]

export default function CreateTransactionTypeForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const merchantCategoryOptions = useGetLookup("MERCHANT_GROUP");
  const transactionTypeOptions = useGetLookup("TRAN_CODE");
  const setUpRefNo = random20DigitNumber();
  

  console.log(merchantCategoryOptions)
  console.log(transactionTypeOptions);
  
  const { register, handleSubmit, control } = useForm<TransTypeInput>({
    shouldUnregister: true,
    defaultValues: defaultValues,
  });

  const { mutate: saveTransactionType, isLoading: isTranTypeLoading } = useMutation(
    (formData: any) =>
      axiosInstance.request({
        method: 'POST',
        url: 'transTypeSetup/create',
        data: formData,
      }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc);
          return;
        }
        toast.success('Transaction type created successfully');
        router.back();
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
          } else if (error.response.status === 422) {
            toast.error(t('Error creating transaction type'));
          } else if (error.response.status === 500) {
            toast.error(t('Error creating transaction type'));
          }
        } else {
          toast.error(t('Error creating transaction type'));
        }
      },
    }
  );

  const onSubmit = async (values: TransTypeInput) => {
    // Directly use the values from the form instead of setting state
    const tranCode = values?.tranType?.id;
    const branchCode = values?.merchCategory?.id;
    
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
      // Add these fields directly to the payload
      id: 0,
      entityCode: "ETZ",
      customerType: "MERCHANT",
      tranCode: tranCode,
      status: "ACTIVE",
      bankCommission: 0,
      groupCommission: 0,
      otherCharge: 0,
      tranChannel: "MOBILE",
      roleAllowed: "",
      sharingType: "",
      branchCode: branchCode,
      tax: 0,
      setUpRefNo: `REF${setUpRefNo}`,
      FeeTiers: [{}]
    };
    
    saveTransactionType(payload);
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
            label={t('form:input-label-network-commission')}
            {...register('networkCommission')}
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
            label={t('form:input-label-merchant-commission')}
            {...register('agentCommission')}
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

        <div className="mb-4 text-end">
          <Button loading={isTranTypeLoading} disabled={isTranTypeLoading}>
            {t('form:button-label-submit')}
          </Button>
        </div>
      </Card>
    </form>
  );
}