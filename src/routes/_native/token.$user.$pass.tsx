import TokenPage from '@/pages/TokenPage';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_native/token/$user/$pass')({
  component: TokenPage,
});
