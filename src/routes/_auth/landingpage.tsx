import LandingPage from '@/website/Landingpage';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';
export const Route = createFileRoute('/_auth/landingpage')({
  component: LandingPage,
});
