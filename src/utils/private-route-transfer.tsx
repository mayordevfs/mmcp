import React from 'react';
import { useRouter } from 'next/router';

import Loader from '@/components/ui/loader/loader';
import AccessDeniedPage from '@/components/common/access-denied';
// import { Routes } from '@/config/routes';
import { getAuthCredentials, hasAccess } from './auth-transfer-utils';

const PrivateRouteMoneyTransfer: React.FC<{ authPropsTransfer: any }> = ({
  children,
  authPropsTransfer,
}) => {
  const router = useRouter();
  const { token, permissions } = getAuthCredentials();
  console.log(token);
  
  
  const isUser = !!token;
  const hasPermission =
    Array.isArray(permissions) &&
    !!permissions.length &&
    hasAccess(authPropsTransfer.permissions, permissions);
  React.useEffect(() => {
    if (!isUser) router.replace(`/money_transfer/login`); // If not authenticated, force log in
  }, [isUser]);

  if (isUser && hasPermission) {
    return <>{children}</>;
  }
  if (isUser && !hasPermission) {
    return <AccessDeniedPage />;
  }
  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <Loader showText={false} />;
};

export default PrivateRouteMoneyTransfer;
