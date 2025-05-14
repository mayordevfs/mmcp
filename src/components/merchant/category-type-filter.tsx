import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import Input from '@/components/ui/input';
import Button from '../ui/button';

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  merchantFilter: any;
  handleSubmit: () => void;
  className?: string;
};

export default function MerchantTypeFilter({
  handleChange,
  handleSubmit,
  merchantFilter,
  className,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'grid w-full  grid-cols-1 items-end gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
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
      <Button onClick={handleSubmit}>Search</Button>
    </div>
  );
}
