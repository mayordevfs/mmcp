// src/store/transactionTypeStore.ts
import { atom } from 'jotai';

// Define the TransactionType interface based on your payload structure
export interface TransactionType {
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
  groupCommission: number;
  charge: number;
  chargeType: string;
  otherCharge: number;
  tranChannel: string;
  roleAllowed: string;
  minLimit: number;
  sharingType: string;
  branchCode: string;
  capLimit: number;
  tax: number;
  setupRefNo: string;
  feeTiers: Array<Record<string, any>>;
}

// Default empty transaction type
const defaultTransactionType: TransactionType = {
  id: 0,
  entityCode: "",
  customerType: "",
  tranCode: "",
  tranName: "",
  maxLimit: 0,
  dailyLimit: 0,
  monthlyLimit: 0,
  dailyFreq: 0,
  status: "",
  agentCommission: 0,
  platformCommission: 0,
  networkCommission: 0,
  bankCommission: 0,
  aggregatorCommission: 0,
  serviceFee: 0,
  groupCommission: 0,
  charge: 0,
  chargeType: "",
  otherCharge: 0,
  tranChannel: "",
  roleAllowed: "",
  minLimit: 0,
  sharingType: "",
  branchCode: "",
  capLimit: 0,
  tax: 0,
  setupRefNo: "",
  feeTiers: [{}]
};

// Create atoms to manage transaction types
export const transactionTypesAtom = atom<TransactionType[]>([]);
export const selectedTransactionTypeAtom = atom<TransactionType>(defaultTransactionType);

// Atom to get transaction type by ID
export const getTransactionTypeByIdAtom = atom(
  null,
  (get, set, id: number) => {
    const transactionTypes = get(transactionTypesAtom);
    const found = transactionTypes.find(type => type.id === id);
    
    if (found) {
      set(selectedTransactionTypeAtom, found);
    } else {
      console.error(`Transaction type with ID ${id} not found`);
      set(selectedTransactionTypeAtom, defaultTransactionType);
    }
  }
);

// Atom for setting multiple transaction types (e.g., from API)
export const setTransactionTypesAtom = atom(
  null,
  (_, set, transactionTypes: TransactionType[]) => {
    set(transactionTypesAtom, transactionTypes);
  }
);

// Atom for updating a transaction type
export const updateTransactionTypeAtom = atom(
  null,
  (get, set, updatedType: TransactionType) => {
    const transactionTypes = get(transactionTypesAtom);
    const updated = transactionTypes.map(type => 
      type.id === updatedType.id ? updatedType : type
    );
    set(transactionTypesAtom, updated);
    set(selectedTransactionTypeAtom, updatedType);
  }
);

// Atom for adding a new transaction type
export const addTransactionTypeAtom = atom(
  null,
  (get, set, newType: TransactionType) => {
    const transactionTypes = get(transactionTypesAtom);
    set(transactionTypesAtom, [...transactionTypes, newType]);
  }
);

// Atom for deleting a transaction type
export const deleteTransactionTypeAtom = atom(
  null,
  (get, set, id: number) => {
    const transactionTypes = get(transactionTypesAtom);
    set(transactionTypesAtom, transactionTypes.filter(type => type.id !== id));
    
    // If the currently selected type is deleted, reset to default
    const selectedType = get(selectedTransactionTypeAtom);
    if (selectedType.id === id) {
      set(selectedTransactionTypeAtom, defaultTransactionType);
    }
  }
);