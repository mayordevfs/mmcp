import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useTranslation } from 'next-i18next';
import Button from '@/components/ui/button';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/fetch-function';
import { useProductCategoryQuery } from '@/data/pos/category';
import useUser from '@/stores/userStore';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import { useFileUpload } from '../sharedHooks/useFileupload';
import { useProductMutation } from '../sharedHooks/useProductMutation';
import { ProductFormValues } from '@/types';
import { defaultProductValues } from '@/lib/reusableVars';
import { buildProductPayload } from '@/data/pos/buildProductPayload';
import { ProductFormFields } from '../sharedComponents/ProductFormFields';
import { ProductImageUpload } from '../sharedComponents/ProductImageUpload';

// Shared imports

interface EditProductFormProps {
  id: string | string[] | undefined;
}

export default function EditProductForm({ id }: EditProductFormProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  const [originalProduct, setOriginalProduct] = useState<any>(null);
  
  // Shared hooks
  const fileUpload = useFileUpload();
  const { mutate: updateProduct, isLoading } = useProductMutation(true);
  
  // Categories
  const { data: category, isLoading: categoriesLoading } = useProductCategoryQuery(1);
  const categories = category?.map((item) => ({
    label: item.name,
    value: item.code,
  })) || [];

  // Get product data
  const { data, isLoading: productLoading, isError } = useQuery(
    ['product', id],
    () => axiosInstance.request({
      url: `products/getById`,
      method: 'GET',
      params: { id }
    }),
    {
      enabled: !!id,
      retry: 1,
      onError: (error) => {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product data');
      }
    }
  );

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: defaultProductValues,
  });

  // Populate form when data is loaded
  useEffect(() => {
    const product = data?.data?.productDto;
    
    if (product && categories.length > 0) {
      setOriginalProduct(product);
      
      // Reset file upload state
      if (product.picture) {
        fileUpload.setInitialImage(product.picture);
      }
      
      // Populate form fields
      setValue('productName', product.name || '');
      setValue('productPrice', product.salePrice?.toString() || '');
      setValue('costPrice', product.costPrice?.toString() || '');
      setValue('productCategory', product.category || categories[0]?.value || '');
      setValue('stockQuantity', product.qtyInStore || 0);
      setValue('productDescription', product.description || '');
      setValue('barCode', product.barCode || '');
      setValue('unitQuantity', product.unitQuantity || '1');
      setValue('brand', product.brand || '');
    }
  }, [data, setValue, categories, fileUpload]);

  const onSubmit = async (values: ProductFormValues) => {
    if (fileUpload.isUploadingFile) {
      toast.error('Please wait for file upload to complete');
      return;
    }

    const payload = buildProductPayload(
      values, 
      fileUpload.fileUrl, 
      user, 
      originalProduct, 
      fileUpload.hasNewImage
    );
    
    updateProduct(payload);
  };

  // Loading states
  if (productLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Error states
  if (isError) {
    return <ErrorMessage message='Failed to load product data' />;
  }

  if (!data?.data?.productDto) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">Product not found</div>
      </div>
    );
  }

  const product = data.data.productDto;

  return (
    <div>
      {/* Product Info Header */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Editing Product</h3>
        <div className="flex items-center space-x-4">
          {product.picture && (
            <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
              <img
                src={product.picture}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>
        </div>
      </div>

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
          onFileChange={(e) => fileUpload.handleFileChange(e, originalProduct?.picture)}
          isEdit={true}
          isRequired={false}
        />

        <div className="mb-4 text-end">
          <Button 
            type="submit" 
            loading={isLoading || fileUpload.isUploadingFile}
            disabled={fileUpload.isUploadingFile}
          >
            {fileUpload.isUploadingFile ? 'Uploading...' : t('Update Product')}
          </Button>
        </div>
      </form>
    </div>
  );
}