import MainTopupPage from '@/components/topup/MainTopupPage';
import {TopUpList} from '@/components/topup/TopUpList';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';
export const Route = createFileRoute('/_app/client/topup-approvals')({
  component: () => <MainTopupPage />,
});
