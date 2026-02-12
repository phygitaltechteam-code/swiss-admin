import {createFileRoute} from '@tanstack/react-router';
import CommissionTable from '../../../components/comission/CommissionTable';
import {COMMISSIONS} from '../../../components/comission/constant';
import React from 'react';

export const Route = createFileRoute('/_app/client/comission')({
  component: () => <CommissionTable />,
});
