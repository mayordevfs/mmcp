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
  merchantId: any; 
  terminalSerialNo: string;
  locationName: string;
  businessName: string;
  sourceCode: string;
  virtualAccountNo: string;
  status: any;
  tellers: any;
  branchCode: any;
};

interface LinkTerminalModalProps {
  open?: boolean;
  onClose?: () => void;
  data?: any;
}

const LinkTerminalModal = ({ open, onClose, data: propData }: LinkTerminalModalProps) => {
  const { t } = useTranslation();
  const statusOptions = useGetLookup('STATUS');
  const branchCodeOptions = useGetLookup('BRANCH_CODE');
  const tellerOptions = useGetLookup('TELLER');

  const contextData = useModalState();
  const contextClose = useModalAction().closeModal;
  
  const data = propData || contextData;
  const closeModal = onClose || contextClose;

  const { data: merchantsData, isLoading: isMerchantsLoading } = useQuery(
    'merchants',
    () => 
      axiosInstance.request({
        method: 'GET',
        url: '/merchant/all',
        params: {
          pageNumber: 1,
          pageSize: 100,
          name: '',
          role: '',
          mobileNo: '',
        },
      }),
    {
      select: (res) => res.data?.content?.map((merchant: any) => ({
        id: merchant.merchantId,
        name: merchant.name || merchant.merchantId,
      })) || []
    }
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      terminalId: data?.terminalId || '',
      merchantId: data?.merchantId || null,
      terminalSerialNo: data?.terminalSerialNo || '',
      locationName: data?.locationName || '',
      businessName: data?.businessName || '',
      sourceCode: data?.sourceCode || '', 
      virtualAccountNo: data?.virtualAccountNo || '',
      status: data?.status || { id: 'active', name: 'Active' },
      tellers: data?.tellers || null,
      branchCode: data?.branchCode || null,
    },
  });

  const { mutate: linkTerminal, isLoading: isLinking } = useMutation(
    (formData: FormValues) => {
      const payload = {
        terminalId: formData.terminalId,
        merchantCode: formData.merchantId?.id || formData.merchantId,
        serialNo: formData.terminalSerialNo,
        sourceCode: "MMCP",
        locationAddress: formData.locationName,
        businessName: formData.businessName, 
        // sourceCode: formData.sourceCode, 
        // virtualAccountNo: formData.virtualAccountNo,
        status: formData.status?.id || formData.status, 
        tellerId: formData.tellers?.id || formData.tellers, 
        branchCode: formData.branchCode?.id || formData.branchCode,
        requestReference: new Date().getTime(),
      };
      return axiosInstance.request({
        method: 'POST',
        url: 'merchant/link',
        data: payload,
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
    linkTerminal(values);
  }

  const content = (
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
          </div>
          
          <Input
            label={t('form:input-label-terminal-serial-no')}
            {...register('terminalSerialNo', {
              required: `${t('form:error-terminal-serial-no-required')}`,
            })}
            variant="outline"
            error={t(errors.terminalSerialNo?.message!)}
          />
          
          <Input
            label={t('form:input-label-location-name')}
            {...register('locationName', {
              required: `${t('form:error-location-name-required')}`,
            })}
            variant="outline"
            error={t(errors.locationName?.message!)}
          />

          <Input
            label={t('form:input-label-business-name')}
            {...register('businessName', {
              required: `${t('form:error-business-name-required')}`
            })}
            variant="outline"
            error={t(errors.businessName?.message!)}
          />

          {/* <Input
            label={t('form:input-label-source-code')}
            {...register('sourceCode', {
              required: `${t('form:error-source-code-required')}`,
            })}
            variant="outline"
            error={t(errors.sourceCode?.message!)}
          /> */}
        </div>

        <div className='grid gap-5 grid-cols-1 md:grid-cols-2'>
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
          
          <div>
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
          </div>
          
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
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" loading={isLinking}>
            {t('form:button-label-link-terminal')}
          </Button>
        </div>
      </form>
    </div>
  );

  if (typeof open !== 'undefined') {
    return (
      <Modal open={open} onClose={closeModal}>
        {content}
      </Modal>
    );
  }

  return content;
};

export default LinkTerminalModal;