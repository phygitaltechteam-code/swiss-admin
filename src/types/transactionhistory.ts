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
