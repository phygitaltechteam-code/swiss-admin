import {api} from '@/utils/axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  deleteIndustry,
  getAllIndustry,
  industryPayload,
  saveIndustry,
  updateIndustry,
} from '../api/industry';
import toast from 'react-hot-toast';

export const useSaveIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: industryPayload) => saveIndustry(data),

    onSuccess: () => {
      toast.success('industry saved successfully');
      queryClient.invalidateQueries({queryKey: ['industry']});
    },
    onError: () => {
      toast.error('Failed To Save industry');
    },
  });
};

export const useUpdateIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: industryPayload}) =>
      updateIndustry(id, data),

    onSuccess: () => {
      toast.success('industry updated successfully');
      queryClient.invalidateQueries({queryKey: ['industry']});
    },
    onError: () => {
      toast.error('Failed To Save industry');
    },
  });
};

export const useDeleteIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteIndustry(id),

    onSuccess: () => {
      toast.success('industry updated successfully');
      queryClient.invalidateQueries({queryKey: ['industry']});
    },
    onError: () => {
      toast.error('Failed To Save industry');
    },
  });
};

export const useGetIndustry = () =>
  useQuery({
    queryKey: ['industry'],
    queryFn: () => getAllIndustry(),
  });
