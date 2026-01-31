import {api} from '@/utils/axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  deleteDepartmentPostions,
  getAllDepartmentPostions,
  positionPayload,
  saveDepartmentPostions,
  updateDepartmentPostions,
} from '../api/departmentPositions';

export const useSaveDepartmentPositions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: positionPayload) => saveDepartmentPostions(data),

    onSuccess: () => {
      toast.success('position saved successfully');
      queryClient.invalidateQueries({queryKey: ['department_position']});
    },
    onError: () => {
      toast.error('Failed To Save position');
    },
  });
};

export const useUpdateDepartmentPositions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: positionPayload}) =>
      updateDepartmentPostions(id, data),

    onSuccess: () => {
      toast.success('position updated successfully');
      queryClient.invalidateQueries({queryKey: ['department_position']});
    },
    onError: () => {
      toast.error('Failed To Update position');
    },
  });
};

export const useDeleteDepartmentPositions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDepartmentPostions(id),

    onSuccess: () => {
      toast.success('position deleted successfully');
      queryClient.invalidateQueries({queryKey: ['department_position']});
    },
    onError: () => {
      toast.error('Failed To deleted position');
    },
  });
};

export const useGetDepartmentPositions = () =>
  useQuery({
    queryKey: ['department_position'],
    queryFn: () => getAllDepartmentPostions(),
  });
