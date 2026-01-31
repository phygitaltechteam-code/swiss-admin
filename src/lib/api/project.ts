import {api} from '@/utils/axios';
import toast from 'react-hot-toast';

export type ProjectFormValues = {
  name: string;
  description: string;
  status: string;
  priority: string;
  startDate: Date;
  endDate: Date;
  departmentIds: string[];
  employeeIds: string[];
  projectHeads: string[];
};

export const fetchProjects = async () => {
  try {
    const response = await api.get(`/company/project`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch project');
    throw error;
  }
};

export const getAllProjects = async () => {
  try {
    const response = await api.get(`/company/work/project`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch project');
    throw error;
  }
};
export const getProjectById = async (id: string) => {
  try {
    const response = await api.get(`/company/project/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch project');
    throw error;
  }
};
export const saveProjects = async (data: ProjectFormValues) => {
  try {
    const response = await api.post(`/company/project`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch project');
    throw error;
  }
};
export const updateProject = async (id: string, data: ProjectFormValues) => {
  try {
    const response = await api.put(`/company/project/${id}`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to update project');
    throw error;
  }
};

export const deleteProjects = async (id: string) => {
  try {
    const response = await api.delete(`/company/project/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete project');
    throw error;
  }
};

export const getProjectInfoById = async (id: string) => {
  try {
    const response = await api.get(`/company/project/info/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete project');
    throw error;
  }
};

export const getProjectDepartmentEmp = async (
  proId: string,
  deptId: string,
) => {
  const response = await api.get(
    `/company/employee/project/${proId}/${deptId}`,
  );
  return response.data;
};

export const getDepartmentDashboard = async (proId: string, deptId: string) => {
  const response = await api.get(
    `/company/project/info/department/${proId}/${deptId}`,
  );
  return response.data;
};

export const getEmployeeDashboard = async (proId: string, empId: string) => {
  const response = await api.get(
    `/company/project/info/employee/${proId}/${empId}`,
  );
  return response.data;
};
