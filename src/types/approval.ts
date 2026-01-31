import React from 'react';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface UserRequest {
  id: string;
  name: string;
  email: string;
  caseId: string;
  regDate: string;
  status: RequestStatus;
  avatarUrl: string;
  address: string;
  docName: string;
  docNumber: string;
  docImageUrl: string;
  rejectionReason?: string;
  needsReview?: boolean;
  assignedToYou?: boolean;
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
}
