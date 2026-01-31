import React from 'react';

import WalletReport from '@/pages/WalletReport';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/wallettopupreport')({
  component: () => <WalletReport />,
});
