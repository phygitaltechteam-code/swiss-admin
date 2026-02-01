import React from 'react';
import BeneficiaryPage from '@/pages/BeneficiaryPage';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/beneficiaryreport')({
  component: () => <BeneficiaryPage />,
});
