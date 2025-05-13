import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import { ActionMeta } from 'react-select';
import Input from '@/components/ui/input';

type Props = {
  onNameFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCodeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function BillerTypeFilter({
  onNameFilter,
  onCodeFilter,
  className,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className={cn('grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
      
      <div className="w-full">
        <Label>{t('common:name')}</Label>
        <Input
          name='name'
          placeholder="Enter biller name"
          onChange={onNameFilter}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:code')}</Label>
        <Input
          name='name'
          placeholder="Enter biller code"
          onChange={onCodeFilter}
          className="w-full"
        />
      </div>
      
    </div>
  );
}