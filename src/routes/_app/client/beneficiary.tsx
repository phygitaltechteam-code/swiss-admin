import BeneficiaryContent from '@/components/comission/Beneficiary';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_app/client/beneficiary')({
  component: BeneficiaryContent,
});
