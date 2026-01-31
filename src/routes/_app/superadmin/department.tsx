import Department from '@/components/superadmin/admin/Department';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/superadmin/department')({
  component: () => <Department />,
});
