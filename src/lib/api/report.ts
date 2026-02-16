import {api} from '@/utils/axios';
import {useQuery} from '@tanstack/react-query';

export const useGetBeneficiaries = () =>
  useQuery({
    queryKey: ['get-beneficiaries'],
    queryFn: () => getBeneficiaries(),
  });

const getBeneficiaries = async () => {
  try {
    const response = await api.get(`/admin/beneficiary/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};
