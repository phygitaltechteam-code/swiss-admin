import AdminDashDailyWorkDetails from '@/components/work/AdminDashDailyWorkDetails';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/company/dailyworkdetails/$id')({
  component: () => <AdminDashDailyWorkDetails />,
});
