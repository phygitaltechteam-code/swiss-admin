import React from 'react';

import TransfersPage from '@/pages/TransfersPage';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/transfersReport')({
  component: () => <TransfersPage />,
});
