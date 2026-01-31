import EmpProjectWorkAssign from '@/components/Employee/EmpProjectWorkAssign';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/employee/projectwork')({
  component: () => <EmpProjectWorkAssign />,
});
