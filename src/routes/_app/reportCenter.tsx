import React from 'react';

import ReportPage from '@/pages/ReportPage';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/reportCenter')({
  component: () => <ReportPage />,
});
