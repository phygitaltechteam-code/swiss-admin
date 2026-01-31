import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  deleteProjects,
  fetchProjects,
  getAllProjects,
  getDepartmentDashboard,
  getEmployeeDashboard,
  getProjectById,
  getProjectDepartmentEmp,
  getProjectInfoById,
  ProjectFormValues,
  saveProjects,
  updateProject,
} from '../api/project';
import toast from 'react-hot-toast';
import {useGetAllProjects} from '../api/occassionApi';
import {string} from 'zod';

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: ProjectFormValues}) =>
      updateProject(id, data),

    onSuccess: () => {
      toast.success('project updated successfully');
      queryClient.invalidateQueries({queryKey: ['project']});
    },
    onError: () => {
      toast.error('Failed To Update project');
    },
  });
};

export const useSaveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectFormValues) => saveProjects(data),

    onSuccess: () => {
      toast.success('project saved successfully');
      queryClient.invalidateQueries({queryKey: ['project']});
    },
    onError: () => {
      toast.error('Failed To Save project');
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProjects(id),

    onSuccess: () => {
      toast.success('project delete successfully');
      queryClient.invalidateQueries({queryKey: ['project']});
    },
    onError: () => {
      toast.error('Failed To delete project');
    },
  });
};

export const useGetProject = () =>
  useQuery({
    queryKey: ['project'],
    queryFn: () => fetchProjects(),
  });

export const useGetAllProject = () =>
  useQuery({
    queryKey: ['all_project'],
    queryFn: () => getAllProjects(),
  });

export const useGetProjectById = (id: string) =>
  useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id),
  });

export const useGetProjectInfoById = (id: string) =>
  useQuery({
    queryKey: ['project_info', id],
    queryFn: () => getProjectInfoById(id),
  });

export const useGetDepartmentDash = (proId: string, deptId: string) =>
  useQuery({
    queryKey: ['dept_dash'],
    queryFn: () => getDepartmentDashboard(proId, deptId),
  });

export const useGetEmpDashd = (proId: string, empId: string) =>
  useQuery({
    queryKey: ['emp_dash'],
    queryFn: () => getEmployeeDashboard(proId, empId),
  });

export const useGetProjectDeptEmp = (
  proId: string,
  deptId: string,
  options?: {enabled?: boolean},
) =>
  useQuery({
    queryKey: ['lower_Emp_pro', proId],
    queryFn: () => getProjectDepartmentEmp(proId, deptId),
    enabled: options?.enabled ?? !!proId,
  });
