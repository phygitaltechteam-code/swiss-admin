import AddCommission from '@/components/comission/Addcomission';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';
export const Route = createFileRoute('/_app/client/updatecomission/$id')({
  component: () => <AddCommission />,
});
