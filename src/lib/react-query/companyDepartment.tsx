import {api} from '@/utils/axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  deleteCompanyDepartmentt,
  departmentPayload,
  getAllCompanyDepartment,
  saveCompanyDepartment,
  updateCompanyDepartment,
} from '../api/companyDepartment';
import {getAllEmpOfEmpSide} from '../api/WorkAssignedByEmp';

export const useSaveCompanyDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: departmentPayload) => saveCompanyDepartment(data),

    onSuccess: () => {
      toast.success('department saved successfully');
      queryClient.invalidateQueries({queryKey: ['company_department']});
    },
    onError: () => {
      toast.error('Failed To Save department');
    },
  });
};

export const useUpdateCompanyDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: departmentPayload}) =>
      updateCompanyDepartment(id, data),

    onSuccess: () => {
      toast.success('department updated successfully');
      queryClient.invalidateQueries({queryKey: ['company_department']});
    },
    onError: () => {
      toast.error('Failed To Save department');
    },
  });
};

export const useDeleteCompanyDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCompanyDepartmentt(id),

    onSuccess: () => {
      toast.success('department updated successfully');
      queryClient.invalidateQueries({queryKey: ['company_department']});
    },
    onError: () => {
      toast.error('Failed To Save department');
    },
  });
};

export const useGetCompanyDepartment = () =>
  useQuery({
    queryKey: ['company_department'],
    queryFn: () => getAllCompanyDepartment(),
  });

export const useGetEmpOfEmpSide = () =>
  useQuery({
    queryKey: ['emp_emp'],
    queryFn: () => getAllEmpOfEmpSide(),
  });

export const useGetCompanyDepartmentById = (id: string) =>
  useQuery({
    queryKey: ['company_department', id],
    queryFn: () => getAllCompanyDepartment(),
    enabled: !id,
  });
