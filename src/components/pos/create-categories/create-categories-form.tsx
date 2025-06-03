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
import { uploadClient } from '@/data/client/upload';

const defaultValues = {
  name: '',
  code: '',
  tags: '',
  description: '',
  topCategory: '',
  sector: '',
  qty: ''
};

type CategoryFormValues = {
  name: string;
  code: string;
  tags: string;
  description: string;
  topCategory: string;
  sector: string;
  qty: string;
};

type IProps = {
  initialValues?: CategoryFormValues | null;
};

export default function CreateCategoryForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [fileUrl, setFileUrl] = useState('');
  const fileArray = Array.from(selectedFile as FileList || []);

  // Sector options - you can customize these based on your business needs
  const sectorOptions = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing & Fashion', value: 'clothing' },
    { label: 'Food & Beverages', value: 'food' },
    { label: 'Home & Garden', value: 'home' },
    { label: 'Health & Beauty', value: 'health' },
    { label: 'Sports & Recreation', value: 'sports' },
    { label: 'Books & Media', value: 'books' },
    { label: 'Automotive', value: 'automotive' },
    {label:"Cosmetics",value:'cosmetics'},
    { label: 'Other', value: 'other' }
  ];

  // Top category options - you can customize these
  const topCategoryOptions = [
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
    { label: 'Tertiary', value: 'tertiary' }
  ];

  useEffect(() => {
    if (!selectedFile?.length) return;
    uploadClient.upload(fileArray)
      .then((res: any) => {
        console.log(res);
        const filename = res?.data?.refNo
        console.log(filename);
        setFileUrl(`${filename}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedFile]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: initialValues ?? defaultValues,
  });

  const { mutate: createCategory, isLoading, data } = useMutation(
    (data: any) => axiosInstance.request({
      method: "POST",
      url: "/products/save-product-category", 
      data: data,
    }),
    {
      onSuccess: (data) => {
        toast.success('Category created successfully');
        router.push('/pos')
      },
      onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
          } else if (error.response.status === 422) {
            toast.error("Error creating category");
          } else if (error.response.status === 500) {
            toast.error("Error creating category");
          }
        } else {
          toast.error("Error creating category");
        }
      },
    }
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    setFileError('');

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file[0].type)) {
      setFileError('Only JPG, PNG, WebP, and SVG files are allowed');
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
    console.log("Submitting category form");
    console.log('Form values:', values);
    console.log('Selected file:', selectedFile);

    // Check if file is required but not selected
    if (!selectedFile) {
      setFileError('Category logo is required');
      return;
    }

    const payload = {
      id: 0,
      code: values?.code,
      name: values?.name,
      logo: fileUrl ? fileUrl : '',
      tags: values?.tags,
      description: values?.description,
      topCategory: values?.topCategory?.value || values?.topCategory,
      sector: values?.sector?.value || values?.sector,
      qty: values?.qty,
    };

    createCategory(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('Category Information')}
          details={t('Add basic information about the product category')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Category Name */}
            <div className="md:col-span-2">
              <Input
                label={t('Category Name')}
                {...register('name', { required: 'Category name is required' })}
                variant="outline"
                placeholder={t('e.g. Electronics, Clothing, Food')}
                error={t(errors.name?.message!)}
              />
            </div>

            {/* Category Code */}
            <Input
              label={t('Category Code')}
              {...register('code', { required: 'Category code is required' })}
              variant="outline"
              placeholder={t('e.g. ELEC, CLTH, FOOD')}
              error={t(errors.code?.message!)}
            />

            {/* Quantity */}
            <Input
              label={t('Quantity')}
              {...register('qty')}
              variant="outline"
              placeholder={t('e.g. 100')}
              type="text"
            />

            {/* Top Category */}
            <div>
              <SelectInput
                label={t('Top Category')}
                {...register('topCategory')}
                control={control}
                options={topCategoryOptions}
                id="top_category"
                placeholder={t('Select top category')}
              />
            </div>

            {/* Sector */}
            <div>
              <SelectInput
                label={t('Sector')}
                {...register('sector')}
                control={control}
                options={sectorOptions}
                id="sector"
                placeholder={t('Select sector')}
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <Input
                label={t('Tags')}
                {...register('tags')}
                variant="outline"
                placeholder={t('e.g. trending, popular, seasonal (comma separated)')}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Description Section */}
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('Category Description')}
          details={t('Add detailed description for the category')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <TextArea
            label={t('Category Description')}
            {...register('description', { required: 'Category description is required' })}
            variant="outline"
            placeholder={t('Describe what products belong to this category...')}
            error={t(errors.description?.message!)}
          />
        </Card>
      </div>

      {/* Logo Upload Section */}
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('Upload Category Logo')}
          details={t('Please upload a category logo (JPG, PNG, WebP, SVG - Max 5MB)')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="space-y-4">
            <Label>{t('Category Logo')} *</Label>

            {/* File Input */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
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
                    alt="Category logo preview"
                    className="max-w-full max-h-32 object-contain mx-auto"
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
          onClick={() => router.back()}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button> */}

        <Button type="submit" loading={isLoading}>
          {t('Create Category')}
        </Button>
      </div>
    </form>
  );
}