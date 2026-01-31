import {api} from '@/utils/axios';
import toast from 'react-hot-toast';

export type ProjectWork = {
  srNo: number;
  name: string;
  documentNote: string;
  description: string;
  assignedTo: string;
  reviewBy?: string;
  reviewComment?: string;
  status: string;
  priority: string;
  projectId: string;
  companyId: string;
  departmentId: string;
  dueDate?: Date;
  document?: File[];
  attachments?: string[];
  isAttachment: boolean;
};

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
  document: File[];
  attachments?: string[];
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
  employeeIds?: string[];
  departmentsAndEmployees: {
    departmentId: string;
    employeeIds: string[];
  }[];
};

// No projectWorkBulk needed anymore
// because you're sending an array of Bulk

export const getProjectWork = async () => {
  try {
    const response = await api.get(`/company/project/work`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch work');
    throw error;
  }
};

export const getProjectWorkByProId = async (proId: string) => {
  try {
    const response = await api.get(`/company/work/byproject/${proId}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch work');
    throw error;
  }
};

export const getProjectWorkByWorkId = async (worIkd: string) => {
  try {
    const response = await api.get(`/company/work/${worIkd}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch work');
    throw error;
  }
};

export const saveProjectWork = async (data: ProjectWork) => {
  console.log('api save data', data);
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
    const response = await api.post(`/company/work/project`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // toast.error('Failed to fetch work');
    throw error;
  }
};

export const saveProjectWorInBulk = async (data: projectWorkBulk) => {
  try {
    const response = await api.post(`/company/work/project/bulk`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch work');
    throw error;
  }
};

export const updateProjectWork = async (id: string, data: ProjectWork) => {
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

    const response = await api.put(`/company/work/project/${id}`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return response.data;
  } catch (error) {
    toast.error('Failed to update work');
    throw error;
  }
};

export const deleteProjectWork = async (id: string) => {
  try {
    const response = await api.delete(`/company/work/project/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete work');
    throw error;
  }
};

export const getDepartmentWiseWork = async (deptId: string, proId: string) => {
  try {
    const response = await api.get(
      `/company/work/department/${deptId}/${proId}`,
    );
    return response.data;
  } catch (error) {
    toast.error('Failed to get work');
    throw error;
  }
};

export const getWorkById = async (id: string) => {
  try {
    const response = await api.get(`/company/work/project/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get work');
    throw error;
  }
};

export const companyStatusChangeProject = async (
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

  const response = await api.put(`/company/work/status/${workId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Daily Work

export const saveDailyWork = async (data: dailyWork) => {
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

    const response = await api.post(`/company/dailywork`, formData, {
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

export const updateDailyWork = async (id: string, data: dailyWork) => {
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

    const response = await api.put(`/company/dailywork/${id}`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return response.data;
  } catch (error) {
    toast.error('Failed to update work');
    throw error;
  }
};

export const getDailyWork = async () => {
  try {
    const response = await api.get(`/company/dailywork`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get work');
    throw error;
  }
};

export const getDailyWorkById = async (id: string) => {
  try {
    const response = await api.get(`/company/dailywork/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get work');
    throw error;
  }
};

export const deleteDailyWork = async (id: string) => {
  try {
    const response = await api.delete(`/company/dailywork/${id}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete work');
    throw error;
  }
};

export const companyStatusChangeDaily = async (
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
    `/company/dailywork/status/${workId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};
