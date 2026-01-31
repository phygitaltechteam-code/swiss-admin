import {api} from '@/utils/axios';
import toast from 'react-hot-toast';
import {string} from 'zod';

export type positionPayload = {
  name: string;
  departmentId: string;
};
export const getAllDepartmentPostions = async () => {
  try {
    const response = await api.get(`company/department/position`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch position');
    throw error;
  }
};

export const saveDepartmentPostions = async (data: positionPayload) => {
  try {
    const response = await api.post(`company/department/position`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to Add position');
    throw error;
  }
};

export const updateDepartmentPostions = async (
  id: string,
  data: positionPayload,
) => {
  try {
    const response = await api.put(`company/department/position/${id}`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to Update position');
    throw error;
  }
};

export const deleteDepartmentPostions = async (id: string) => {
  try {
    const response = await api.delete(`company/department/position/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete position');
    throw error;
  }
};
