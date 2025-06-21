import React from 'react';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Input from '@/components/ui/input';
import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import TextArea from '@/components/ui/text-area';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { ProductFormValues } from '@/types';


interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  categories: Array<{ label: string; value: string }>;
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  register,
  control,
  errors,
  categories
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Basic Information Section */}
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

            <Input
              label={t('form:input-label-product-name')}
              {...register('productName', { required: 'This field is required' })}
              variant="outline"
              error={t(errors.productName?.message!)}
            />

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
                error={t(errors.brand?.message!)}
                id="brand"
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

      {/* Description Section */}
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
    </>
  );
};