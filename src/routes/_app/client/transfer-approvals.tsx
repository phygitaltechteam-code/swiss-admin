import {TransferDashboard} from '@/components/transfer/TransferDashboard';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/client/transfer-approvals')({
  component: () => <TransferDashboard />,
});
