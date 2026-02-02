import CustomerRegisterApprove from '@/pages/CustomerRegisterApprove';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/Approval/customerregisterapprove')({
  component: () => <CustomerRegisterApprove />,
});
