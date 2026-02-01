import {useQuery} from '@tanstack/react-query';
import {getAllCustomer, getCustomerById} from '../api/customer';

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
