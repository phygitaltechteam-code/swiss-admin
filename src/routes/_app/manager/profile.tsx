import ProfilePage from '@/pages/manager/ProfilePage';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/manager/profile')({
  component: ProfilePage,
});
