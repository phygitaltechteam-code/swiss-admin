import React from 'react';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarInitials: string;
  avatarColor: 'blue' | 'purple' | 'orange' | 'teal' | 'red';
  totalAssets: number;
  privateAssets: string;
  tempAssets: string;
  registrationDate: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Closed';
}

export interface StatMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  timeframe: string;
  icon: React.ElementType;
  colorClass: string; // Tailwind class for text color
}
