import React from 'react';

export type TransferStatus =
  | 'Completed'
  | 'Pending'
  | 'Failed'
  | 'Under Review';

export interface Transfer {
  id: string;
  date: string;
  time: string;
  transferId: string;
  senderName: string;
  senderAccount: string;
  beneficiaryName: string;
  beneficiaryLocation: string;
  bankName: string;
  swiftIban: string;
  amount: number;
  fee: number;
  status: TransferStatus;
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}
