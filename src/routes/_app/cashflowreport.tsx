import React from 'react';
import CashflowReport from '@/pages/CashflowReport';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/cashflowreport')({
  component: () => <CashflowReport />,
});
