import SerialIndex from '@/components/Manager/SerialIndex';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/manager/occassion/$id')({
  component: SerialIndex,
});
