import React from 'react';

import AllTransaction from '@/pages/AllTransaction';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/alltransaction')({
  component: () => <AllTransaction />,
});
