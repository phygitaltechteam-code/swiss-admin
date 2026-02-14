import {api} from '@/utils/axios';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      // Invalidate any related queries if needed
      queryClient.invalidateQueries({
        queryKey: ['user-profile'],
      });
    },
  });
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await api.post(`/users/change-password`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || 'Failed to change password',
      );
    }
    throw error;
  }
};
