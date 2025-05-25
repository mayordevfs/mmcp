import axios, { AxiosError } from 'axios';
import { logout } from './auth-utils';

const axiosInstanceNoAuth = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ??
    'https://corestack.app:8008/mmcp/api/v1',
});

export default axiosInstanceNoAuth