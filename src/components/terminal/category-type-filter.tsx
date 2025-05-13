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

type Props = {
  onTerminalIdFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;

  className?: string;
};

export default function CategoryTypeFilter({
  onTerminalIdFilter,
  onStatusFilter,
  className,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'success', label: t('common:success') },
    { value: 'failed', label: t('common:failed') },
    { value: 'pending', label: t('common:pending') },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
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
    </div>
  );
}
