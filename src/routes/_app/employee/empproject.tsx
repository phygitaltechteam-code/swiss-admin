import EmpProject from '@/components/Employee/EmpProject';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/employee/empproject')({
  component: () => <EmpProject />,
});
