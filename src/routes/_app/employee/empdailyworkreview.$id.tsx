import EmpDailyTsaskReview from '@/components/Employee/EmpDailyTsaskReview';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/employee/empdailyworkreview/$id')({
  component: () => <EmpDailyTsaskReview />,
});
