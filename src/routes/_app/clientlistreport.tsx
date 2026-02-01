import React from 'react';
import ClientListReport from '@/pages/ClientListReport';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/clientlistreport')({
  component: () => <ClientListReport />,
});
