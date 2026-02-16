// utils/topupMapper.ts
import {TransactionTopup, SummaryStats} from '@/types/transactionhistory';

// Helper function to generate random avatar based on name
const generateAvatarUrl = (name: string, id: string): string => {
  const colors = [
    'https://picsum.photos/id/64/100/100',
    'https://picsum.photos/id/91/100/100',
    'https://picsum.photos/id/177/100/100',
    'https://picsum.photos/id/338/100/100',
    'https://picsum.photos/id/342/100/100',
  ];
  const index =
    (name.charCodeAt(0) + id.charCodeAt(id.length - 1)) % colors.length;
  return colors[index];
};

// Generate random trust score based on transaction history
const generateTrustScore = (transactions: any[]): number => {
  if (!transactions || transactions.length === 0) return 75;

  const totalTransactions = transactions.length;
  const recentTransactions = transactions.slice(0, 5); // Look at last 5 transactions

  let score = 75; // Base score

  // Increase score for more transactions
  if (totalTransactions > 10) score += 15;
  else if (totalTransactions > 5) score += 10;

  // Check for consistency in amounts (optional logic)
  const amounts = recentTransactions.map((tx) => tx.amount);
  const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const isConsistent = amounts.every(
    (amount) => Math.abs(amount - avgAmount) < avgAmount * 0.5,
  );

  if (isConsistent) score += 5;

  return Math.min(score, 100); // Cap at 100
};

// Generate payment method based on amount
const generatePaymentMethod = (amount: number): string => {
  if (amount > 10000) return 'Wire Transfer';
  if (amount > 5000) return 'Direct Bank Transfer (ACH)';
  if (amount > 1000) return 'Credit Card';
  return 'Crypto Transfer';
};

// Generate account number from wallet ID
const generateAccountNo = (walletId: string): string => {
  if (!walletId) return '0000';
  // Extract last 4 characters or use a hash
  return walletId.slice(-4).toUpperCase() || '0000';
};

// Generate reference number from transaction ID
const generateReferenceNo = (transactionId: string): string => {
  if (!transactionId) return 'REF-00000-XXX';
  const hash = transactionId.replace(/-/g, '').slice(0, 8).toUpperCase();
  const suffix = ['XYZ', 'ABC', 'DEF', 'GHI', 'JKL'][hash.charCodeAt(0) % 5];
  return `REF-${hash.slice(0, 5)}-${suffix}`;
};

// Generate account type based on API data
const generateAccountType = (apiTx: any): string => {
  if (apiTx.accountType === 'E_PRIVATEACCOUNT') return 'E Private';
  if (apiTx.accountType === 'TEMPORARY_ACCOUNT') return 'Temporarily';
  return 'Temporary';
};

// Map API transaction to TransactionTopup
export const mapApiToTransactionTopup = (apiTx: any): TransactionTopup => {
  const clientName =
    apiTx.fullname || apiTx.email?.split('@')[0] || 'Unknown Client';
  const clientId =
    apiTx.phoneNumber?.slice(-4) || apiTx.id?.slice(-4) || '0000';
  const accountType = generateAccountType(apiTx);

  return {
    id: apiTx.id,
    transactionId: `#TRX-${apiTx.id.slice(0, 4).toUpperCase()}`,
    clientName: clientName,
    clientId: clientId,
    accountType: accountType,
    amount: apiTx.amount || 0,
    date: formatDate(apiTx.createdAt || new Date().toISOString()),
    rawDate: new Date(apiTx.createdAt || Date.now()),
    status: getStatus(apiTx.isPending, apiTx.isRejected),
    avatarUrl: generateAvatarUrl(clientName, apiTx.id),
    trustScore: 85, // You can make this dynamic based on user history
    receiptUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
    referenceNo: generateReferenceNo(apiTx.id),
    paymentMethod: generatePaymentMethod(apiTx.amount),
    accountNo: generateAccountNo(apiTx.walletId),
    email: apiTx.email,
    phoneNumber: apiTx.phoneNumber,
    isActive: apiTx.isActive,
    isVerified: apiTx.isVerified,
    fullname: apiTx.fullname,
    walletId: apiTx.walletId,
    amountType: apiTx.amountType,
    type: apiTx.type,
    isPending: apiTx.isPending,
    isRejected: apiTx.isRejected,
    createdAt: apiTx.createdAt,
  };
};

// Calculate summary stats from transactions
export const calculateSummaryStats = (
  transactions: TransactionTopup[],
): SummaryStats => {
  const pendingTransactions = transactions.filter(
    (tx) => tx.status === 'Pending',
  );
  const approvedTransactions = transactions.filter(
    (tx) => tx.status === 'Approved',
  );
  const rejectedTransactions = transactions.filter(
    (tx) => tx.status === 'Rejected',
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requestsToday = transactions.filter((tx) => {
    const txDate = tx.rawDate;
    return txDate >= today;
  }).length;

  return {
    totalPendingAmount: pendingTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0,
    ),
    totalPendingGrowth: 12, // You can calculate this based on previous day/week
    requestsToday: requestsToday,
    pendingCount: pendingTransactions.length,
    approvedCount: approvedTransactions.length,
    rejectedCount: rejectedTransactions.length,
  };
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `Today, ${date
        .toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
        .toLowerCase()}`;
    } else if (diffInDays === 1) {
      return `Yesterday, ${date
        .toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
        .toLowerCase()}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  } catch (error) {
    return 'Invalid date';
  }
};

// Helper function to determine status
const getStatus = (
  isPending?: boolean,
  isRejected?: boolean,
): 'Pending' | 'Approved' | 'Rejected' => {
  if (isRejected) return 'Rejected';
  if (isPending === false) return 'Approved';
  return 'Pending'; // Default to Pending if isPending is true or undefined
};
