import AddProject from '@/components/projects/AddProject';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/project/createproject')({
  component: () => <AddProject />,
});
