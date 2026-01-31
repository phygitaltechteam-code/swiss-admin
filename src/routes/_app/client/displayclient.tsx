import ClientDisplay from '@/components/Client/ClientDisplayPage';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/client/displayclient')({
  component: () => <ClientDisplay />,
});
