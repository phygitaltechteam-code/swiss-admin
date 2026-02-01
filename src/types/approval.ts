import React from 'react';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

type User = {
  fullname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  dob: string | null;
  isVerified: boolean;
  isRejected: boolean;
};

export type UserRequest = {
  id: string;
  userId: string;
  passport: string | null;
  aadharCard: string | null;
  panCard: string | null;
  passportNumber: string | null;
  aadharCardNumber: string | null;
  panCardNumber: string | null;
  nationality: string;
  SWIFTBIC: string;
  accountNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  photo: string;
  securityPin: string;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
};

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
}
