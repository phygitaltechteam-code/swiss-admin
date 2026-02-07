import TransactionHistoryPage from '@/components/TransactionHistory/TransactionHistoryPage';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/client/transactionhistory/$id')({
  component: () => <TransactionHistoryPage />,
});
