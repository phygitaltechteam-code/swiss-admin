import EmpAttendace from '@/components/Company/EmpAttendace';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/company/empattendance/$id')({
  component: () => <EmpAttendace />,
});
