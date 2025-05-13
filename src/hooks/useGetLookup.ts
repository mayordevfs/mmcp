import { SelectOption } from '@/types';
import axiosInstance from '@/utils/fetch-function';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
export interface LookupOptions {
  id: number;
  categoryCode: string;
  lookupCode: string;
  lookupName: string;
  lookupDesc: string;
  usageAccess: string;
  status: string;
  entityCode: string;
  countryCode: string;
}

const useGetLookup = (categoryCode: string) => {
  const { data: lookupData } = useQuery<AxiosResponse<LookupOptions[]>>(
    [categoryCode],
    () =>
      axiosInstance.request({
        url: 'lookupdata/getdatabycategorycode/' + categoryCode,
        method: 'GET',
        params: {
          entityCode: 'ETZ',
        },
      })
  );
  const lookupList: SelectOption[] =
    lookupData?.data.map((item) => {
      return {
        id: item.lookupCode,
        name: item.lookupName,
        description: item.lookupDesc,
      };
    }) ?? [];
  return lookupList;
};

export default useGetLookup;
