import {createFileRoute} from '@tanstack/react-router';
import MainWithdrawPage from '@/components/topupwithdraw/MainWithdaraw';

export const Route = createFileRoute('/_app/withdrawpage')({
  component: MainWithdrawPage,
});
