import {TransferDetails} from '@/components/transfer/TransferDetails';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/client/transferview')({
  component: () => <TransferDetails />,
});
