import ReviewWrapper from '@/components/Review/ReviewWrapper';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/company/review')({
  component: () => <ReviewWrapper />,
});
