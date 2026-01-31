import ProjectWorkReview from '@/components/Employee/ProjectWorkReview';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/employee/projectworkreview/$id')({
  component: () => <ProjectWorkReview />,
});
