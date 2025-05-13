import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { CheckMarkFill } from '@/components/icons/checkmark-circle-fill';
import { CloseFillIcon } from '@/components/icons/close-fill';
import { MapPin } from '@/components/icons/map-pin';
import { PhoneIcon } from '@/components/icons/phone';
import Image from 'next/image';
import ReadMore from '@/components/ui/truncate';

import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from 'react-query';
import axiosInstance from '@/utils/fetch-function';

import { useState } from 'react';
import { MerchantDto, SortOrder, TerminalDtoList } from '@/types';
import { Table } from '@/components/ui/table';
import { generateReportColumn } from '@/utils/locals';
import Card from '@/components/common/card';

const MerchantDetails = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { data, isLoading: loading } = useQuery('merchantDetails', () =>
    axiosInstance.request({
      method: 'GET',
      url: `merchant/${query?.id}`,
      params: {
        merchantCode: query?.id,
        entityCode: 'ETZ',
      },
    })
  );
  const terminalDtoList: TerminalDtoList[] = data?.data?.terminalDtoList;
  const merchantDetails: MerchantDto = data?.data?.merchantDto;
  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <div className="">
      {/* Back button */}
      <div className="col-span-12">
        <LinkButton href={Routes.merchant.list} className="mb-4">
          {t('Merchants')}
        </LinkButton>
      </div>
      <div className="grid grid-cols-[2fr,3fr] gap-3">
        {/* about Shop */}
        <div className="">
          <div className="flex flex-col items-center rounded bg-white py-8 px-6">
            <div className="relative mb-5 h-36 w-36 rounded-full">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-gray-100">
                <Image
                  src={'/avatar-placeholder.svg'}
                  layout="fill"
                  objectFit="contain"
                  alt={'image'}
                />
              </div>
              <p className="text-center">{merchantDetails?.username}</p>

              {true ? (
                <div className="absolute bottom-4 h-5 w-5 overflow-hidden rounded-full bg-light end-2">
                  <CheckMarkFill width={20} className="text-accent me-2" />
                </div>
              ) : (
                <div className="absolute bottom-4 h-5 w-5 overflow-hidden rounded-full bg-light end-2">
                  <CloseFillIcon width={20} className="text-red-500 me-2" />
                </div>
              )}
            </div>

            <h1 className="mb-2 text-xl font-semibold text-heading">
              {merchantDetails.businessName}
            </h1>
            <p className="text-center text-sm text-body">
              <ReadMore character={70}>{merchantDetails.email}</ReadMore>
            </p>

            <div className="mt-5 flex w-full justify-start">
              <span className="mt-0.5 text-muted-light me-2">
                <MapPin width={16} />
              </span>
              {merchantDetails?.address}
            </div>

            <div className="mt-3 flex w-full justify-start">
              <span className="mt-0.5 text-muted-light me-2">
                <PhoneIcon width={16} />
              </span>
              <a
                href={`tel:${merchantDetails?.mobileNo}`}
                className="text-sm text-body"
              >
                {merchantDetails?.mobileNo
                  ? merchantDetails?.mobileNo
                  : t('common:text-no-contact')}
              </a>
            </div>
          </div>
        </div>

        <Card className="">
          <div className="flex flex-col border-b border-gray-200 pb-2 ">
            <span className="mb-2 text-sm text-muted">
              {t('common:text-registered-since')}
            </span>
            <span className="text-sm font-semibold text-sub-heading">
              {merchantDetails?.createdDate}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="mb-4 text-lg font-semibold text-sub-heading">
              Bank Information
            </span>
            <div className="flex flex-col space-y-3">
              <p className="text-sm text-sub-heading">
                <span className="block w-full text-muted">Account Name:</span>{' '}
                <span className="font-semibold">
                  {merchantDetails?.bankAccountName}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="block w-full text-muted">
                  {t('common:text-email')}:
                </span>{' '}
                <span className="font-semibold">{merchantDetails?.email}</span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="block w-full text-muted">
                  {t('common:text-bank')}:
                </span>{' '}
                <span className="font-semibold">
                  {merchantDetails?.bankName}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="block w-full text-muted">
                  {t('common:text-account-no')}:
                </span>{' '}
                <span className="font-semibold">
                  {merchantDetails.accountNo}
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>
      {/* Misc. Information */}
      <br />

      <h3>Terminal List</h3>
      <br />
      <Table
        //@ts-ignore
        columns={generateReportColumn(terminalDtoList)}
        emptyText={t('table:empty-table-data')}
        data={terminalDtoList ?? []}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </div>
  );
};
MerchantDetails.Layout = Layout;

export default MerchantDetails;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
