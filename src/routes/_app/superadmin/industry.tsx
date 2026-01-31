import Industry from '@/components/superadmin/admin/Industry';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_app/superadmin/industry')({
  component: () => <Industry />,
});
