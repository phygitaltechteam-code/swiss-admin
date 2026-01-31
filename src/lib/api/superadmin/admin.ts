import {api} from '@/utils/axios';

export type adminPayload = {
  id?: string;
  fullname: string;
  email: string;
  secondaryPhoneNumber?: string;
  phoneNumber: string;
  address: string;
  password: string;
  role: string;
  plan: string;
  startDate: Date;
  endDate: Date;
};
export const saveAdminProfile = async (data: adminPayload) => {
  try {
    console.log('api data', data);
    const response = await api.post(`admin/company`, data);
    return response.data;
  } catch (error) {
    console.error('Error saving admin profile:', error);
    throw error;
  }
};

export const getAdmins = async () => {
  try {
    const response = await api.get(`admin/company`);
    return response.data;
  } catch (error) {
    console.error('Error gating admin:', error);
    throw error;
  }
};

export const deleteAdmin = async (id: string) => {
  try {
    const response = await api.delete(`admin/company/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};

export const editAdmin = async (id: string, data: adminPayload) => {
  try {
    const response = await api.put(`admin/company/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error editing admin:', error);
    throw error;
  }
};
