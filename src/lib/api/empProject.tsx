import {api} from '@/utils/axios';
import toast from 'react-hot-toast';

export const getProjectInfoByEmpById = async (id: string) => {
  try {
    const response = await api.get(`/employee/project/info/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete project');
    throw error;
  }
};

export const getProjectLowerEmpWork = async (id: string) => {
  try {
    const response = await api.get(`employee/work/byproject/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get work');
    throw error;
  }
};

export const getProjectDepartmentEmpByHead = async (
  proId: string,
  deptId: string,
) => {
  const response = await api.get(
    `/employee/employee/project/${proId}/${deptId}`,
  );
  return response.data;
};

export const fetchProDeptWorkListByEmp = async (
  projectId: string,
  deptId: string,
) => {
  const response = await api.get(`/employee/work/dept/${projectId}/${deptId}`);
  return response.data;
};
