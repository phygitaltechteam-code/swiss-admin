import {api} from '@/utils/axios';
import toast from 'react-hot-toast';

export const getTimeSheet = async (id: string) => {
  try {
    const response = await api.get(`company/employee/timesheet/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get project');
    throw error;
  }
};
export const getAttendance = async (id: string) => {
  try {
    const response = await api.get(`/company/employee/attendence/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get project');
    throw error;
  }
};

export const getAllTodaysAttendate = async () => {
  try {
    const response = await api.get(`/company/employee/attendence/all`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get project');
    throw error;
  }
};
