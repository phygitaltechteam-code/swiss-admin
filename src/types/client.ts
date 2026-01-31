import React from 'react';

export interface Client {
  id: string;
  accountNumber: string;
  name: string;
  mobile: string;
  totalTrans: number;
  transVolume: number;
  privateBalance: number;
  tempBalance: number;
  isActive: boolean;
}

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}
