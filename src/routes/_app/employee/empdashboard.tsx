import EmpDashboard from '@/components/Employee/EmpDashboard';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/employee/empdashboard')({
  component: () => <EmpDashboard />,
});
