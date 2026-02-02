import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  acceptBeneficiary,
  getAllBeneficiary,
  getBeneficiaryByCustomer,
  rejectBeneficiary,
} from '../api/beneficiary';
import toast from 'react-hot-toast';

export const useGetBeneficiary = () =>
  useQuery({
    queryKey: ['beneficiary'],
    queryFn: () => getAllBeneficiary(),
  });

export const useGetBeneficiaryByCustomer = (id: string) =>
  useQuery({
    queryKey: ['beneficiary', id],
    queryFn: () => getBeneficiaryByCustomer(id),
  });

export const useAcceptBeneficiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acceptBeneficiary(id),

    onSuccess: () => {
      toast.success('Beneficiary Accepted!');
      queryClient.invalidateQueries({queryKey: ['beneficiary']});
    },
    onError: () => {
      toast.error('Failed To Accept beneficiary!');
    },
  });
};

export const useRejectBeneficiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, note}: {id: string; note: string}) =>
      rejectBeneficiary(id, note),

    onSuccess: () => {
      toast.success('Beneficiary rejected!');
      queryClient.invalidateQueries({queryKey: ['beneficiary']});
    },
    onError: () => {
      toast.error('Failed To Reject beneficiary!');
    },
  });
};
