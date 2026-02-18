import ViewBeneficiary from '@/components/comission/ViewBeneficiary';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';
export const Route = createFileRoute('/_app/client/viewbeneficiary/$id')({
  component: () => <ViewBeneficiary />,
});
