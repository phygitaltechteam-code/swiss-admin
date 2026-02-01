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

export const acceptTheCustomer = async (id: string) => {
  try {
    const response = await api.put(`admin/customer/accept/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error to accept customer:', error);
    throw error;
  }
};

export const rejectTheCustomer = async (id: string, note: string) => {
  try {
    const response = await api.put(`admin/customer/reject/${id}`, {note: note});
    return response.data;
  } catch (error) {
    console.error('Error to accept customer:', error);
    throw error;
  }
};
