import {updateAdminProfile} from '@/lib/api/adminApi';
import {
  adminPayload,
  deleteAdmin,
  editAdmin,
  getAdmins,
  saveAdminProfile,
} from '@/lib/api/superadmin/admin';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';

export type admin = {
  id?: string;
  startDate: Date;
  endDate: Date;
  address: string;
  plan: string;
  user: {
    fullname: string;
    email: string;
    secondaryPhoneNumber?: string;
    phoneNumber: string;

    password: string;
    role: string;
  };
};
export const useSaveAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveAdminProfile,
    onSuccess: () => {
      toast.success('admin Registered!');
    },
    onError: (error) => {
      console.log('errors', error);

      const backendMessage =
        error?.response?.data?.message || 'Failed to register admin';

      toast.error(backendMessage);

      //   toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin'],
      });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      toast.success('admin deleted!');
    },
    onError: (error) => {
      console.log('errors', error);

      const backendMessage =
        error?.response?.data?.message || 'Failed to delete admin';

      toast.error(backendMessage);

      //   toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin'],
      });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, data}: {id: string; data: adminPayload}) => {
      return editAdmin(id, data);
    },
    onSuccess: () => {
      toast.success('Admin edited!');
    },
    onError: (error: any) => {
      console.log('errors', error);
      const backendMessage =
        error?.response?.data?.message || 'Failed to edit admin';
      toast.error(backendMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin'],
      });
    },
  });
};

export const useGetAdmin = () =>
  useQuery<admin[]>({
    queryKey: ['admin'],
    queryFn: () => getAdmins(),
  });
