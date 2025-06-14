import { LoggedInUser, UserProfile_Transfer } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const initialUserProfile: UserProfile_Transfer = {
  appVersion: null,
  ccy: "",
  chatSessionToken: "",
  country: "",
  customerId: "",
  customerTier: "",
  deviceID: "",
  email: "",
  entityCode: "",
  entityLogo: "",
  entityName: "",
  firstname: "",
  forcePwdChange: "",
  fullname: "",
  kycStatus: null,
  kycTierStatus: null,
  language: "",
  lastLoginDate: "",
  mobileNo: "",
  notificationMessage: null,
  onboardType: null,
  partnerLink: "",
  photoLinks: null,
  pinSet: false,
  referalCode: "",
  responseCode: "",
  responseMessage: "",
  retryNo: 0,
  ticketID: "",
  userRole: "",
  username: ""
};


// ✅ Define the correct store shape
interface UserStore {
  user: UserProfile_Transfer;
  setUser: (user: UserProfile_Transfer|{}) => void;
  clear: () => void;
}

// ✅ Zustand store with correct type
const useUser_transfer = create<UserStore>()(
  persist(
    (set) => ({
      user: initialUserProfile,
      setUser: (user) => set(() => ({ user })),
      clear: () => set(() => ({ user: initialUserProfile })),
    }),
    {
      name: 'user_money_transfer',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUser_transfer;
