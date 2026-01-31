import Attendance from '@/components/Company/Attendance';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/company/Attendance')({
  component: () => <Attendance />,
});
