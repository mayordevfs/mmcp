import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Label from '@/components/ui/label';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import TextArea from '@/components/ui/text-area';
import { FormEvent, useState, useRef, useEffect } from 'react';
import { useMutation } from 'react-query';
import axiosInstance from '@/utils/fetch-function';
import { toast } from 'react-toastify';

const defaultValues = {
  productName: '',
  productType: '',
  productPrice: '',
  costPrice:'',
  productCategory:'',
  stockQuantity:0,
  productDescription:''
};

type ProductFormValues = {
  productName: string,
  productType: string,
  productPrice: string,
  costPrice:string,
  productCategory:string,
  stockQuantity:number,
  productDescription:string
};

export default function EditProductForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [originalProduct, setOriginalProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: defaultValues,
  });

  // Load product data from session storage
  useEffect(() => {
    const storedProduct = sessionStorage.getItem('editingProduct');
    
    if (storedProduct) {
      try {
        const parsedProduct = JSON.parse(storedProduct);
        setOriginalProduct(parsedProduct);
        
        // Map the product data to form fields
        setValue('productName', parsedProduct.name || '');
        setValue('productPrice', parsedProduct.salePrice?.toString() || '');
        setValue('costPrice', parsedProduct.costPrice?.toString() || '');
        setValue('productCategory', parsedProduct.category || '');
        setValue('stockQuantity', parsedProduct.stockQuantity || 0);
        setValue('productDescription', parsedProduct.description || '');
        
        // Set existing image as preview
        if (parsedProduct.picture) {
          setPreviewUrl(parsedProduct.picture);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored product:', error);
        toast.error('Error loading product data');
        router.push('/products');
      }
    } else {
      // No product data found, redirect back to products
      toast.error('No product data found');
      router.push('/products');
    }

    // Clean up session storage after use
    return () => {
      sessionStorage.removeItem('editingProduct');
    };
  }, [router, setValue]);
  
  const {mutate:updateProduct,isLoading} = useMutation(
    (data:any)=>axiosInstance.request({
        method:"PUT", // Changed to PUT for update
        url:"stock-management/save-update",
        data:data,
    }),
    {
        onSuccess: (data) => {
                toast.success('Product updated successfully');
                router.push('/products'); // Navigate back to products page
              },
        onError: (error: any) => {
    console.log(error);

    if (error?.response?.data) {
      if (error.response.status === 400) {
        toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
      } else if (error.response.status === 422) {
        toast.error("Error updating product");
      } else if (error.response.status === 500) {
        toast.error("Error updating product");
      }
    } else {
      toast.error("Error updating product");
    }
  },
    },
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError('');
    
    if (!file) {
      setSelectedFile(null);
      // Keep the original image preview if no new file selected
      if (originalProduct?.picture) {
        setPreviewUrl(originalProduct.picture);
      } else {
        setPreviewUrl(null);
      }
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only JPG, PNG, and WebP files are allowed');
      setSelectedFile(null);
      if (originalProduct?.picture) {
        setPreviewUrl(originalProduct.picture);
      } else {
        setPreviewUrl(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileError('File size must be less than 5MB');
      setSelectedFile(null);
      if (originalProduct?.picture) {
        setPreviewUrl(originalProduct.picture);
      } else {
        setPreviewUrl(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
    
    // Create preview for new file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: ProductFormValues) => {
    console.log("Updating product");
    console.log('Form values:', values);
    console.log('Selected file:', selectedFile);
    console.log('Original product:', originalProduct);
    
    const payload = {
        productId: originalProduct?.id || "", // Include the product ID for update
        productName: values?.productName,
        productPrice: values?.productPrice,
        costPrice: values?.costPrice,
        productCategory: values?.productCategory,
        stockQuantity: values?.stockQuantity,
        productDescription: values?.productDescription,
        imageUrl: selectedFile ? selectedFile.name : originalProduct?.picture || '',
        productCode: originalProduct?.productCode || "",
        unitQuantity: originalProduct?.unitQuantity || '',
        base64Image: '',
        storeId: '2001',
        barCode: originalProduct?.barCode || '',
        brand: originalProduct?.brand || '',
        ccy: "NGN"
    }

    updateProduct(payload);
  };

  // Show loading while retrieving product data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading product data...</div>
      </div>
    );
  }

  // Show error if no product data
  if (!originalProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">Product data not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Product Info Header */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Editing Product</h3>
        <div className="flex items-center space-x-4">
          {originalProduct.picture && (
            <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
              <img
                src={originalProduct.picture}
                alt={originalProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800">{originalProduct.name}</p>
            <p className="text-sm text-gray-600">{originalProduct.category}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:product-description')}
            details={t('form:product-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Product Name */}
              <Input
                label={t('form:input-label-product-name')}
                {...register('productName', { required: 'This field is required' })}
                variant="outline"
                error={t(errors.productName?.message!)}
              />

              {/* Product Price */}
              <Input
                label={t('Product Price')}
                {...register('productPrice', { required: 'Product price is required' })}
                variant="outline"
                error={t(errors.productPrice?.message!)}
              />
              
              <Input
                label={t('Cost Price')}
                {...register('costPrice')}
                variant="outline"
              />
              
              <Input
                label={t('Product Category')}
                {...register('productCategory')}
                variant="outline"
                placeholder={t('e.g. Electronics, Clothing,Food e.t.c')}
                type="text"
              />            
              
              <Input
                label={t('Stock Quantity')}
                {...register('stockQuantity')}
                variant="outline"
                type="number"
              />
            </div>
          </Card>
        </div>

        <div className="my-5 flex flex-wrap sm:my-8">
           <Description
            title={t('form:product-description')}
            details={t('form:product-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
              <TextArea
                  label={t('Product Description')}
                  {...register('productDescription', { required: 'This field is required' })}
                  variant="outline"
                  error={t(errors.productDescription?.message!)}
              />
          </Card>
        </div>

        {/* Custom File Upload Section */}
        <div className="my-5 flex flex-wrap sm:my-8">
           <Description
            title={t('Update Product Image')}
            details={t('Upload a new image to replace the current one (JPG, PNG, WebP - Max 5MB)')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="space-y-4">
              <Label>{t('Product Image')}</Label>
              
              {/* File Input */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              
              {/* Error Message */}
              {fileError && (
                <p className="text-sm text-red-600 mt-1">{fileError}</p>
              )}
              
              {/* File Info */}
              {selectedFile && !fileError && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p><strong>New Image:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              )}
              
              {/* Image Preview */}
              {previewUrl && !fileError && (
                <div className="mt-4">
                  <Label>{selectedFile ? 'New Image Preview:' : 'Current Image:'}</Label>
                  <div className="mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img 
                      src={previewUrl} 
                      alt="Product preview" 
                      className="max-w-full max-h-64 object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="mb-4 text-end">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>

          <Button type="submit" loading={isLoading}>
            {t('Update Product')}
          </Button>
        </div>
      </form>
    </div>
  );
}