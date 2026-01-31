import Calendar from '@/components/projects/DummuCalender';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/company/dummy')({
  component: () => <Calendar />,
});
