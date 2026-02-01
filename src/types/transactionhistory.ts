import {IconType} from 'react-icons';

export interface Transaction {
  id: string;
  date: string;
  time: string;
  recipient: string;
  type: 'Deposit' | 'Payment' | 'Transfer' | 'Withdrawal';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface NavItem {
  label: string;
  icon: IconType;
  isActive?: boolean;
}

export interface TransactionTransfer {
  id: string;
  senderName: string;
  senderAvatar: string;
  beneficiary: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Payment Completed';
  bank?: string;
  swift?: string;
}

export interface StatCardProps {
  label: string;
  value: string;
  subValue: string;
  subValueColor?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

export type TransactionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Transaction {
  id: string;
  transactionId: string;
  clientName: string;
  clientId: string;
  accountType: 'E Private' | 'Temporarily' | 'Standard';
  amount: number;
  date: string; // ISO string or formatted string for display
  rawDate: Date;
  status: TransactionStatus;
  avatarUrl: string;
  trustScore: number;
  receiptUrl: string;
  referenceNo: string;
  paymentMethod: string;
  accountNo: string;
}

export interface SummaryStats {
  totalPendingAmount: number;
  totalPendingGrowth: number;
  requestsToday: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export type TransactionTopupStatus = 'Pending' | 'Approved' | 'Rejected';

export interface TransactionTopup {
  id: string;
  transactionId: string;
  clientName: string;
  clientId: string;
  accountType: 'E Private' | 'Temporarily' | 'Standard';
  amount: number;
  date: string; // ISO string or formatted string for display
  rawDate: Date;
  status: TransactionStatus;
  avatarUrl: string;
  trustScore: number;
  receiptUrl: string;
  referenceNo: string;
  paymentMethod: string;
  accountNo: string;
}

export interface SummaryStats {
  totalPendingAmount: number;
  totalPendingGrowth: number;
  requestsToday: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}
