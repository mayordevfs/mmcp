import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import Input from '@/components/ui/input';
import Button from '../ui/button';
import Button from '../ui/button';

type Props = {
  onNameFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCodeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleApplyFilter: ()=>void
  className?: string;
};

export default function MerchantTypeFilter({
  onNameFilter,
  onCodeFilter,
  handleApplyFilter,
  className,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <div className={cn('space-y-3', className)}>
      
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <div className="w-full">
        <Label>{t('common:name')}</Label>
        <Input
          name="name"
          placeholder={t('common:enter-name')}
          onChange={handleChange}
          value={merchantFilter.name}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:code')}</Label>
        <Input
          name="code"
          placeholder={t('common:enter-merchant-code')}
          onChange={handleChange}
          value={merchantFilter.code}
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
