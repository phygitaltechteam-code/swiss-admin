import {createFileRoute} from '@tanstack/react-router';
import React from 'react';
export const Route = createFileRoute('/_app/company/position')({
  component: () => <div>Hello /_app/company/position!</div>,
});
