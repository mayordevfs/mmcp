import Cookie from 'js-cookie';
import SSRCookie from 'cookie';
import {
  AUTH_CRED,
  AUTH_CRED_TRANSFER,
  CUSTOMER,
  PERMISSIONS,
  PERMISSIONS_MONEY_TRANSFER,
  STAFF,
  STORE_OWNER,
  SUPER_ADMIN,
  TOKEN,
  TOKEN_MONEY_TRANSFER,
} from './constants';
import Cookies from 'js-cookie';
import { Routes } from '@/config/routes';
import { toast } from 'react-toastify';


export const allowedRoles = [CUSTOMER];
// export const adminAndOwnerOnly = [SUPER_ADMIN, STORE_OWNER];
// export const adminOwnerAndStaffOnly = [SUPER_ADMIN, STORE_OWNER, STAFF];
// export const adminOnly = [SUPER_ADMIN];
// export const ownerOnly = [STORE_OWNER];
export const authenticatedUser = [CUSTOMER]

export function setAuthCredentials(token: string, permissions: any) {
  Cookie.set(AUTH_CRED_TRANSFER, JSON.stringify({ token, permissions }));
}


export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED_TRANSFER];
  } else {
    authCred = Cookie.get(AUTH_CRED_TRANSFER);
  }
  if (authCred) {
    return JSON.parse(authCred);
  }
  return { token: null, permissions: null };
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? '');
}

export function hasAccess(
  _allowedRoles: string[],
  _userPermissions: string[] | undefined | null
) {
  if (_userPermissions) {
    return Boolean(
      _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
    );
  }
  return false;
}
export function isAuthenticated(_cookies: any) {
    console.log(_cookies[TOKEN_MONEY_TRANSFER]);
    console.log(_cookies[PERMISSIONS_MONEY_TRANSFER]);
    
    
  return (
    !!_cookies[TOKEN_MONEY_TRANSFER] &&
    Array.isArray(_cookies[PERMISSIONS_MONEY_TRANSFER]) &&
    !!_cookies[PERMISSIONS_MONEY_TRANSFER].length
  );
}
export const logout = () => {
  console.log('logout called');

  Cookies.remove(AUTH_CRED_TRANSFER);
  if (window != undefined) {
    window.location.href = '/money_transfer/login';
    window.localStorage.removeItem('token_money_transfer');
    window.localStorage.removeItem('user_money_transfer')
  }
  toast.success('Logout successfully');
};
