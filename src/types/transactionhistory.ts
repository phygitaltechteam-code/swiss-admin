// types/transactionhistory.ts
export interface TransactionTransfer {
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

  // UI specific fields
  senderName?: string;
  beneficiary?: string;
  beneficiaryDetails?: {
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
  date?: string;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Payment Completed';
  senderAvatar?: string;
}

export interface SummaryStats {
  totalTransactions: number;
  totalAmount: number;
  pendingCount: number;
  rejectedCount: number;
  approvedCount: number;
}

export interface ApiResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: TransactionTransfer[];
  errors: null;
}
