import CompanyProWorkEach from '@/components/Review/CompanyProWorkEach';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/company/projectreview/$id')({
  component: () => <CompanyProWorkEach />,
});
