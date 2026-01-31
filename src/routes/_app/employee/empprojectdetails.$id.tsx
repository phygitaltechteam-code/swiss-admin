import EmpProjectDetails from '@/components/Employee/empProjectDetails';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/employee/empprojectdetails/$id')({
  component: () => <EmpProjectDetails />,
});
