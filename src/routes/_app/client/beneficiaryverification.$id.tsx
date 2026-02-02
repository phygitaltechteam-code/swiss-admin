import BeneficiaryPage from '@/components/comission/BeneficiaryPage';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_app/client/beneficiaryverification/$id',
)({
  component: BeneficiaryPage,
});
