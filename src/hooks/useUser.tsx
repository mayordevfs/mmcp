import { useEffect, useState } from 'react'
interface UserProfile {
  accountType: string | null;
  address: string;
  appMenuList: any | null;
  appSettingsDto: any | null;
  appVersion: string | null;
  branchID: string;
  branchName: string;
  businessName: string;
  ccy: string;
  country: string;
  creditWallet: boolean;
  customerTier: string | null;
  deviceID: string;
  email: string;
  entityCode: string;
  entityLogo: string;
  entityName: string;
  entityStyle: string | null;
  entityType: string;
  expiryDate: string | null;
  externalAccount: any | null;
  firstname: string | null;
  forcePwdChange: string;
  fullname: string;
  hardTokenOtpValid: boolean | null;
  language: string | null;
  lastLoginDate: string;
  medium: string | null;
  menuInfoList: any | null;
  merchantCode: string;
  merchantGroupCode: string;
  messageActionDto: any | null;
  metaData: any | null;
  mobileNo: string;
  paymentMethodAllowed: any | null;
  photoLinks: any | null;
  pwd: string;
  referalCode: string;
  refreshToken: string | null;
  responseCode: string;
  responseMessage: string;
  retryNo: number;
  softTokenQrCodeLink: string | null;
  storeCode: string | null;
  supervisor: string;
  supervisorPassword: string | null;
  terminalId: string;
  ticketID: string;
  twoFactorLimit: number;
  twoFactorType: string;
  userID: string;
  userPermissionList: any | null;
  userRole: string;
  userRoles: any | null;
  username: string;
  walletAcc: string;
  walletBalance: number;
  walletType: number;
}

const useUser = () => {
  const [user,setUser] = useState<UserProfile|null>(null)
  useEffect(()=>{
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  },[])
  return user
}

export default useUser