import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import { ActionMeta } from 'react-select';
import Input from '@/components/ui/input';

type Props = {
  onEntityCodeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomerTypeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBranchCodeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function TransactionTypeFilter({
  onEntityCodeFilter,
  onCustomerTypeFilter,
  onBranchCodeFilter,
  className,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className={cn('grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
      
      <div className="w-full">
        <Label>{t('form:input-label-entity-code')}</Label>
        <Input
          name='entityCode'
          placeholder={t('form:input-label-entity-code')}
          onChange={onEntityCodeFilter}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('form:input-label-customer-type')}</Label>
        <Input
          name='customerType'
          placeholder={t('form:input-label-customer-type')}
          onChange={onCustomerTypeFilter}
          className="w-full"
        />
      </div>

      <div className="w-full">
        <Label>{t('form:input-label-branch-code')}</Label>
        <Input
          name='branchCode'
          placeholder={t('form:input-label-branch-code')}
          onChange={onBranchCodeFilter}
          className="w-full"
        />
      </div>
      
    </div>
  );
}