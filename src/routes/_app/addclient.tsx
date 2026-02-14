import MainPageClient from '@/components/addclient/MainPageClient';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';
export const Route = createFileRoute('/_app/addclient')({
  component: () => <MainPageClient />,
});
