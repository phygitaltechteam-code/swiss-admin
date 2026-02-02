import {api} from '@/utils/axios';

export const getAllBeneficiary = async () => {
  try {
    const response = await api.get(`admin/beneficiary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getBeneficiaryByCustomer = async (id: string) => {
  try {
    const response = await api.get(`/admin/beneficiary/customer/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

export const acceptBeneficiary = async (id: string) => {
  try {
    const response = await api.put(`/admin/beneficiary/accept/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error accept', error);
    throw error;
  }
};

export const rejectBeneficiary = async (id: string, note: string) => {
  try {
    const response = await api.put(`/admin/beneficiary/reject/${id}`, {
      note: note,
    });
    return response.data;
  } catch (error) {
    console.error('Error reject', error);
    throw error;
  }
};
