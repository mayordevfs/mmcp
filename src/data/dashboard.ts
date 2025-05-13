import { Product, ProductQueryOptions } from '@/types';
import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { dashboardClient, newDashboardClient } from '@/data/client/dashboard';
import { productClient } from '@/data/client/product';

export function useAnalyticsQuery() {
  return useQuery([API_ENDPOINTS.ANALYTICS], newDashboardClient.analytics);
}

export function usePopularProductsQuery(options: Partial<ProductQueryOptions>) {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.POPULAR_PRODUCTS, options],
    ({ queryKey, pageParam }) =>
      productClient.popular(Object.assign({}, pageParam, queryKey[1]))
  );
}
