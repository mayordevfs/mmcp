import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import axiosInstance from '@/utils/fetch-function';

export const dashboardClient = {
  analytics() {
    return HttpClient.get<any>(API_ENDPOINTS.ANALYTICS);
  },
};
export const newDashboardClient = {
  async analytics() {
    const response = await axiosInstance.get<any>(API_ENDPOINTS.NEW_ANALYTICS);
    return response.data;
  },
};
