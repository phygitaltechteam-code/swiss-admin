import Addcomission from '@/components/comission/Addcomission';
import {createFileRoute} from '@tanstack/react-router';
import React from 'react';
import {z} from 'zod';

const searchSchema = z.object({
  editData: z.string().optional(),
});

export const Route = createFileRoute('/_app/client/addcommision')({
  component: () => <Addcomission />,
  validateSearch: (search) => searchSchema.parse(search),
});
