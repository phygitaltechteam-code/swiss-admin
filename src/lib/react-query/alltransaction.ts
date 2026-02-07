// alltransaction.ts - Updated hook
import {api} from '@/utils/axios';
import {useQuery} from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface TransactionResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: Transaction[];
  errors: null;
}

interface Transaction {
  id: string;
  walletId: string;
  particular: string;
  receiverId: string | null;
  senderId: string;
  beneficiaryId: string | null;
  amount: number;
  amountType: string;
  accountType: 'E_PRIVATEACCOUNT' | 'E_TEMPORYACCOUNT';
  type: 'CREDIT' | 'DEBIT';
  rejectReason: string | null;
  isPending: boolean;
  isRejected: boolean;
  createdAt: string;
  updatedAt: string;
  beneficiary: {
    id: string;
    customerId: string;
    fullName: string;
    accountNumber: string;
  } | null;
  fullname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  dob: string;
  isVerified: boolean;
}

export const useGetAllTransaction = () => {
  return useQuery<TransactionResponse>({
    queryKey: ['get-all-transactions'],
    queryFn: getallTransaction,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const getallTransaction = async (): Promise<TransactionResponse> => {
  try {
    const res = await api.get('admin/transaction');
    console.log('API Response:', res.data); // Debug
    return res.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to get transactions');
    throw error;
  }
};
