import CreateProjectWork from '@/components/work/CreateProjectWork';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/work/CreateWork')({
  component: () => <CreateProjectWork />,
});
