// types.ts
import React from 'react';

export interface Transaction {
  id: string;
  requestId: string;
  clientName: string;
  clientInitials: string;
  clientColor: string; // Tailwind color class for bg
  accountType: string;
  amount: number;
  date: string;
  paymentProof: {
    type: 'View' | 'Image' | 'PDF' | 'Missing';
    label: string;
  };
  status: 'Completed' | 'Pending' | 'Rejected';
}

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  subtext?: string;
  icon: React.ReactNode;
  highlightValue?: boolean;
  alert?: boolean;
}

// For table export
export interface TableExportData {
  headers: string[];
  rows: string[][];
  fileName: string;
}

export interface ExportData {
  id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  accountNumber: string;
  isActive: boolean;
  isVerified: boolean;
  isRejected: boolean;
  rejectedReason: string;
  foreignBeneficiariesCount: number;
  verifiedForeignCount: number;
}
