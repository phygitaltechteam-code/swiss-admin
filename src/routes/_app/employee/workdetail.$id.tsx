import WorkDetailsPage from '@/components/Employee/WorkDetailsPage';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/employee/workdetail/$id')({
  component: () => <WorkDetailsPage />,
});
