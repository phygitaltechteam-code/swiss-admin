import DisplayDepartmentWork from '@/components/work/DisplayDepartmentWork';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/project/departmentwork')({
  component: () => <DisplayDepartmentWork />,
});
