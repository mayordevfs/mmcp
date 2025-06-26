import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import { ActionMeta } from 'react-select';
import Input from '@/components/ui/input';
import Button from '../ui/button';
import useGetCategoryCode from '@/hooks/useGetCategoryCode';

type Props = {
  onCodeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleApplyFilter: () => void;
  className?: string;
};

export default function LookupTypeFilter({
  onCodeFilter,
  handleApplyFilter,
  className,
}: Props) {
  const { t } = useTranslation();
  const { data: dropdownData } = useGetCategoryCode();
  const categoryOptions = dropdownData?.data?.list;

  const handleSelectChange = (selectedOption: any) => {
    
    const syntheticEvent = {
      target: {
        value: selectedOption ? selectedOption.code : ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onCodeFilter(syntheticEvent);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <div className="w-full">
          <Label>{t('Category Code')}</Label>
          <Select
            name="categoryCode"
            options={categoryOptions}
            placeholder={t('Category Code')}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.code}
            onChange={handleSelectChange}
          />
        </div>
      </div>

      <Button onClick={handleApplyFilter}>
        Filter
      </Button>
    </div>
  );
}