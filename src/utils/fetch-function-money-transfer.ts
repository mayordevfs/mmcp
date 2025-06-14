import axios, { AxiosError } from 'axios';
import { logout } from './auth-utils';

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app:8008/mmcp/api/v1',
});
async function getSessionToken() {
  const token = window.localStorage.getItem('token');
  if (token) {
    
    return token;
  }
}
async function getToken() {
  if (typeof window !== 'undefined' && window.localStorage.getItem('token_money_transfer')) {
    const storedSession = window.localStorage.getItem('token_money_transfer');
    return storedSession ? storedSession : await getSessionToken();
  }
  return null;
}

axiosInstance.interceptors.request.use(async function (config) {
  const token = await getToken();

  if (token && !config.url?.includes('login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    if (error.response?.request.responseURL?.includes('login')) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout();
    } else {
      return Promise.reject(error);
    }
  }
);
export default axiosInstance;
