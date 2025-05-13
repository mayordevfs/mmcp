import { useForm } from 'react-hook-form';
import { useModalAction, useModalState } from '@/components/ui/modal/modal.context';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal/modal';
import { useTranslation } from 'next-i18next';
import AddCollectionForm from '@/components/product/collection-form';

type FormValues = {
  // Define your form values type here based on your collection form
  name: string;
  description?: string;
  // Add other fields as needed
};

interface AddCollectionModalProps {
  open?: boolean;
  onClose?: () => void;
  data?: any;
}

const AddCollectionModal = ({ open, onClose, data: propData }: AddCollectionModalProps) => {
  const { t } = useTranslation();

  // Use context data if available, otherwise use props
  const contextData = useModalState();
  const contextClose = useModalAction().closeModal;
  
  const data = propData || contextData;
  const closeModal = onClose || contextClose;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: data?.name || '',
      description: data?.description || '',
      // Set other default values as needed
    },
  });

  function onSubmit(values: FormValues) {
    console.log('Collection form submitted:', values);
    // Handle form submission here
    closeModal();
  }

  const content = (
    <div className="m-auto w-[800px] rounded bg-light p-7">
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:title-add-collection')}
        </h1>
      </div>
      
      <AddCollectionForm 
        // onSubmit={handleSubmit(onSubmit)}
        // control={control}
        // errors={errors}
      />
      
      <div className="flex justify-end pt-4">
        <Button type="submit" form="collection-form">
          {t('form:button-label-submit')}
        </Button>
      </div>
    </div>
  );

  // If open prop is provided, use it as controlled modal
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