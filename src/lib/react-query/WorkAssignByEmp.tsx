import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {dailyWork} from '../api/projectWork';
import {
  deleteDailyWorkByEmp,
  fetchEmployeeWorkListForEmp,
  getDailyWorkByEmp,
  getDailyWorkByEmpById,
  getDepartmentWiseWorkByEmp,
  getProjectWorkByEmp,
  getProjectWorkByIdByEmp,
  getWorkByIdByEmp,
  ProjectWork,
  projectWorkBulk,
  projectWorkStatusChange,
  reviewDailyWork,
  reviewDailyWorkCompany,
  reviewProjectWork,
  reviewProjectWorkById,
  reviewProjectWorkCompany,
  saveDailyWorkByEmp,
  saveProjectWorInBulkByEmp,
  saveProjectWorkByEmp,
  statusChange,
  updateDailyWorkByEmp,
  updateProjectWorkByEmp,
} from '../api/WorkAssignedByEmp';

export const useSaveDailyWorkByEmp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDailyWorkByEmp,

    onSuccess: () => {
      toast.success('daily work saved successfully');
      queryClient.invalidateQueries({queryKey: ['daily_work_emp']});
    },
    onError: () => {
      toast.error('Failed To save daily work');
    },
  });
};

export const useUpdateDailyWorkByEmp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: dailyWork}) =>
      updateDailyWorkByEmp(id, data),

    onSuccess: () => {
      toast.success('daily work updated successfully');
      queryClient.invalidateQueries({queryKey: ['daily_work_emp']});
    },
    onError: () => {
      toast.error('Failed To update daily work');
    },
  });
};

export const useDeleteDailyWorkByEmp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDailyWorkByEmp(id),

    onSuccess: () => {
      toast.success('daily work deleted successfully');
      queryClient.invalidateQueries({queryKey: ['daily_work_emp']});
    },
    onError: () => {
      toast.error('Failed To delete daily work');
    },
  });
};

export const useGetDailyWorkByEmp = () =>
  useQuery({
    queryKey: ['daily_work_emp'],
    queryFn: () => getDailyWorkByEmp(),
  });

export const useGetDailyWorkByEmpById = (id: string) =>
  useQuery({
    queryKey: ['daily_work_emp', id],
    queryFn: () => getDailyWorkByEmpById(id),
  });

export const useEmployeeWorkListForEmp = (
  projectId: string,
  employeeId: string,
) =>
  useQuery({
    queryKey: ['employeeWorkList', employeeId],
    queryFn: () => fetchEmployeeWorkListForEmp(projectId, employeeId),
    enabled: !!employeeId,
  });

export const useStatusChange = () => {
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
    }) => statusChange(id, status, note, reviewComment, document),

    onSuccess: () => {
      toast.success('status changes successfully');
      queryClient.invalidateQueries({queryKey: ['daily_work_emp']});
    },
    onError: () => {
      toast.error('Failed To change status');
    },
  });
};

export const useDailyWorkReview = () =>
  useQuery({
    queryKey: ['daily_review'],
    queryFn: () => reviewDailyWork(),
  });

export const useDailyWorkReviewCompany = () =>
  useQuery({
    queryKey: ['daily_review_com'],
    queryFn: () => reviewDailyWorkCompany(),
  });

export const useProjectWorkReview = () =>
  useQuery({
    queryKey: ['pro_review'],
    queryFn: () => reviewProjectWork(),
  });

export const useProjectWorkReviewCompany = () =>
  useQuery({
    queryKey: ['pro_review_company'],
    queryFn: () => reviewProjectWorkCompany(),
  });

export const useProjectWorkReviewById = (reviewId: string) =>
  useQuery({
    queryKey: ['pro_review', reviewId],
    queryFn: () => reviewProjectWorkById(reviewId),
  });
// ///////////////////////////////////////////////////////////////////
// project work

export const useDeleteProjectWorkByEmp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDailyWorkByEmp(id),

    onSuccess: () => {
      toast.success('project work delete successfully');
      queryClient.invalidateQueries({queryKey: ['project_work_emp']});
    },
    onError: () => {
      toast.error('Failed To delete project work');
    },
  });
};

export const useSaveProjectWorkByEmp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectWork) => saveProjectWorkByEmp(data),

    onSuccess: () => {
      toast.success('project work saved successfully');
      queryClient.invalidateQueries({queryKey: ['project_info_emp']});
    },
    onError: () => {
      toast.error('Failed To save project work');
    },
  });
};

export const useSaveProjectWorkInBulkByEmp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: projectWorkBulk) => saveProjectWorInBulkByEmp(data),

    onSuccess: () => {
      toast.success('project work saved successfully');
      queryClient.invalidateQueries({queryKey: ['project_work_emp']});
    },
    onError: () => {
      toast.error('Failed To save project work');
    },
  });
};

export const useUpdateProjectWorkByEmp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: ProjectWork}) =>
      updateProjectWorkByEmp(id, data),

    onSuccess: () => {
      toast.success('project work updated successfully');
      queryClient.invalidateQueries({queryKey: ['project_work_emp']});
    },
    onError: () => {
      toast.error('Failed To update project work');
    },
  });
};

export const useGetProjectWorkByEmp = () =>
  useQuery({
    queryKey: ['project_work_emp'],
    queryFn: () => getProjectWorkByEmp(),
  });

// export const useGetDepartmentWork = (deptId: string, proId: string) =>
//   useQuery({
//     queryKey: ['project_work'],
//     queryFn: () => getDepartmentWiseWork(deptId, proId),
//   });

export const useGetDepartmentWorkByEmp = (
  departmentId: string,
  projectId: string,
  options: any = {},
) => {
  return useQuery({
    queryKey: ['departmentWork', departmentId, projectId],
    queryFn: () => getDepartmentWiseWorkByEmp(departmentId, projectId),
    ...options,
  });
};

export const useGetProjectWorkByIdByEmp = (id: string) =>
  useQuery({
    queryKey: ['project_work_emp', id],
    queryFn: () => getProjectWorkByIdByEmp(id),
  });

export const useProjectWorkStatusChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
      reviewComment,
      document,
    }: {
      id: string;
      status: string;
      note?: string;
      reviewComment?: string;
      document?: File[];
    }) => projectWorkStatusChange(id, status, note, reviewComment, document),

    onSuccess: () => {
      toast.success('status changes successfully');
      queryClient.invalidateQueries({queryKey: ['project_work_emp']});
    },
    onError: () => {
      toast.error('Failed To change status');
    },
  });
};
