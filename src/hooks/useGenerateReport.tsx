import axiosInstance from '@/utils/fetch-function';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const useGenerateReport = () => {
  const router = useRouter();
  const [searchParams] = useState(
    () => new URLSearchParams(window.location.search)
  );
  const code = searchParams.get('code');

  const { data, isLoading } = useQuery<AxiosResponse<any>>(
    [code, 'generate-report'],
    () =>
      axiosInstance.request({
        method: 'POST',
        url: '/dashboard/generateReport',
        params: { entityCode: 'ETZ' },
        data: {
          entityCode: 'ETZ',
          startDate: '01-01-2025',
          endDate: '31-12-2025',
          datePeriod: 'M',
          tranCode: '',
          keyword: '',
          pageSize: 5000,
          tranStatus: '',
          terminalId: '',
          pageNumber: 1,
          reportCode: code,
          merchantCode: '',
          offset: '0',
        },
      })
  );
  const reports = data?.data ?? [];
  const downloadMutation = useMutation(
    () =>
      axiosInstance.request({
        method: 'POST',
        url: '/dashboard/exportReport',
        data: {
          entityCode: 'ETZ',
          startDate: '01-01-2025',
          endDate: '31-12-2025',
          datePeriod: 'M',
          tranCode: '',
          keyword: '',
          pageSize: 5000,
          tranStatus: '',
          terminalId: '',
          pageNumber: 1,
          reportCode: code,
          merchantCode: '',
          offset: '0',
        },
        params: { entityCode: 'ETZ', reportType: code },
        responseType: 'blob',
      }),
    {
      onSuccess: (response) => {
        toast.success('Report Downloaded successfully');
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `${code}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
    }
  );

  return {
    reports,
    isLoading,
    code,

    downloadMutation,
  };
};

export default useGenerateReport;
