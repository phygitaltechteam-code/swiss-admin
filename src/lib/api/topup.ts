import {api} from '@/utils/axios';

export const getTopup = async () => {
  try {
    const response = await api.get(`/admin/transaction/pending/topup`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};
