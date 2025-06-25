import { useForm } from 'react-hook-form';
import { useModalAction, useModalState } from '@/components/ui/modal/modal.context';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal/modal';
import { useTranslation } from 'next-i18next';
import Input from '@/components/ui/input';
import SelectInput from '@/components/ui/select-input';
import TextArea from '@/components/ui/text-area';
import Label from '@/components/ui/label';

type CollectionField = {
  fieldCode: string;
  fieldName: string;
  dataType: string;
  fieldLength: string;
  mandatory: boolean;
  inputType: boolean;
  lookupData: string;
};

interface AddCollectionModalProps {
  open?: boolean;
  onClose?: () => void;
  initialValues?: CollectionField | null;
}

const defaultValues = {
  fieldCode: '',
  fieldName: '',
  dataType: 'TEXT',
  fieldLength: '',
  mandatory: false,
  inputType: false,
  lookupData: '',
};

const dataTypeOptions = [
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'DATE', label: 'Date' },
];

const yesNoOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

const AddCollectionModal = ({ open, onClose, initialValues: propInitialValues }: AddCollectionModalProps) => {
  const { t } = useTranslation();

  const contextData = useModalState();
  const contextClose = useModalAction().closeModal;
  
  const initialValues = propInitialValues || contextData || defaultValues;
  const closeModal = onClose || contextClose;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CollectionField>({
    defaultValues,
  });

  const onSubmit = async (values: CollectionField) => {
    console.log('Collection field submitted:', values);
    closeModal();
  };

  const content = (
    <div className="m-auto w-[800px] rounded bg-light p-7">
      <div className="flex border-b border-dashed border-border-base py-2 sm:py-4">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:collection-field-description')}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-8">
          {/* Field Code */}
          <Input
            label={t('form:input-label-field-code')}
            {...register('fieldCode', { required: 'Field code is required' })}
            variant="outline"
            error={t(errors.fieldCode?.message!)}
          />

          {/* Field Name */}
          <Input
            label={t('form:input-label-field-name')}
            {...register('fieldName', { required: 'Field name is required' })}
            variant="outline"
            error={t(errors.fieldName?.message!)}
          />

          {/* Data Type */}
          <div>
            <Label>{t('form:input-label-data-type')}</Label>
            <SelectInput
              name="dataType"
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              options={dataTypeOptions}
              rules={{ required: 'Data type is required' }}
            />
            {errors.dataType && (
              <p className="mt-1 text-xs text-red-500">
                {t(errors.dataType.message!)}
              </p>
            )}
          </div>

          {/* Field Length */}
          <Input
            label={t('form:input-label-field-length')}
            {...register('fieldLength')}
            variant="outline"
            type="number"
          />

          {/* Mandatory */}
          <div>
            <Label>{t('form:input-label-mandatory')}</Label>
            <SelectInput
              name="mandatory"
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              options={yesNoOptions}
            />
          </div>

          {/* Input Type */}
          <div>
            <Label>{t('form:input-label-input-type')}</Label>
            <SelectInput
              name="inputType"
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              options={yesNoOptions}
            />
          </div>

          {/* Lookup Data - Full width */}
          <div className="md:col-span-2">
            <Label>{t('form:input-label-lookup-data')}</Label>
            <TextArea
              {...register('lookupData')}
              placeholder={t('form:input-placeholder-lookup-data')}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={closeModal}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>

          <Button type="submit">
            {t('form:button-label-save')}
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

export default AddCollectionModal;