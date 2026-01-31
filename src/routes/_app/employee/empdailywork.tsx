import EmpDailyWork from '@/components/Employee/EmpDailyWork';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/employee/empdailywork')({
  component: () => <EmpDailyWork />,
});
