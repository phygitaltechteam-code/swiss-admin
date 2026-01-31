import {api} from '@/utils/axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';

//Get Admin Profile
export const getAdminProfile = async (adminId: string) => {
  try {
    const response = await api.get(`admin/${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

//Update Admin Profile
export const updateAdminProfile = async (
  adminId: string,
  data: {
    fullname: string;
    phoneNumber: string;
    email: string;
    address: string;
    godNames: string[];
    terms: string[];
    accountName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  },
) => {
  try {
    const response = await api.put(`admin/${adminId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};

//Get Profile Info
export const useGetAdminProfile = (adminId: string) => {
  return useQuery({
    queryKey: ['getAdminProfile'],
    queryFn: () => getAdminProfile(adminId),
  });
};

export const updateLogo = async (adminId: string, data: {imageFile: File}) => {
  try {
    const formData = new FormData();
    formData.append('imageFile', data.imageFile);

    const response = await api.put(`admin/logo/${adminId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating admin logo:', error);
    throw error;
  }
};

export const useUpdateLogo = (adminId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {imageFile: File}) => updateLogo(adminId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getAdminProfile']});
      toast.success('Logo updated successfully');
    },
    onError: (error: {
      response: {data: {errors: string[]; message: string}};
    }) => {
      toast.error(error.response.data.errors[0] || error.response.data.message);
    },
  });
};

//Update Profile Info
export const useUpdateAdminProfile = (adminId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      fullname: string;
      phoneNumber: string;
      email: string;
      address: string;
      godNames: string[];
      terms: string[];
      accountName?: string;
      bankName?: string;
      accountNumber?: string;
      ifscCode?: string;
      upiId?: string;
    }) => updateAdminProfile(adminId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getAdminProfile']});
      toast.success('Profile updated successfully');
    },
    onError: (error: {
      response: {data: {errors: string[]; message: string}};
    }) => {
      toast.error(error.response.data.errors[0] || error.response.data.message);
    },
  });
};

//Get Payment Details
export const getPaymentDetails = async (adminId: string) => {
  try {
    const response = await api.get(`admin/bank/${adminId}`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

export const useGetPaymentDetails = (adminId: string) => {
  return useQuery({
    queryKey: ['getPaymentDetails'],
    queryFn: () => getPaymentDetails(adminId),
  });
};

//Update Payment Details
export const updatePaymentDetails = async (
  adminId: string,
  data: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    accountName: string;
  },
) => {
  try {
    const response = await api.put(`admin/bank/${adminId}`, data); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error('Error updating payment details:', error);
    throw error;
  }
};

export const useUpdatePaymentDetails = (adminId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      upiId: string;
      accountName: string;
    }) => updatePaymentDetails(adminId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getPaymentDetails']});
      toast.success('Payment details updated successfully');
    },
    onError: (error: {
      response: {data: {errors: string[]; message: string}};
    }) => {
      toast.error(error.response.data.errors[0] || error.response.data.message);
    },
  });
};

export const useUpdateFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}: {id: string; data: followupUpdatePayload}) =>
      adminEditFollowUp(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['followup']});
      toast.success('Follow Up Updated uccesfully');
    },
    onError: (error: {
      response: {data: {errors: string[]; message: string}};
    }) => {
      toast.error(error.response.data.errors[0] || error.response.data.message);
    },
  });
};

export const useDeleteFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id}: {id: string}) => adminDeleteFollowUp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['followup']});
      toast.success('Follow Up deleted uccesfully');
    },
    onError: (error: {
      response: {data: {errors: string[]; message: string}};
    }) => {
      toast.error(error.response.data.errors[0] || error.response.data.message);
    },
  });
};

export const useAcceptNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationAccept(id),

    onSuccess: () => {
      toast.success('Income  Accepted!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to accept Income expense!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['notification'],
      });
    },
  });
};

export const useEditPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}: {id: string; data: paymentEditPayload}) =>
      adminEditPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notification']});
      toast.success('Payment Updated uccesfully');
    },
    onError: (error: {
      response: {data: {errors: string[]; message: string}};
    }) => {
      toast.error(error.response.data.errors[0] || error.response.data.message);
    },
  });
};

const adminFollowUp = async () => {
  try {
    const response = await api.get(`admin/ocassion/followup`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

export type followupUpdatePayload = {
  followupDate: string;
  note: string;
};

export const adminEditFollowUp = async (
  followUpId: string,
  data: followupUpdatePayload,
) => {
  try {
    const response = await api.put(
      `admin/ocassion/notification/${followUpId}`,
      data,
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error('Error while edit date:', error);
    throw error;
  }
};

export const adminDeleteFollowUp = async (followUpId: string) => {
  try {
    const response = await api.delete(
      `admin/ocassion/notification/${followUpId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error while delete date:', error);
    throw error;
  }
};

const notification = async (roleId: string) => {
  try {
    const response = await api.get(`admin/income/today/${roleId}`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

export const useNotification = (roleId: string) => {
  return useQuery({
    queryKey: ['notification'],
    queryFn: () => notification(roleId),
  });
};

export const useGetOcassionFollowUp = () => {
  return useQuery({
    queryKey: ['followup'],
    queryFn: () => adminFollowUp(),
  });
};

export const notificationAccept = async (id: string) => {
  try {
    await api.post(`/admin/income/notification/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || 'Failed to accept income expense',
      );
    }
    throw error;
  }
};

export type paymentEditPayload = {
  date: string;
  amount: string;
  perticular: string;
};

export const adminEditPayment = async (id, data: paymentEditPayload) => {
  try {
    const response = await api.put(`admin/income/notification/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error while edit date:', error);
    throw error;
  }
};
