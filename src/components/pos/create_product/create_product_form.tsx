import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Button from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useProductCategoryQuery } from '@/data/pos/category';
import useUser from '@/stores/userStore';
import { ProductFormValues } from '@/types';
import { useFileUpload } from '../sharedHooks/useFileupload';
import { useProductMutation } from '../sharedHooks/useProductMutation';
import { defaultProductValues } from '@/lib/reusableVars';
import { buildProductPayload } from '@/data/pos/buildProductPayload';
import { ProductFormFields } from '../sharedComponents/ProductFormFields';
import { ProductImageUpload } from '../sharedComponents/ProductImageUpload';

// Shared imports


interface CreateProductFormProps {
  initialValues?: ProductFormValues | null;
}

export default function CreateProductForm({ initialValues }: CreateProductFormProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  
  // Shared hooks
  const fileUpload = useFileUpload();
  const { mutate: createProduct, isLoading } = useProductMutation(false);
  
  // Categories
  const { data: category } = useProductCategoryQuery(1);
  const categories = category?.map((item) => ({
    label: item.name,
    value: item.code,
  })) || [];

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: initialValues ?? defaultProductValues,
  });

  const onSubmit = async (values: ProductFormValues) => {
    // Check if file is required but not selected
    if (!fileUpload.selectedFile) {
      fileUpload.resetFileInput();
      toast.error('Product image is required');
      return;
    }
    
    if (fileUpload.isUploadingFile) {
      toast.error('Please wait for file upload to complete');
      return;
    }

    const payload = buildProductPayload(values, fileUpload.fileUrl, user);
    createProduct(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProductFormFields
        register={register}
        control={control}
        errors={errors}
        categories={categories as any}
      />

      <ProductImageUpload
        fileInputRef={fileUpload.fileInputRef}
        selectedFile={fileUpload.selectedFile}
        previewUrl={fileUpload.previewUrl}
        fileError={fileUpload.fileError}
        isUploadingFile={fileUpload.isUploadingFile}
        hasNewImage={fileUpload.hasNewImage}
        onFileChange={(e) => fileUpload.handleFileChange(e)}
        isEdit={false}
        isRequired={true}
      />

      <div className="mb-4 text-end">
        <Button 
          type="submit" 
          loading={isLoading || fileUpload.isUploadingFile}
          disabled={fileUpload.isUploadingFile}
        >
          {fileUpload.isUploadingFile ? 'Uploading...' : t('form:button-label-save-product')}
        </Button>
      </div>
    </form>
  );
}
