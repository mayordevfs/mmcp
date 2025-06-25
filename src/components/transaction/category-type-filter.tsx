import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';

import { ActionMeta } from 'react-select';
import Input from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import Button from '../ui/button';
import { TranFilterType } from '@/pages/transactions';

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (
    selectedOption: any,
    actionMeta: ActionMeta<unknown>
  ) => void;
  handleDateChange: (date: Date | null, name: string) => void;
  handleSubmit: () => void;
  tranFilter: TranFilterType;

  className?: string;
};

export default function CategoryTypeFilter({
  className,
  handleChange,
  handleSelectChange,
  handleDateChange,
  handleSubmit,
  tranFilter,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const transactionTypes = [
    { value: 'purchase', label: t('common:purchase') },
    { value: 'refund', label: t('common:refund') },
    { value: 'void', label: t('common:void') },
    { value: 'preauth', label: t('common:preauth') },
  ];

  const statusOptions = [
    { value: 'success', label: t('common:success') },
    { value: 'failed', label: t('common:failed') },
    { value: 'pending', label: t('common:pending') },
  ];

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      <div className="w-full">
        <Label>{t('common:transaction-type')}</Label>
        <Select
          name="transactionType"
          options={transactionTypes}
          placeholder={t('common:select-transaction-type')}
          onChange={handleSelectChange}
          value={tranFilter.transactionType}
        />
      </div>

      <div className="w-full">
        <Label>{t('common:start-date')}</Label>
        <DatePicker
          selected={tranFilter.startDate}
          onChange={(date) => handleDateChange(date, 'startDate')}
          placeholderText={t('common:select-start-date')}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:end-date')}</Label>
        <DatePicker
          selected={tranFilter.endDate}
          onChange={(date) => handleDateChange(date, 'endDate')}
          placeholderText={t('common:select-end-date')}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:rrn')}</Label>
        <Input
          name="rrn"
          placeholder={t('common:enter-rrn')}
          onChange={handleChange}
          value={tranFilter.rrn}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:status')}</Label>
        <Select
          options={statusOptions}
          placeholder={t('common:select-status')}
          value={tranFilter.status}
          onChange={handleSelectChange}
          name="status"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:merchant-code')}</Label>
        <Input
          name="merchantCode"
          placeholder={t('common:enter-merchant-code')}
          onChange={handleChange}
          value={tranFilter.merchantCode}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:name')}</Label>
        <Input
          name="name"
          placeholder={t('common:enter-name')}
          value={tranFilter.name}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('common:terminal-id')}</Label>
        <Input
          name="terminalId"
          placeholder={t('common:enter-terminal-id')}
          value={tranFilter.terminalId}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      <Button onClick={handleSubmit}>Search</Button>
    </div>
  );
}
