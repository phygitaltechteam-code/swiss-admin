import RegistrationReview from '@/components/approval/RegistractionReview';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/Approval/registrationDetails/$id')({
  component: () => <RegistrationReview />,
});
