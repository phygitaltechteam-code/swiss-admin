import LandingPage from '@/website/Landingpage';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/landingpage')({
  component: LandingPage,
});
