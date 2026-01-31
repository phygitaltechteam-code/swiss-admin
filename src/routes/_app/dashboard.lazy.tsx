import {Calendar} from '@/components/common';
import Navbar from '@/components/common/Navbar';
import {createLazyFileRoute} from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_app/dashboard')({
  component: Navbar,
});
