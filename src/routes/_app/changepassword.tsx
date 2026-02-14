import ChangePassword from '@/components/Profilehub/ChangePassword';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';
export const Route = createFileRoute('/_app/changepassword')({
  component: () => <ChangePassword />,
});
