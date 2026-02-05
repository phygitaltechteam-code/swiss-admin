// In @/types/client.ts
import {React} from 'react';
export interface Client {
  id: string;
  accountNumber: string;
  name: string;
  mobile: string;
  email: string;
  totalTrans: number;
  transVolume: number;
  privateBalance: number;
  tempBalance: number;
  isActive: boolean;

  // Additional fields from API
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  photo?: string;
  passport?: string | null;
  aadharCard?: string | null;
  panCard?: string | null;
  isVerified?: boolean;
  isRejected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
