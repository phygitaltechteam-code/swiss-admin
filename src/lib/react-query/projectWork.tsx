import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  companyStatusChangeDaily,
  companyStatusChangeProject,
  dailyWork,
  deleteDailyWork,
  deleteProjectWork,
  getDailyWork,
  getDailyWorkById,
  getDepartmentWiseWork,
  getProjectWork,
  getProjectWorkByProId,
  getProjectWorkByWorkId,
  getWorkById,
  ProjectWork,
  projectWorkBulk,
  saveDailyWork,
  saveProjectWorInBulk,
  saveProjectWork,
  updateDailyWork,
  updateProjectWork,
} from '../api/projectWork';

export const useDeleteProjectWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProjectWork(id),

    onSuccess: () => {
      toast.success('project work delete successfully');
      queryClient.invalidateQueries({queryKey: ['project_work']});
    },
    onError: () => {
      toast.error('Failed To delete project work');
    },
  });
};

export const useSaveProjectWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectWork) => saveProjectWork(data),

    onSuccess: () => {
      toast.success('project work saved successfully');
      queryClient.invalidateQueries({queryKey: ['project_work']});
    },
    // onError: () => {
    //   toast.error('Failed To save project work');
    // },
  });
};

export const useSaveProjectWorkInBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: projectWorkBulk) => saveProjectWorInBulk(data),

    onSuccess: () => {
      toast.success('project work saved successfully');
      queryClient.invalidateQueries({queryKey: ['project_work']});
    },
    onError: () => {
      toast.error('Failed To save project work');
    },
  });
};

export const useUpdateProjectWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: ProjectWork}) => {
      console.log('EUUUUUUUUUUU', data);
      return updateProjectWork(id, data);
    },
    onSuccess: () => {
      toast.success('project work updated successfully');
      queryClient.invalidateQueries({queryKey: ['project_work']});
    },
    onError: () => {
      toast.error('Failed To update project work');
    },
  });
};

export const useGetProjectWork = () =>
  useQuery({
    queryKey: ['project'],
    queryFn: () => getProjectWork(),
  });

export const useGetProjectWorkById = (proId: string, options: any = {}) =>
  useQuery({
    queryKey: ['project_work', proId],
    queryFn: () => getProjectWorkByProId(proId),
    ...options,
  });

export const useGetProjectWorkByWorkId = (workId: string, options: any = {}) =>
  useQuery({
    queryKey: ['project_work', workId],
    queryFn: () => getProjectWorkByWorkId(workId),
    ...options,
  });
export const useGetDepartmentWork = (
  departmentId: string,
  projectId: string,
  options: any = {},
) => {
  return useQuery({
    queryKey: ['departmentWork', departmentId, projectId],
    queryFn: () => getDepartmentWiseWork(departmentId, projectId),
    ...options,
  });
};

export const useGetWorkById = (id: string) =>
  useQuery({
    queryKey: ['project_work', id],
    queryFn: () => getWorkById(id),
  });

export const useCompanyStatusChangePro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      document,
      note,
      reviewComment,
    }: {
      id: string;
      status: string;
      note?: string;
      reviewComment?: string;
      document?: File[];
    }) => companyStatusChangeProject(id, status, note, reviewComment, document),

    onSuccess: () => {
      toast.success('status changes successfully');
      queryClient.invalidateQueries({queryKey: ['daily_work_emp']});
    },
    onError: () => {
      toast.error('Failed To change status');
    },
  });
};

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Daily work

export const useSaveDailyWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDailyWork,

    onSuccess: () => {
      toast.success('daily work saved successfully');
      queryClient.invalidateQueries({queryKey: ['daily_work']});
    },
    onError: () => {
      toast.error('Failed To save daily work');
    },
  });
};

export const useUpdateDailyWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: dailyWork}) =>
      updateDailyWork(id, data),

    onSuccess: () => {
      toast.success('daily work updated successfully');
      queryClient.invalidateQueries({queryKey: ['daily_work']});
    },
    onError: () => {
      toast.error('Failed To update daily work');
    },
  });
};

export const useDeleteDailyWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDailyWork(id),

    onSuccess: () => {
      toast.success('daily work deleted successfully');
      queryClient.invalidateQueries({queryKey: ['daily_work']});
    },
    onError: () => {
      toast.error('Failed To delete daily work');
    },
  });
};

export const useGetDailyWork = () =>
  useQuery({
    queryKey: ['daily_work'],
    queryFn: () => getDailyWork(),
  });

export const useGetDailyWorkById = (id: string) =>
  useQuery({
    queryKey: ['daily_work', id],
    queryFn: () => getDailyWorkById(id),
  });

export const useCompanyStatusChangeDaily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      document,
      note,
      reviewComment,
    }: {
      id: string;
      status: string;
      note?: string;
      reviewComment?: string;
      document?: File[];
    }) => companyStatusChangeDaily(id, status, note, reviewComment, document),

    onSuccess: () => {
      toast.success('status changes successfully');
      queryClient.invalidateQueries({queryKey: ['daily_work_emp']});
    },
    onError: () => {
      toast.error('Failed To change status');
    },
  });
};
