import axios, { AxiosError } from 'axios';
import { logout } from './auth-utils';

const axiosInstanceNoAuth = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app:8008/mmcp/api/v1',
});

// Add request interceptor to include custom headers
axiosInstanceNoAuth.interceptors.request.use(
  (config) => {
    // Add the custom headers
    config.headers['x-source-code'] = process.env.NEXT_PUBLIC_SOURCE_CODE || 'MMCP';
    config.headers['x-client-id'] = process.env.NEXT_PUBLIC_CLIENT_ID || 'TST03054745785188010772';
    config.headers['x-client-secret'] = process.env.NEXT_PUBLIC_CLIENT_SECRET || 'TST03722175625334233555707073458615741827171811840881';
    // if (window.location.pathname === '/money_transfer/login') {
    //   config.headers['x-otp'] = '1234'
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstanceNoAuth;