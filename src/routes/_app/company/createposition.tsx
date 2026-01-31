import CreatePostion from '@/components/Company/CreatePostion';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/company/createposition')({
  component: () => <CreatePostion />,
});
