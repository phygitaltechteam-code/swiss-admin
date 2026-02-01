import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  acceptTheCustomer,
  getAllCustomer,
  getCustomerById,
  rejectTheCustomer,
} from '../api/customer';
import toast from 'react-hot-toast';

export const useGetCustomer = () =>
  useQuery({
    queryKey: ['customer'],
    queryFn: () => getAllCustomer(),
  });

export const useGetCustomerById = (id: string) =>
  useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id),
  });

export const useAcceptCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acceptTheCustomer(id),

    onSuccess: () => {
      toast.success('Customer Accepted!');
      queryClient.invalidateQueries({queryKey: ['accept-customer']});
    },
    onError: () => {
      toast.error('Failed To Accept Customer!');
    },
  });
};

export const useRejectCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, note}: {id: string; note: string}) =>
      rejectTheCustomer(id, note),

    onSuccess: () => {
      toast.success('Customer Rejected!');
      queryClient.invalidateQueries({queryKey: ['reject-customer']});
    },
    onError: () => {
      toast.error('Failed To Reject Customer!');
    },
  });
};
