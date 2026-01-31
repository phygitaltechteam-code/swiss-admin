import CreateEmployee from '@/components/Employee/CreateEmployee';
import ManageEmployee from '@/components/Employee/ManageEm-ployee';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/employee/CreateEmp')({
  component: () => <CreateEmployee />,
});
