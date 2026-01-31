import React from 'react';

import TransactionReport from '@/pages/TransactionReport';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/transactionReport')({
  component: () => <TransactionReport />,
});
