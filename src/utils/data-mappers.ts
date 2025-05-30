import camelCaseKeys from 'camelcase-keys';
import { MappedPaginatorInfo, PaginatorInfo } from '@/types';

export const mapPaginatorData = (
  obj: PaginatorInfo<any> | undefined
): MappedPaginatorInfo | null => {
  if (!obj) return null;
  const { data, ...formattedValues } = camelCaseKeys(obj);
  return {
    ...formattedValues,
    hasMorePages: formattedValues.lastPage !== formattedValues.currentPage,
  };
};
export const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (
    statusLower === 'active' ||
    statusLower === 'approved' ||
    statusLower === 'success' ||
    statusLower === 'completed' ||
    statusLower === 'successful'
  ) {
    return 'bg-green-500';
  }  else if (statusLower === 'pending') {
    return 'bg-yellow-500';
  }
  else if (statusLower === 'inactive' || statusLower === 'failed'||'declined') {
    return 'bg-red-500';
  }
}
