import AdminDashProWorkDetails from '@/components/work/AdminDashProWorkDetails';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/company/proworkdetails/$id')({
  component: () => <AdminDashProWorkDetails />,
});
