import {api} from '@/utils/axios';
import toast from 'react-hot-toast';
import {string} from 'zod';

export type departmentPayload = {
  name: string;
};
export const getAllCompanyDepartment = async () => {
  try {
    const response = await api.get(`/company/department`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch department');
    throw error;
  }
};

export const getAllCompanyDepartmentById = async (id: string) => {
  try {
    const response = await api.get(`/company/department/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch department');
    throw error;
  }
};
export const saveCompanyDepartment = async (data: departmentPayload) => {
  try {
    const response = await api.post(`/company/department`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to Add department');
    throw error;
  }
};

export const updateCompanyDepartment = async (
  id: string,
  data: departmentPayload,
) => {
  try {
    const response = await api.put(`/company/department/${id}`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to Update department');
    throw error;
  }
};

export const deleteCompanyDepartmentt = async (id: string) => {
  try {
    const response = await api.delete(`/company/department/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete department');
    throw error;
  }
};
