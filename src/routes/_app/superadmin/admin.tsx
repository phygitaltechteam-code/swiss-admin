import CreateAdmin from '@/components/superadmin/admin/CreateAdmin';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/superadmin/admin')({
  component: () => <CreateAdmin />,
});
