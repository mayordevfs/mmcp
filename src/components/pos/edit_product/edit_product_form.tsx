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
import { useProductCategoryQuery } from '@/data/pos/category';
import { uploadClient } from '@/data/client/upload';
import useUser from '@/stores/userStore';


const defaultValues = {
  productName: '',
  productPrice: '',
  costPrice:'',
  productCategory:'',
  stockQuantity:0,
  productDescription:'',
  barCode:'',
  unitQuantity:'1',
  brand:""
};

type ProductFormValues = {
  productName: string,
  productPrice: string,
  costPrice:string,
  productCategory:string,
  stockQuantity:number,
  productDescription:string,
  barCode:string,
  unitQuantity:string,
  brand:string
};

export default function EditProductForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const {user} = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [originalProduct, setOriginalProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState('')
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [hasNewImage, setHasNewImage] = useState(false); // Track if user selected a new image
  
  const fileArray = Array.from(selectedFile as FileList||[])
  const {data:category} = useProductCategoryQuery(1)
    const categories = category?.map((item) => ({
      label: item.name,
      value: item.code,
    })) || [];
  
    useEffect(() => {
        if (!selectedFile?.length) {
            return;
        }
        
        setIsUploadingFile(true);
        setHasNewImage(true); // Mark that user has selected a new image
        
        uploadClient.upload(fileArray)
        .then((res:any) => {
          console.log('Upload response:', res);
          const filename = res?.data?.refNo.split('/').pop()
          console.log(`New file URL: /${filename}`);
          
          setFileUrl(`/${filename}`)
          toast.success("File uploaded successfully!")
        })
        .catch((err) => {
          console.log('Upload error:', err);
          toast.error("File upload failed!")
          setFileUrl('');
          setHasNewImage(false); // Reset on error
        })
        .finally(() => {
          setIsUploadingFile(false);
        })
    }, [selectedFile])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
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
        
        // RESET ALL STATE when loading a new product
        setOriginalProduct(parsedProduct);
        setSelectedFile(null);
        setFileUrl(''); // Reset file URL
        setHasNewImage(false); // Reset new image flag
        setFileError('');
        setIsUploadingFile(false);
        
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Map the product data to form fields
        setValue('productName', parsedProduct.name || '');
        setValue('productPrice', parsedProduct.salePrice?.toString() || '');
        setValue('costPrice', parsedProduct.costPrice?.toString() || '');
        setValue('productCategory', parsedProduct.category || categories[0]?.label || '');
        setValue('stockQuantity', parsedProduct.qtyInStore || 0);
        setValue('productDescription', parsedProduct.description || '');
        setValue('barCode', parsedProduct.barCode || '');
        setValue('unitQuantity', parsedProduct.unitQuantity || '1');
        setValue('brand', parsedProduct.brand || '');
        
        // Set existing image as preview
        if (parsedProduct.picture) {
          setPreviewUrl(parsedProduct.picture);
        } else {
          setPreviewUrl(null);
        }
        
        setLoading(false);
        
        console.log('Loaded product for editing:', parsedProduct);
        console.log('Reset fileUrl to empty, hasNewImage to false');
        
      } catch (error) {
        console.error('Error parsing stored product:', error);
        toast.error('Error loading product data');
      }
    } else {
      toast.error('No product data found');
    }

    // Clean up session storage after use
    return () => {
      sessionStorage.removeItem('editingProduct');
    };
  }, [router, setValue]);
  
  const {mutate:updateProduct,isLoading} = useMutation(
    (data:any)=>axiosInstance.request({
        method:"POST",
        url:"stock-management/save-update",
        data:data,
    }),
    {
        onSuccess: (data) => {
                toast.success('Product updated successfully');
                router.push('/pos'); // Navigate back to products page
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
    const file = event.target.files;
    setFileError('');
    
    if (!file || file.length === 0) {
      // User cleared the file input
      setSelectedFile(null);
      setFileUrl('');
      setHasNewImage(false);
      
      // Restore original image preview
      if (originalProduct?.picture) {
        setPreviewUrl(originalProduct.picture);
      } else {
        setPreviewUrl(null);
      }
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file[0].type)) {
      setFileError('Only JPG, PNG, and WebP files are allowed');
      setSelectedFile(null);
      setFileUrl('');
      setHasNewImage(false);
      
      // Restore original image preview
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
    if (file[0].size > maxSize) {
      setFileError('File size must be less than 5MB');
      setSelectedFile(null);
      setFileUrl('');
      setHasNewImage(false);
      
      // Restore original image preview
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

    // File is valid, set it for upload
    setSelectedFile(file);
    
    // Create preview for new file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file[0]);
  };

  const onSubmit = async (values: ProductFormValues|any) => {
    // Prevent submission if file is still uploading
    if (isUploadingFile) {
      toast.error('Please wait for file upload to complete');
      return;
    }

    console.log("=== SUBMITTING PRODUCT UPDATE ===");
    console.log('Form values:', values);
    console.log('HasNewImage:', hasNewImage);
    console.log('FileUrl:', fileUrl);
    console.log('Original product picture:', originalProduct?.picture);
    
    // Determine final image URL
    let finalImageURL = originalProduct?.picture || ''; // Default to original
    
    if (hasNewImage && fileUrl) {
      // User uploaded a new image successfully
      finalImageURL = fileUrl;
      console.log('Using NEW image:', finalImageURL);
    } else {
      // No new image, keep original
      console.log('Using ORIGINAL image:', finalImageURL);
    }
    
    const payload = {
        productId: originalProduct?.id || null,
        productName: values?.productName,
        productPrice: values?.productPrice,
        costPrice: values?.costPrice,
        productCategory: values?.productCategory,
        stockQuantity: values?.stockQuantity,
        productDescription: values?.productDescription,
        imageURL: finalImageURL,
        productCode: originalProduct?.productCode || "",
        unitQuantity: values?.unitQuantity,
        base64Image: '',
        storeId: '2001',
        barCode: values.barCode,
        brand: "",
        ccy: user?.ccy
    }

    console.log('=== FINAL PAYLOAD ===');
    console.log('imageURL in payload:', payload.imageURL);
    console.log('========================');
    
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
      {/* Debug Info - Remove in production */}
      {/* <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
        <strong>Debug Info:</strong><br/>
        HasNewImage: {hasNewImage.toString()}<br/>
        FileUrl: {fileUrl || 'empty'}<br/>
        Original Picture: {originalProduct?.picture ? 'exists' : 'none'}
      </div> */}

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
              <div>
              <Label>{t('Product Category')}</Label>
              <SelectInput
              label={t('Product Category')}
              {...register('productCategory', { required: 'This field is required' })}
              control={control}
              options={categories}
              getOptionValue={(option:any)=>option?.value}
              error={t(errors.productCategory?.message!)}
              id="product_category"
              // disabled
            />
            </div>
              {/* Product Name */}
              <Input
                label={t('form:input-label-product-name')}
                {...register('productName', { required: 'This field is required' })}
                variant="outline"
                error={t(errors.productName?.message!)}
              />

              {/* Product Price */}
              <Input
                label={t('Sale Price')}
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
                label={t('Stock Quantity')}
                {...register('stockQuantity')}
                variant="outline"
                type="number"
              />

              <div>
              <Label>{t('Brand')}</Label>
              <SelectInput
              label={t('Brand')}
              {...register('brand')}
              control={control}
              options={categories}
              getOptionValue={(option:any)=>option?.value}
              error={t(errors.brand?.message!)}
              id="brand"
              disabled
            />
            </div>

               <Input
                label={t('Unit Quantity')}
                {...register('unitQuantity', { required: 'This field is required' })}
                variant="outline"
                type="text"
                />
                <Input
                  label={t('Barcode')}
                  {...register('barCode')}
                  variant="outline"
                  type="text"
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
                  disabled={isUploadingFile}
                />
                {isUploadingFile && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </div>
                )}
              </div>
              
              {/* Error Message */}
              {fileError && (
                <p className="text-sm text-red-600 mt-1">{fileError}</p>
              )}
              
              {/* File Info */}
              {selectedFile && !fileError && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p><strong>New Image:</strong> {selectedFile[0].name}</p>
                  <p><strong>Size:</strong> {(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {selectedFile[0].type}</p>
                  {isUploadingFile && <p className="text-blue-600"><strong>Status:</strong> Uploading...</p>}
                  {fileUrl && !isUploadingFile && <p className="text-green-600"><strong>Status:</strong> Upload complete</p>}
                </div>
              )}
              
              {/* Image Preview */}
              {previewUrl && !fileError && (
                <div className="mt-4">
                  <Label>{hasNewImage ? 'New Image Preview:' : 'Current Image:'}</Label>
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
            type="submit" 
            loading={isLoading || isUploadingFile}
            disabled={isUploadingFile}
          >
            {isUploadingFile ? 'Uploading...' : t('Update Product')}
          </Button>
        </div>
      </form>
    </div>
  );
}