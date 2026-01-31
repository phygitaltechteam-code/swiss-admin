import {api} from '@/utils/axios';
import toast from 'react-hot-toast';
import {string} from 'zod';

export type industryPayload = {
  name: string;
  description: string;
};
export const getAllIndustry = async () => {
  try {
    const response = await api.get(`/admin/industry`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch industry');
    throw error;
  }
};

export const saveIndustry = async (data: industryPayload) => {
  try {
    const response = await api.post(`/admin/industry`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to Add industry');
    throw error;
  }
};

export const updateIndustry = async (id: string, data: industryPayload) => {
  try {
    const response = await api.put(`/admin/industry/${id}`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to Update industry');
    throw error;
  }
};

export const deleteIndustry = async (id: string) => {
  try {
    const response = await api.delete(`/admin/industry/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete industry');
    throw error;
  }
};
