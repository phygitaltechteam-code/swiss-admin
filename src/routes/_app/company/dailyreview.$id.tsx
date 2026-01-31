import CompanyDailyReviewEach from '@/components/Review/CompanyDailyReviewEach';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/company/dailyreview/$id')({
  component: () => <CompanyDailyReviewEach />,
});
