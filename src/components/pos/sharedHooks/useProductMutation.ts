// hooks/useProductMutation.ts
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/fetch-function';

export const useProductMutation = (isEdit = false) => {
  const router = useRouter();

  return useMutation(
    (data: any) => axiosInstance.request({
      method: "POST",
      url: "stock-management/save-update",
      data: data,
    }),
    {
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc || 'Error saving product');
          return;
        }
        
        const message = isEdit ? 'Product updated successfully' : 'Product saved successfully';
        toast.success(message);
        router.push('/pos');
      },
      onError: (error: any) => {
        console.error('Product mutation error:', error);
        
        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
          } else if (error.response.status === 422) {
            toast.error(`Error ${isEdit ? 'updating' : 'saving'} product`);
          } else if (error.response.status === 500) {
            toast.error(`Error ${isEdit ? 'updating' : 'saving'} product`);
          }
        } else {
          toast.error(`Error ${isEdit ? 'updating' : 'saving'} product`);
        }
      },
    }
  );
};