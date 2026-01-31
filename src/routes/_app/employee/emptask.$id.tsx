import EmployeeTask from '@/components/Employee/EmployeeTask';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';
export const Route = createFileRoute('/_app/employee/emptask/$id')({
  component: () => <EmployeeTask />,
});
