import React from 'react';

export interface Transaction {
  id: string;
  date: string;
  time: string;
  sender: {
    name: string;
    account: string;
  };
  recipient: {
    name: string;
    account: string;
  };
  type: 'Credit' | 'Debit';
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  note: string;
}

export interface NavItem {
  label: string;
  icon: React.ElementType;
  isActive?: boolean;
  href?: string;
}

export interface StatMetric {
  title: string;
  value: string;
  trend: number; // percentage
  trendDirection: 'up' | 'down' | 'stable';
  trendLabel: string;
  icon: React.ElementType;
  type: 'success' | 'failed' | 'pending' | 'volume';
}
