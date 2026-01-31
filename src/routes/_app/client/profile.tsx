import ClientProfile from '@/components/Client/ClientProfile';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/client/profile')({
  component: () => <ClientProfile />,
});
