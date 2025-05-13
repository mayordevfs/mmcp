import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { useTranslation } from 'next-i18next';
import { ShippingUpdateInput } from '@/types';
import { toast } from 'react-toastify';
import { Merchant } from '@/types';
import { ShippingQueryOptions } from '@/types';
import { merchantClient } from './client/merchant';

export const useCreateShippingMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation(merchantClient.create, {
    onSuccess: () => {
      router.push(Routes.shipping.list);
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHIPPINGS);
    },
  });
};

export const useDeleteShippingClassMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(merchantClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHIPPINGS);
    },
  });
};

export const useUpdateShippingMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(merchantClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHIPPINGS);
    },
  });
};

// export const useShippingQuery = (id: string) => {
//   return useQuery<Merchant, Error>([API_ENDPOINTS.SHIPPINGS, id], () =>
//     shippingClient.get({ id })
//   );
// };

export const useShippingClassesQuery = (
  options: Partial<ShippingQueryOptions> = {}
) => {
  const { data, error, isLoading } = useQuery<Merchant[], Error>(
    [API_ENDPOINTS.SHIPPINGS, options],
    ({ queryKey, pageParam }) =>
      merchantClient.all(Object.assign({}, queryKey[1], pageParam)).then((shippings) =>
        shippings.map((shipping) => ({
          ...shipping,
          type: shipping.type as unknown as Merchant,
        }))
      ),
    {
      keepPreviousData: true,
    }
  );

  return {
    merchantClasses: data ?? [],
    error,
    loading: isLoading,
  };
};
