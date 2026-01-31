import DailyWork from '@/components/work/DailyWork';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/work/DailyWork')({
  component: () => <DailyWork />,
});
