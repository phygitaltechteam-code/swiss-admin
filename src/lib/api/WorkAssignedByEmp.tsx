import {api} from '@/utils/axios';
import toast from 'react-hot-toast';

export type projectWorkBulk = {
  srNo: number;
  name: string;
  description: string;
  projectId: string;
  companyId: string;
  departmentId: string;
  status: string;
};

export type dailyWork = {
  name: string;
  description: string;
  reviewBy: string;
  priority: string;
  isAttachment: boolean;
  isRecurring: boolean;
  dueDate?: string;
  dueTime?: string;
  recurringType: string;
  recurringDate?: string;
  recurringTime?: string;
  recurringDay?: string;
  employeeIds: string[];
  departmentsAndEmployees: {
    departmentId: string;
    employeeIds: string[];
  }[];
};

export type ProjectWork = {
  srNo: number;
  name: string;
  description: string;
  assignedTo: string;
  reviewBy?: string;
  reviewComment?: string;
  status: string;
  priority: string;
  projectId: string;
  departmentId: string;
  companyId: string;
  dueDate?: Date;
  isAttachment: boolean;
};

export const saveDailyWorkByEmp = async (data: dailyWork) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item instanceof File) {
            formData.append(key, item);
          } else {
            formData.append(key, JSON.stringify(value));
          }
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const response = await api.post(`/employee/dailywork`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    toast.error('Failed to save work');
    throw error;
  }
};

export const updateDailyWorkByEmp = async (id: string, data: dailyWork) => {
  console.log('update api payload', data);

  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      // Date
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      }

      // Array
      else if (Array.isArray(value)) {
        if (key === 'attachments' && typeof value[0] === 'string') {
          formData.append(key, JSON.stringify(value));
        } else {
          value.forEach((item) => {
            if (item instanceof File) {
              formData.append(key, item);
            }
          });
        }
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const response = await api.put(`/employee/dailywork/${id}`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return response.data;
  } catch (error) {
    toast.error('Failed to update work');
    throw error;
  }
};
export const getDailyWorkByEmp = async () => {
  try {
    const response = await api.get(`/employee/dailywork`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get work');
    throw error;
  }
};

export const getDailyWorkByEmpById = async (id: string) => {
  try {
    const response = await api.get(`/employee/dailywork/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get work');
    throw error;
  }
};

export const deleteDailyWorkByEmp = async (id: string) => {
  try {
    const response = await api.delete(`/employee/dailywork/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete work');
    throw error;
  }
};

export const getAllEmpOfEmpSide = async () => {
  try {
    const response = await api.get(`/employee/employee/department`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete work');
    throw error;
  }
};

export const fetchEmployeeWorkListForEmp = async (
  projectId: string,
  employeeId: string,
) => {
  const response = await api.get(
    `/employee/work/emp/${projectId}/${employeeId}`,
  );
  return response.data;
};

export const reviewDailyWork = async () => {
  const response = await api.get(`/employee/dailywork/review`);
  return response.data;
};

export const reviewDailyWorkCompany = async () => {
  const response = await api.get(`/company/dailywork/review`);
  return response.data;
};
export const reviewProjectWork = async () => {
  const response = await api.get(`/employee/work/review`);
  return response.data;
};

export const reviewProjectWorkCompany = async () => {
  const response = await api.get(`/company/work/project/review`);
  return response.data;
};
export const reviewProjectWorkById = async (reviewId: string) => {
  const response = await api.get(`/employee/work/review/${reviewId}`);
  return response.data;
};
export const statusChange = async (
  workId: string,
  status: string,
  note?: string,
  reviewComment?: string,
  document?: File[],
) => {
  const formData = new FormData();
  formData.append('status', status);
  if (note) {
    formData.append('note', note);
  }
  if (reviewComment) {
    formData.append('reviewComment', reviewComment);
  }
  if (document && document.length > 0) {
    document.forEach((file) => formData.append('document', file));
  }

  const response = await api.put(
    `/employee/dailywork/status/${workId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

// //////////////////////////////////////////////////////////////////////////////////////////////
// project work

export const getProjectWorkByEmp = async () => {
  try {
    const response = await api.get(`/employee/project/work`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch work');
    throw error;
  }
};

export const saveProjectWorkByEmp = async (data: ProjectWork) => {
  try {
    console.log('api save dataa', data);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item instanceof File) {
            formData.append(key, item);
          } else {
            formData.append(key, JSON.stringify(value));
          }
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const response = await api.post(`/employee/work/project`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return response.data;
  } catch (error) {
    toast.error('Failed to update work');
    throw error;
  }
};
export const saveProjectWorInBulkByEmp = async (data: projectWorkBulk) => {
  try {
    const response = await api.post(`/employee/work/project/bulk`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch work');
    throw error;
  }
};

export const updateProjectWorkByEmp = async (id: string, data: ProjectWork) => {
  try {
    console.log('api updateee dataa', data);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        if (key === 'attachments' && typeof value[0] === 'string') {
          formData.append(key, JSON.stringify(value));
        } else {
          value.forEach((item) => {
            if (item instanceof File) {
              formData.append(key, item);
            }
          });
        }
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const response = await api.put(`/employee/work/project/${id}`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return response.data;
  } catch (error) {
    toast.error('Failed to update work');
    throw error;
  }
};
export const deleteProjectWorkByEmp = async (id: string) => {
  try {
    const response = await api.delete(`/employee/work/project/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete work');
    throw error;
  }
};

export const getDepartmentWiseWorkByEmp = async (
  deptId: string,
  proId: string,
) => {
  try {
    const response = await api.get(
      `/employee/work/department/${deptId}/${proId}`,
    );
    return response.data;
  } catch (error) {
    toast.error('Failed to get work');
    throw error;
  }
};

export const getProjectWorkByIdByEmp = async (id: string) => {
  try {
    const response = await api.get(`/employee/work/project/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get work');
    throw error;
  }
};

export const projectWorkStatusChange = async (
  workId: string,
  status: string,
  note?: string,
  reviewComment?: string,
  document?: File[],
) => {
  const formData = new FormData();
  formData.append('status', status);

  if (note) {
    formData.append('note', note);
  }
  if (reviewComment) {
    formData.append('reviewComment', reviewComment);
  }
  if (document && document.length > 0) {
    document.forEach((file) => formData.append('document', file));
  }

  const response = await api.put(`/employee/work/status/${workId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
