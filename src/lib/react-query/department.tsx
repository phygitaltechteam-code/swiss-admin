import {api} from '@/utils/axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  deleteDepartment,
  departmentPayload,
  getAllDepartment,
  saveDepartment,
  updateDepartment,
} from '../api/department';

export const useSaveDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: departmentPayload) => saveDepartment(data),

    onSuccess: () => {
      toast.success('department saved successfully');
      queryClient.invalidateQueries({queryKey: ['department']});
    },
    onError: () => {
      toast.error('Failed To Save department');
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: departmentPayload}) =>
      updateDepartment(id, data),

    onSuccess: () => {
      toast.success('department updated successfully');
      queryClient.invalidateQueries({queryKey: ['department']});
    },
    onError: () => {
      toast.error('Failed To Save department');
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDepartment(id),

    onSuccess: () => {
      toast.success('department updated successfully');
      queryClient.invalidateQueries({queryKey: ['department']});
    },
    onError: () => {
      toast.error('Failed To Save department');
    },
  });
};

export const useGetDepartment = () =>
  useQuery({
    queryKey: ['department'],
    queryFn: () => getAllDepartment(),
  });
