// api/topup.ts
import {api} from '@/utils/axios';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {SummaryStats, TransactionTopup} from '@/types/transactionhistory';
import toast from 'react-hot-toast';
import {
  calculateSummaryStats,
  mapApiToTransactionTopup,
} from '@/utils/transactiontopup';

interface ApiTransaction {
  id: string;
  walletId: string;
  particular: string;
  receiverId: string | null;
  senderId: string | null;
  beneficiaryId: string | null;
  amount: number;
  amountType: string;
  accountType: string;
  type: 'CREDIT' | 'DEBIT';
  rejectReason: string | null;
  isPending: boolean;
  isRejected: boolean;
  createdAt: string;
  updatedAt: string;
  fullname?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

interface ApiResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    transactions: ApiTransaction[];
    wallet?: {
      id: string;
      eprivateAccount: number;
      temporyAccount: number;
    };
  };
  errors: null;
}

interface ApproveTopupResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    transaction: any;
    // Add other response fields as needed
  };
  errors: null;
}

type RejectTopupPayload = {
  id: string; // This matches what the API expects in the URL parameter
  note: string; // This matches what the API expects in the body
};
export const useGetTopup = () => {
  return useQuery({
    queryKey: ['topup-transactions-all'],
    queryFn: async () => {
      const response = await api.get(`/admin/transaction/topup`);
      // console.log('GET Client', response.data);

      const apiData = response.data.data || response.data;
      let transactionsArray: ApiTransaction[] = [];

      if (Array.isArray(apiData)) {
        transactionsArray = apiData;
      } else if (apiData.transactions && Array.isArray(apiData.transactions)) {
        transactionsArray = apiData.transactions;
      } else {
        transactionsArray = findTransactionsInResponse(response.data);
      }

      console.log('Extracted transactions:', transactionsArray);

      const mappedTransactions = transactionsArray.map(
        mapApiToTransactionTopup,
      );
      const stats = calculateSummaryStats(mappedTransactions);

      return {
        transactions: mappedTransactions,
        stats: stats,
        rawData: response.data,
      };
    },
  });
};
export const useGetTopupApproved = () => {
  return useQuery({
    queryKey: ['topup-transactions'],
    queryFn: async (): Promise<{
      transactions: TransactionTopup[];
      stats: SummaryStats;
      rawData?: any;
    }> => {
      try {
        const response = await api.get('/admin/transaction/pending/topup');
        console.log('Topup API Response:', response.data);

        const apiData = response.data.data || response.data;
        let transactionsArray: ApiTransaction[] = [];

        if (Array.isArray(apiData)) {
          transactionsArray = apiData;
        } else if (
          apiData.transactions &&
          Array.isArray(apiData.transactions)
        ) {
          transactionsArray = apiData.transactions;
        } else {
          transactionsArray = findTransactionsInResponse(response.data);
        }

        console.log('Extracted transactions:', transactionsArray);

        const mappedTransactions = transactionsArray.map(
          mapApiToTransactionTopup,
        );
        const stats = calculateSummaryStats(mappedTransactions);

        return {
          transactions: mappedTransactions,
          stats: stats,
          rawData: response.data,
        };
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || 'Failed to get topup data';
        console.error('Topup API Error:', error);
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
  });
};

// Approve Topup Mutation
export const useApproveTopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/admin/transaction/accept/topup/${id}`);
      return res.data;
    },
    onSuccess: (_, transactionId) => {
      // 🔥 Update list cache
      queryClient.setQueryData(['topup-transactions'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          transactions: old.transactions.map((t: any) =>
            t.id === transactionId ? {...t, status: 'Approved'} : t,
          ),
        };
      });
    },
  });
};

// Reject Topup Mutation (optional - if you need it later)
export const useRejectTopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, note}: {id: string; note: string}) => {
      const res = await api.put(`/admin/transaction/reject/topup/${id}`, {
        note,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['topup-transactions'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          transactions: old.transactions.map((t: any) =>
            t.id === variables.id
              ? {...t, status: 'Rejected', rejectReason: variables.note}
              : t,
          ),
        };
      });
    },
  });
};
export const useGettransactionbyId = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const response = await api.get(`/admin/transaction/${transactionId}`);
      // console.log('GET Client', response.data);
      return response.data;
    },
  });
};

// Helper function to find transactions in nested response
const findTransactionsInResponse = (data: any): ApiTransaction[] => {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.filter(
      (item) => item && typeof item === 'object' && 'amount' in item,
    );
  }

  const possibleKeys = ['transactions', 'data', 'items', 'results', 'list'];

  for (const key of possibleKeys) {
    if (data[key] && Array.isArray(data[key])) {
      return data[key].filter(
        (item: any) => item && typeof item === 'object' && 'amount' in item,
      );
    }
  }

  const findNestedArray = (obj: any): any[] => {
    if (Array.isArray(obj)) {
      return obj.filter(
        (item) => item && typeof item === 'object' && 'amount' in item,
      );
    }

    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        const result = findNestedArray(obj[key]);
        if (result.length > 0) {
          return result;
        }
      }
    }

    return [];
  };

  return findNestedArray(data);
};
