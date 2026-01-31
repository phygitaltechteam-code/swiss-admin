import {api} from '@/utils/axios';
import {useQuery} from '@tanstack/react-query';

//Get Client by FunctionID
export const getClientById = async (occId: string) => {
  try {
    const response = await api.get(`admin/client/single/${occId}`);
    // console.log('Client data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
};

export const useGetClientById = (occId: string) => {
  return useQuery({
    queryKey: ['getClientByoccId', occId],
    queryFn: () => getClientById(occId),
    enabled: !!occId,
  });
};
