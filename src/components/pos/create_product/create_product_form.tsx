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
import { create } from 'lodash';
import { uploadClient } from '@/data/client/upload';
import { useProductCategoryQuery } from '@/data/pos/category';
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

type IProps = {
  initialValues?: ProductFormValues | null;
};

export default function CreateProductForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {user} = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [fileUrl,setFileUrl] = useState('')
  const fileArray = Array.from(selectedFile as FileList||[])
  const {data:category} = useProductCategoryQuery(1)
  const categories = category?.map((item) => ({
    label: item.name,
    value: item.code,
  })) || [];
  console.log(selectedFile);
  useEffect(()=>{
    if (!selectedFile?.length) return
    uploadClient.upload(fileArray)
    .then((res:any)=>{
      console.log(res);
      const filename = res?.data?.refNo.split('/').pop()
      console.log(filename);
      
      setFileUrl(`/${filename}`)
      toast.success("Image uploaded successfully")
    })
    .catch((err)=>{
      console.log(err);
      
    })
  },[selectedFile])
 
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: initialValues ?? defaultValues,
  });
  
  const {mutate:createProduct,isLoading,data} = useMutation(

        (data:any)=>axiosInstance.request({
            method:"POST",
            url:"stock-management/save-update",
            data:data,
            // params:{
            //   entity_id:"101"
            // }
        }),
        {
            onSuccess: (data) => {
                    // if (data?.data?.code !== '000') {
                    //   toast.error(data?.data?.desc);
                    //   return;
                    // }
                    toast.success('Product saved successfully');
                    router.push('/pos')
                  },
            onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
          } else if (error.response.status === 422) {
            toast.error("Error saving product");
          } else if (error.response.status === 500) {
            toast.error("Error saving product");
          }
        } else {
          toast.error("Error saving product");
        }
      },
        },
        
    )
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    setFileError('');
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file[0].type)) {
      setFileError('Only JPG, PNG, and WebP files are allowed');
      setSelectedFile(null);
      setPreviewUrl(null);
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
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file[0]);
  };

  const onSubmit = async (values: any) => {
    console.log("I am submitting");
    console.log('Form values:', values);
    console.log('Selected file:', selectedFile);
    
    // Check if file is required but not selected
    if (!selectedFile) {
      setFileError('Product image is required');
      return;
    }
  
    
    const payload ={
        productName:values?.productName,
        productPrice:values?.productPrice,
        costPrice:values?.costPrice,
        productCategory:values?.productCategory?.label,
        stockQuantity:values?.stockQuantity,
        productDescription:values?.productDescription,
        imageURL: fileUrl? fileUrl:'',
        productCode:"",
        unitQuantity:values?.unitQuantity,
        productId:null,
        base64Image:'',
        storeId:'2001',
        barCode:values?.barcode||'',
        brand:values?.brand?.value||"",
        ccy:user?.ccy
    }

    createProduct(payload);
  };

  return (
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
              error={t(errors.productCategory?.message!)}
              id="product_category"
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
            
            <div>
              <Label>{t('Brand')}</Label>
              <SelectInput
              label={t('Brand')}
              {...register('brand')}
              control={control}
              options={categories}
              error={t(errors.productCategory?.message!)}
              id="product_category"
            />
            </div>

            {/* <select name="productCategory" id="product_category" className='h-fit'>
              <option value="" disabled selected>{t('Select Product Category')}</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select> */}
            
            <Input
              label={t('Stock Quantity')}
              {...register('stockQuantity')}
              variant="outline"
              type="number"
            />

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
          title={t('Upload Product Image')}
          details={t('Please upload a product image (JPG, PNG, WebP - Max 5MB)')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="space-y-4">
            <Label>{t('Product Image')} *</Label>
            
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
                <p><strong>Selected:</strong> {selectedFile[0].name}</p>
                <p><strong>Size:</strong> {(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Type:</strong> {selectedFile[0].type}</p>
              </div>
            )}
            
            {/* Image Preview */}
            {previewUrl && !fileError && (
              <div className="mt-4">
                <Label>Preview:</Label>
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
        {/* <Button
          variant="outline"
          onClick={router.back}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button> */}

        <Button type="submit" loading={isLoading}>
          {t('form:button-label-save-product')}
        </Button>
      </div>
    </form>
  );
}