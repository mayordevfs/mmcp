import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import Input from '@/components/ui/input';
import SelectInput from '@/components/ui/select-input';
import Modal from '@/components/ui/modal/modal';
import { useTranslation } from 'next-i18next';
import { useQuery, useMutation } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import useGetLookup from '@/hooks/useGetLookup';
import { toast } from 'react-toastify';

type FormValues = {
  terminalId: string;
  terminalSerialNo: string;
  locationName: string;
  status: any;
  // tellers: any;
  branchCode: any;
};


const LinkTerminalToMerchant = () => {
  const { t } = useTranslation();
  const statusOptions = useGetLookup('STATUS');
  const branchCodeOptions = useGetLookup('BRANCH_CODE');
  const tellerOptions = useGetLookup('TELLER');
  const {data} = useModalState()
  const {closeModal} = useModalAction()
  console.log(data);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      terminalId: "",
      terminalSerialNo:'',
      locationName:'',
      status:{ id: 'active', name: 'Active' },
      // tellers:null,
      branchCode:null,
    },
  });

  const { mutate: linkTerminal, isLoading: isLinking } = useMutation(
    (data) => {
      return axiosInstance.request({
        method: 'POST',
        url: 'merchant/link',
        data,
      });
    },
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc || t('common:error-linking-terminal'));
          return;
        }
        toast.success(t('common:terminal-linked-successfully'));
        closeModal();
      },
      onError: (error: any) => {
        console.error(error);
        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error(t('common:bad-request'));
          } else if (error.response.status === 422) {
            toast.error(t('common:validation-error'));
          } else {
            toast.error(t('common:error-linking-terminal'));
          }
        } else {
          toast.error(t('common:error-linking-terminal'));
        }
      },
    }
  );

  function onSubmit(values: FormValues) {
    const payload = {
        terminalId: values.terminalId,
        merchantCode: data?.merchant?.merchantId,
        serialNo: values.terminalSerialNo,
        sourceCode: "MMCP",
        locationAddress: values.locationName,
        businessName: data?.merchant?.businessName, 
        // sourceCode: formData.sourceCode, 
        // virtualAccountNo: formData.virtualAccountNo,
        status: values.status?.id || values.status, 
        tellerId: data?.merchant?.username, 
        branchCode: values.branchCode?.id || values.branchCode,
        requestReference: new Date().getTime(),
      };
    linkTerminal(payload as any);
  }

  return (
    <div className="m-auto w-[800px] rounded bg-light p-7 ">
      <div className="flex border-b border-dashed border-border-base py-2 sm:py-4">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:title-link-terminal')}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className='grid gap-5 grid-cols-1 md:grid-cols-2 mt-8'>
          <Input
            label={t('form:input-label-terminal-id')}
            {...register('terminalId', {
              required: `${t('form:error-terminal-id-required')}`,
            })}
            variant="outline"
            error={t(errors.terminalId?.message!)}
          />
{/* 
          <div>
            <label className="mb-2 block text-sm font-semibold text-body">
              {t('form:input-label-merchant-id')}
            </label>
            <SelectInput
              name="merchantId"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={merchantsData || []}
              isLoading={isMerchantsLoading}
              rules={{ required: `${t('form:error-merchant-id-required')}` }}
            />
            {errors.merchantId && (
              <p className="mt-1 text-xs text-red-500">
                {t(errors.merchantId.message!)}
              </p>
            )}
          </div> */}
          
          <Input
            label={t('form:input-label-terminal-serial-no')}
            {...register('terminalSerialNo')}
            variant="outline"
            error={t(errors.terminalSerialNo?.message!)}
          />
          
          

          {/* <Input
            label={t('form:input-label-business-name')}
            {...register('businessName', {
              required: `${t('form:error-business-name-required')}`
            })}
            variant="outline"
            error={t(errors.businessName?.message!)}
          /> */}

          {/* <Input
            label={t('form:input-label-source-code')}
            {...register('sourceCode', {
              required: `${t('form:error-source-code-required')}`,
            })}
            variant="outline"
            error={t(errors.sourceCode?.message!)}
          /> */}
        </div>

        <div className='grid gap-5 grid-cols-1 md:grid-cols-2 items-center'>
          <div>
            <label className="mb-2 block text-sm font-semibold text-body">
              {t('form:input-label-status')}
            </label>
            <SelectInput
              name="status"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={statusOptions}
            />
          </div>
          
          {/* <div>
            <label className="mb-2 block text-sm font-semibold text-body">
              {t('form:input-label-tellers')}
            </label>
            <SelectInput
              name="tellers"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={tellerOptions}
              rules={{ required: `${t('form:error-tellers-required')}` }}
            />
          </div> */}
          
          <div>
            <label className="mb-2 block text-sm font-semibold text-body">
              {t('form:input-label-branch-code')}
            </label>
            <SelectInput
              name="branchCode"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={branchCodeOptions}
              rules={{ required: `${t('form:error-branch-code-required')}` }}
            />
            {errors.branchCode && (
              <p className="mt-1 text-xs text-red-500">
                {t(errors.branchCode.message!)}
              </p>
            )}
          </div>
          <Input
            label={t('form:input-label-location-name')}
            {...register('locationName', {
              required: `${t('form:error-location-name-required')}`,
            })}
            variant="outline"
            error={t(errors.locationName?.message!)}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" loading={isLinking}>
            {t('form:button-label-link-terminal')}
          </Button>
        </div>
      </form>
    </div>
  );

 
};

export default LinkTerminalToMerchant;