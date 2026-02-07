// @/lib/react-query/client.ts
import {api} from '@/utils/axios';
import {useQuery} from '@tanstack/react-query';

export const useGetClients = () => {
  return useQuery({
    queryKey: ['clients'],

    queryFn: async () => {
      const response = await api.get('/admin/customer');
      console.log('GET Client', response.data);
      return response.data;
    },
  });
};

export const useGetCustomerById = (id: string) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const response = await api.get(`/admin/customer/${id}`);
      console.log('GET Customer By ID', response.data);
      return response.data;
    },
    enabled: !!id, // prevents API call if id is undefined
  });
};
export const useGettransactionCustomerById = (id: string) => {
  return useQuery({
    queryKey: ['customerTransactions', id],
    queryFn: async () => {
      const response = await api.get(`/admin/transaction/customer/${id}`);
      console.log('GET Customer By ID', response.data);
      return response.data;
    },
    enabled: !!id, // prevents API call if id is undefined
  });
};
