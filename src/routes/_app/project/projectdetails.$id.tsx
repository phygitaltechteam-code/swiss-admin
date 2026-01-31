import ProjectDetails from '@/components/projects/ProjectDetails';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/project/projectdetails/$id')({
  component: () => <ProjectDetails />,
});
