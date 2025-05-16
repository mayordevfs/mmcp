import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import { ActionMeta } from 'react-select';
import Input from '@/components/ui/input';
import Button from '../ui/button';
import SelectInput from '../ui/select-input';
import useGetLookup from '@/hooks/useGetLookup';
import { Control, FieldValues } from 'react-hook-form';

type Props = {
  
  onTranCodeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  handleSubmit: () => void;
  tranCode:string
};

export default function TransactionTypeFilter({
  className,
  handleSubmit,
  tranCode,
  onTranCodeFilter
}: Props) {
  const { t } = useTranslation();
  return (
    <div className='space-y-3'>
      <div className={cn('grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>

      <div className="w-full">
        <Label>{t('Tran Code')}</Label>
        <Input
          name='tranCode'
          placeholder={t('TranCode')}
          onChange={onTranCodeFilter}
          className="w-full"
          value={tranCode}
        />
      </div>
      
    </div>
    <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}