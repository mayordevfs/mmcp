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
import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth';
import { useQuery } from 'react-query';
import SelectInput from '../ui/select-input';

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

type TransactionOption = {
  value: string;
  label: string;
  data: any;
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

  // const transactionTypes = [
  //   { value: 'purchase', label: t('common:purchase') },
  //   { value: 'refund', label: t('common:refund') },
  //   { value: 'void', label: t('common:void') },
  //   { value: 'preauth', label: t('common:preauth') },
  // ];

  const statusOptions = [
    { value: 'Successful', label: t('common:success') },
    { value: 'FAILED', label: t('common:failed') },
    { value: 'Pending', label: t('common:pending') },
  ];

  const { data: transactionTypes } = useQuery<any>(
    'transactionTypes',
    () =>
      axiosInstanceNoAuth.get(
        'lookupdata/new-list', 
        {
          params: {
            categoryCode: 'TRAN_CODE',
            entityCode: 'ETZ'
          }
        }
      ),
    {
      select: (data) => {
        return data.data.list.map((item: { code: string; name: string }) => ({
          value: item.code, 
          label: item.name  
        }));
      },
    }
  );

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {/* <div className="w-full">
        <Label>{t('common:transaction-type')}</Label>
        <Select
          name="transactionType"
          options={transactionTypes}
          placeholder={t('common:select-transaction-type')}
          onChange={handleSelectChange}
          value={tranFilter.transactionType}
        />
      </div> */}

      <div className="w-full">
        <Label>{t('common:transaction-type')}</Label>
        <Select
          name="transactionType"
          options={transactionTypes}
          placeholder={t('common:select-transaction-type')}
          onChange={handleSelectChange}
          value={transactionTypes?.find(option => option.value === tranFilter.transactionType) || null}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
        />
      </div>
      

      {/* <div className="mb-5">
        <Label>{t('common:transaction-type')}</Label>
        <SelectInput
          name="transactionTypes"
          control={""}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.id}
          options={transactionTypesData || []}
          isLoading={!transactionTypesData}
        />
      </div> */}

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
          value={statusOptions.find(option => option.value === tranFilter.status) || null}
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
