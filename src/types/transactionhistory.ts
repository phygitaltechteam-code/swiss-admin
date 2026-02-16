// src/types/transaction-detail.ts

/* ================================
   User Type
================================ */
export interface User {
  fullname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  dob: string | null;
  isVerified: boolean;
  isRejected: boolean;
}

/* ================================
   Customer Type
================================ */
export interface Customer {
  id: string;
  userId: string;

  passport: string | null;
  aadharCard: string | null;
  panCard: string | null;

  passportNumber: string | null;
  aadharCardNumber: string | null;
  panCardNumber: string | null;

  accountNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  photo: string | null;
  securityPin: string;
  rejectedReason: string | null;

  createdAt: string;
  updatedAt: string;

  user: User;
}

/* ================================
   Beneficiary Type
================================ */
export interface Beneficiary {
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
  branchName: string;

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
}

/* ================================
   Transaction Type
================================ */
export type TransactionType = 'CREDIT' | 'DEBIT';

export interface TransactionDetail {
  id: string;
  walletId: string;

  particular: string;
  receiverId: string | null;
  senderId: string | null;
  beneficiaryId: string | null;

  amount: number;
  amountType: string;
  accountType: string;
  type: TransactionType;

  rejectReason: string | null;
  isPending: boolean;
  isRejected: boolean;

  // Wallet balances
  eprivateAccount: number;
  temporyAccount: number;

  createdAt: string;
  updatedAt: string;

  // Relations
  beneficiary?: Beneficiary | null;
  customer?: Customer | null;
}

/* ================================
   API Response Type
================================ */
export interface TransactionDetailResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: TransactionDetail;
  errors: any;
}

/* ================================
   Transaction Topup Type
================================ */
export interface TransactionTopup {
  id: string;
  transactionId: string;
  clientName: string;
  clientId: string;
  accountType: string;
  amount: number;
  date: string;
  rawDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  avatarUrl: string;
  trustScore: number;
  receiptUrl: string;
  referenceNo: string;
  paymentMethod: string;
  accountNo: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  isVerified?: boolean;
  fullname?: string;
  walletId?: string;
  amountType?: string;
  type?: 'CREDIT' | 'DEBIT';
  isPending?: boolean;
  isRejected?: boolean;
  createdAt?: string;
}

/* ================================
   Summary Stats Type
================================ */
export interface SummaryStats {
  totalPendingAmount: number;
  totalPendingGrowth: number;
  requestsToday: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}
