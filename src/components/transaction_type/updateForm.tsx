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


export default function UpdateTransactionTypeForm({id}:{id:string|string[]|undefined}) {
  const router = useRouter();
  const { t } = useTranslation();
  const merchantCategoryOptions = useGetLookup("MERCHANT_GROUP")
  const transactionTypeOptions = useGetLookup("TRAN_CODE")
  const setUpRefNo = random20DigitNumber()
  const { register, handleSubmit, control,getValues} = useForm<TransTypeInput>({
    shouldUnregister: true,
    defaultValues: defaultValues,
  });


  console.log(getValues().merchCategory);
  

  
  
  const { mutate: saveTransactionType, isLoading: isTranTypeLoading } = useMutation(
    (formData: any) =>
      axiosInstance.request({
        method: 'POST',
        url: 'transTypeSetup/create',
        data: {
          ...formData,
          id:0,
          entityCode:"ETZ",
          customerType:"MERCHANT",
          tranCode:getValues()?.tranType?.id,
          status:"ACTIVE",
          bankCommission:0,
          groupCommission:0,
          otherCharge:0,
          tranChannel:"MOBILE",
          roleAllowed:"",
          sharingType:"",
          branchCode:getValues()?.merchCategory.id,
          tax:0,
          setUpRefNo,
          FeeTiers:[
            {}
          ]
        },
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
            toast.error('Bad request');
          } else if (error.response.status === 422) {
            toast.error(t('Error creating transaction type'));
          } else if (error.response.status === 500) {
            toast.error(t('Error creating transaction type'));
          }
        } else {
          toast.error(t('Erro creating transaction type'));
        }
      },
    }
  );

  const onSubmit = async (values: TransTypeInput) => {
    const payload = {
      tranName:values?.tranName,
      chargeType:values?.chargeType?.id,
      maxLimit:Number(values?.maxLimit),
      minLimit:Number(values?.minLimit),
      dailyLimit:Number(values?.dailyLimit),
      capLimit:Number(values?.capLimit),
      networkCommission:Number(values?.networkCommission),
      platformCommission:Number(values?.platformCommission),
      aggregatorCommission:Number(values?.aggregatorCommission),
      agentCommission:Number(values?.agentCommission),
      serviceFee:Number(values.serviceFee),
      charge:Number(values.charge),
      dailyFreq:Number(values?.dailyFreq)
    };
    saveTransactionType(payload);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          details={t('form:merchant-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        /> */}
      <Card className="w-full">
        {/* Personal Information */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* <div className="mt-2 pt-5 md:col-span-2">
            <h3 className="mb-5 text-lg font-semibold">
              {t('Transaction Type')}
            </h3>
          </div> */}

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


        {/* <div className="mb-5">
          <Label>{t('form:input-label-business-logo')}</Label>
          <FileInput
            name="merchant.businessLogo"
            control={control}
            multiple={false}
          />
        </div> */}
        <div className="mb-4 text-end">
          {/* {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="me-4"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )} */}

          <Button loading={isTranTypeLoading} disabled={isTranTypeLoading}>
            {t('form:button-label-submit')}
          </Button>
        </div>
      </Card>
      {/* </div> */}
    </form>
  );
}
