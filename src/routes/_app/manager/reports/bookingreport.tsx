import BookingReport from '@/components/Manager/reports/BookingReport';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/manager/reports/bookingreport')({
  component: () => <BookingReport />,
});
