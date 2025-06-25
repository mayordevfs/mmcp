import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import { ActionMeta } from 'react-select';
import Input from '@/components/ui/input';
import Button from '../ui/button';

type Props = {
  
  onCodeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleApplyFilter: ()=>void
  className?: string;
};

export default function LookupTypeFilter({
  onCodeFilter,
  handleApplyFilter,
  className,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className={cn('space-y-3', className)}>
      
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <div className="w-full">
        <Label>{t('Category Code')}</Label>
        <Input
          name='categoryCode'
          placeholder={t('Category Code')}
          onChange={onCodeFilter}
          className="w-full"
        />
      </div>

      </div>

      <Button onClick={handleApplyFilter}>
        Filter
      </Button>
      
    </div>
  );
}