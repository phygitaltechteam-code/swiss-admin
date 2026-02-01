import {api} from '@/utils/axios';

export const getAllCustomer = async () => {
  try {
    const response = await api.get(`admin/customer`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomerById = async (id: string) => {
  try {
    const response = await api.get(`admin/customer/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};
