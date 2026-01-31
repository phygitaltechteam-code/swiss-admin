import {api} from '@/utils/axios';
import toast from 'react-hot-toast';
import {string} from 'zod';

export type departmentPayload = {
  name: string;
};
export const getAllDepartment = async () => {
  try {
    const response = await api.get(`/admin/department`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch inddepartmentustry');
    throw error;
  }
};

export const saveDepartment = async (data: departmentPayload) => {
  try {
    const response = await api.post(`/admin/department`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to Add department');
    throw error;
  }
};

export const updateDepartment = async (id: string, data: departmentPayload) => {
  try {
    const response = await api.put(`/admin/department/${id}`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to Update department');
    throw error;
  }
};

export const deleteDepartment = async (id: string) => {
  try {
    const response = await api.delete(`/admin/department/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete department');
    throw error;
  }
};
