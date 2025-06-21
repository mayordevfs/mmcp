import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the transaction type interface
interface TransactionType {
  id: number;
  entityCode: string;
  customerType: string;
  tranCode: string;
  tranName: string;
  maxLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailyFreq: number;
  status: string;
  agentCommission: number;
  platformCommission: number;
  networkCommission: number;
  bankCommission: number;
  aggregatorCommission: number;
  serviceFee: number;
  groupCommission: null | number;
  charge: number;
  chargeType: string;
  otherCharge: number;
  tranChannel: string;
  roleAllowed: null | string;
  minLimit: number;
  sharingType: string;
  feeDetail: null | any;
  glCodeCommission: string;
  glCode: null | string;
  branchCode: string;
  tax: number;
  setupRefNo: string;
  feeTiers: null | any;
  commissionParties: null | any;
  minHardTokenLimit: number;
  maxHardTokenLimit: number;
  dailyHardTokenLimit: number;
  capLimit: number;
}

// Store interface
interface TransactionTypeState {
  transactionTypes: TransactionType[];
  setTransactionTypes: (data: TransactionType[]) => void;
  clearTransactionTypes: () => void;
}

// Create persisted store
export const useTransactionTypeStore = create<TransactionTypeState>()(
  persist(
    (set) => ({
      transactionTypes: [],
      setTransactionTypes: (transactionTypes) => set({ transactionTypes }),
      clearTransactionTypes: () => set({ transactionTypes: [] }),
    }),
    {
      name: 'transaction-types-storage', // key in localStorage
    }
  )
);
