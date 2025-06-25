import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import { useCategoriesQuery } from '@/data/category';
import { useRouter } from 'next/router';
import { useTypesQuery } from '@/data/type';
import { ActionMeta } from 'react-select';
import Input from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import useGetLookup from '@/hooks/useGetLookup';
import Button from '../ui/button';

type Props = {
  onTerminalIdFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onBankCodeFilter: (newValue: any) => void;
  onApplyFilter: ()=>void
  className?: string;
};

export default function CategoryTypeFilter({
  onTerminalIdFilter,
  onStatusFilter,
  onBankCodeFilter,
  onApplyFilter,
  className,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const bankCode = useGetLookup('BANK')

  // console.log(bankCode);
  

  const statusOptions = [
    { value: 'Assigned', label: t('Assigned') },
    { value: 'Available', label: t('Available') },
    { value: 'Damaged', label: t('Damaged') },
  ];

  return (
    <div
      className={cn(
        'space-y-3',
        className
      )}
    >
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <div className="w-full">
        <Label>{t('common:terminal-id')}</Label>
        <Input
          name="terminalId"
          placeholder={t('common:enter-terminal-id')}
          onChange={onTerminalIdFilter}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:status')}</Label>
        <Select
          options={statusOptions}
          placeholder={t('common:select-status')}
          onChange={onStatusFilter}
        />
      </div>

      <div className="w-full">
        <Label>{t('Bank Code')}</Label>
        <Select
          options={bankCode}
          getOptionLabel={(option:any)=>option?.name}
          getOptionValue={(option:any)=>option?.id}
          placeholder={t('Bank Code')}
          onChange={onBankCodeFilter}
        />
      </div>
      </div>
      <Button onClick={onApplyFilter}>Filter</Button>
    </div> 
  );
}
