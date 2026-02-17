// lib/react-query/transfer.ts
import {api} from '@/utils/axios';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {TransactionTransfer, SummaryStats} from '@/types/transactionhistory';
import toast from 'react-hot-toast';

// Updated interfaces to match your API response
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
  dob?: string | null;
  beneficiary?: {
    id: string;
    customerId: string;
    fullName: string;
    country: string;
    currency: string;
    accountNumber: string;
    accountType: string;
    SWIFTBIC: string;
    IFSC: string;
    bankName: string;
    address: string;
    city: string;
    state: string;
    bankCountry: string;
    pincode: string;
    relationship: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    rejectReason: string | null;
    isVerified: boolean;
    isRejected: boolean;
    createdAt: string;
    updatedAt: string;
  };
  customer?: {
    aadharCard: string;
  };
}

export const useGetPendingTransfers = () => {
  return useQuery({
    queryKey: ['transfer-transactions'],
    queryFn: async (): Promise<{
      transactions: TransactionTransfer[];
      stats: SummaryStats;
      rawData?: any;
    }> => {
      try {
        const response = await api.get('/admin/transaction/pending/transfer');
        console.log('Transfer API Response:', response.data);

        // Your API returns: {statusCode, status, message, data, errors}
        // Where data is an array of transactions
        const apiData = response.data;

        let transactionsArray: ApiTransaction[] = [];

        if (apiData && apiData.data && Array.isArray(apiData.data)) {
          // Normal case: data is an array
          transactionsArray = apiData.data;
        } else if (apiData && Array.isArray(apiData)) {
          // Fallback: the entire response is an array
          transactionsArray = apiData;
        } else if (
          apiData &&
          apiData.transactions &&
          Array.isArray(apiData.transactions)
        ) {
          // Another pattern: transactions array at root
          transactionsArray = apiData.transactions;
        } else {
          console.warn('Unexpected API response format:', apiData);
          transactionsArray = [];
        }

        console.log('Extracted transfer transactions:', transactionsArray);

        const mappedTransactions = transactionsArray.map(
          mapApiToTransactionTransfer,
        );
        const stats = calculateSummaryStats(mappedTransactions);

        return {
          transactions: mappedTransactions,
          stats: stats,
          rawData: response.data,
        };
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || 'Failed to get transfer data';
        console.error('Transfer API Error:', error);
        toast.error(errorMessage);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Map API response to TransactionTransfer
const mapApiToTransactionTransfer = (
  apiTransaction: ApiTransaction,
): TransactionTransfer => {
  // Determine status based on API flags
  let status: TransactionTransfer['status'] = 'Pending';
  if (apiTransaction.isRejected) {
    status = 'Rejected';
  } else if (!apiTransaction.isPending && !apiTransaction.isRejected) {
    status = 'Approved';
  }

  // Format date
  const date = apiTransaction.createdAt
    ? new Date(apiTransaction.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return {
    id: apiTransaction.id,
    walletId: apiTransaction.walletId,
    particular: apiTransaction.particular,
    receiverId: apiTransaction.receiverId,
    senderId: apiTransaction.senderId,
    beneficiaryId: apiTransaction.beneficiaryId,
    amount: apiTransaction.amount,
    amountType: apiTransaction.amountType,
    accountType: apiTransaction.accountType,
    type: apiTransaction.type,
    rejectReason: apiTransaction.rejectReason,
    isPending: apiTransaction.isPending,
    isRejected: apiTransaction.isRejected,
    createdAt: apiTransaction.createdAt,
    updatedAt: apiTransaction.updatedAt,
    fullname: apiTransaction.fullname,
    email: apiTransaction.email,
    phoneNumber: apiTransaction.phoneNumber,
    isActive: apiTransaction.isActive,
    isVerified: apiTransaction.isVerified,
    dob: apiTransaction.dob,
    beneficiaryDetails: apiTransaction.beneficiary,
    customer: apiTransaction.customer,
    // beneficiary: apiTransaction.beneficiary,
    // UI specific fields
    senderName: apiTransaction.fullname || 'Unknown Sender',
    beneficiary: apiTransaction.beneficiary?.fullName || 'Unknown Beneficiary',
    date: date,
    status: status,
    senderAvatar: undefined,
  };
};

// Calculate summary statistics
const calculateSummaryStats = (
  transactions: TransactionTransfer[],
): SummaryStats => {
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );
  const pendingCount = transactions.filter(
    (t) => t.isPending && !t.isRejected,
  ).length;
  const rejectedCount = transactions.filter((t) => t.isRejected).length;
  const approvedCount = transactions.filter(
    (t) => !t.isPending && !t.isRejected,
  ).length;

  return {
    totalTransactions,
    totalAmount,
    pendingCount,
    rejectedCount,
    approvedCount,
  };
};

// FIXED: Single transaction by ID hook
export const useGetTransferById = (id?: string) => {
  return useQuery({
    queryKey: ['transfer-transaction', id],
    queryFn: async (): Promise<TransactionTransfer | null> => {
      if (!id) return null;

      try {
        console.log('Fetching transaction with ID:', id);

        // Try the specific transaction endpoint first
        try {
          const response = await api.get(`/admin/transaction/${id}`);
          console.log('Single transaction response:', response.data);

          // Check the structure of the response
          const responseData = response.data;

          let transactionData: ApiTransaction | null = null;

          // Case 1: Response has a data property (nested structure)
          if (
            responseData &&
            responseData.data &&
            typeof responseData.data === 'object'
          ) {
            transactionData = responseData.data;
          }
          // Case 2: Response is the transaction object directly
          else if (responseData && responseData.id) {
            transactionData = responseData;
          }
          // Case 3: Response has status wrapper but data is not nested
          else if (responseData && typeof responseData === 'object') {
            // Try to find the transaction in the response
            if (responseData.id) {
              transactionData = responseData;
            }
          }

          if (transactionData) {
            console.log('Found transaction:', transactionData);
            return mapApiToTransactionTransfer(transactionData);
          }
        } catch (singleError: any) {
          console.warn(
            'Single transaction endpoint failed:',
            singleError.message,
          );

          // If it's a 404, try the pending endpoint
          if (singleError.response?.status === 404) {
            console.log(
              'Single endpoint returned 404, trying pending transfers...',
            );
          } else {
            throw singleError;
          }
        }

        // Fallback: Try to find in pending transfers
        try {
          const response = await api.get('/admin/transaction/pending/transfer');
          const apiData = response.data;

          let transactionsArray: ApiTransaction[] = [];

          if (apiData && apiData.data && Array.isArray(apiData.data)) {
            transactionsArray = apiData.data;
          } else if (apiData && Array.isArray(apiData)) {
            transactionsArray = apiData;
          }

          const transaction = transactionsArray.find((t) => t.id === id);
          if (transaction) {
            console.log('Found transaction in pending transfers:', transaction);
            return mapApiToTransactionTransfer(transaction);
          }
        } catch (pendingError) {
          console.warn('Pending transfers endpoint failed:', pendingError);
        }

        // Try all transactions endpoint as last resort
        try {
          const response = await api.get('/admin/transactions/transfer');
          const apiData = response.data;

          let transactionsArray: ApiTransaction[] = [];

          if (apiData && apiData.data && Array.isArray(apiData.data)) {
            transactionsArray = apiData.data;
          } else if (apiData && Array.isArray(apiData)) {
            transactionsArray = apiData;
          }

          const transaction = transactionsArray.find((t) => t.id === id);
          if (transaction) {
            console.log('Found transaction in all transfers:', transaction);
            return mapApiToTransactionTransfer(transaction);
          }
        } catch (allError) {
          console.warn('All transfers endpoint failed:', allError);
        }

        // If we get here, the transaction wasn't found
        throw new Error(
          `Transaction with ID "${id}" not found. It may have been processed or deleted.`,
        );
      } catch (error: any) {
        console.error('Transfer detail error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });

        const errorMessage =
          error?.response?.data?.message ||
          error.message ||
          'Failed to get transfer details';

        toast.error(errorMessage);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Export mutations for approve/reject
export const useApproveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/admin/transaction/accept/transfer/${id}`);
      return res.data;
    },
    onSuccess: (data: any, transactionId: string) => {
      // Invalidate both queries
      queryClient.invalidateQueries({queryKey: ['transfer-transactions']});
      queryClient.invalidateQueries({
        queryKey: ['transfer-transaction', transactionId],
      });

      toast.success(data.message || 'Transfer approved successfully');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Failed to approve transfer';
      toast.error(errorMessage);
    },
  });
};

export const useRejectTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, note}: {id: string; note: string}) => {
      const res = await api.put(`/admin/transaction/reject/transfer/${id}`, {
        note,
      });
      return res.data;
    },
    onSuccess: (data: any, variables: {id: string; note: string}) => {
      // Invalidate both queries
      queryClient.invalidateQueries({queryKey: ['transfer-transactions']});
      queryClient.invalidateQueries({
        queryKey: ['transfer-transaction', variables.id],
      });

      toast.success(data.message || 'Transfer rejected successfully');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Failed to reject transfer';
      toast.error(errorMessage);
    },
  });
};

export const useGetAllTransactions = () => {
  return useQuery({
    queryKey: ['transfer-transactions'],
    queryFn: async () => {
      const res = await api.get('/admin/transaction');
      return res.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
