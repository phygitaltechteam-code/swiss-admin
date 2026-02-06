import {api} from '@/utils/axios';
import {useQuery} from '@tanstack/react-query';

export const useGetFlowRange = () =>
  useQuery({
    queryKey: ['cashflow-range'],
    queryFn: async () => {
      const response = await api.get('admin/transaction/cash-flow/graphs');
      // console.log('GETDATATAREREREWR', response.data);
      return response;
    },
  });
export const useGettransaction = () =>
  useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.get('admin/transaction');
      console.log('GETDATATAREREREWR', response.data);
      return response;
    },
  });
