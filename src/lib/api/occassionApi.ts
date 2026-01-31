import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api} from '@/utils/axios';
import toast from 'react-hot-toast';

// ----------------------------
// ✅ Types
// ----------------------------

export type CreateOccasionPayload = {
  name: string;

  startDate: string;
  endDate: string;
};

export type OccasionResponse = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  adminId: string;
  status: string;
  discountGiven: number;
  balance: number;
  finalAmount: number;
  paidAmount: number;
  quotationAmount: number;
  customer: {
    id: string;
    userId: string;
    adminId: string;
    panNumber: string;
    address: string;
    caste: string;
    createdAt: string;
    updatedAt: string;
  };
};

type RoomBooking = {
  roomId: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
};

export type BookingData = {
  id: string;
  name: string;
  clientId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'BOOKED' | 'AVAILABLE' | 'ENQUIRY'; // or more if needed
  followupDate: string; // ISO date string
  banquetId: string;
  totalGuest: number;
  rooms: RoomBooking[];
};

const fetchOccasions = async (): Promise<OccasionResponse[]> => {
  try {
    const response = await api.get(`/company/project`);
    console.log('Occasions data:', response.data);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch occasions');
    throw error;
  }
};

const fetchOccasionById = async (
  occasionId: string,
): Promise<OccasionResponse> => {
  try {
    const response = await api.get(`/admin/ocassion/${occasionId}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch occasion');
    throw error;
  }
};

export const editOccasion = async (occasionId: string, data: BookingData) => {
  try {
    const response = await api.put(`/admin/ocassion/edit/${occasionId}`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch occasion');
    throw error;
  }
};

const addProject = async (
  data: CreateOccasionPayload,
  roleId?: string,
): Promise<any> => {
  try {
    const response = await api.post(`/company/project`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to add occasion');
    throw error;
  }
};

const deleteOccasion = async (occasionId: string): Promise<any> => {
  try {
    const response = await api.delete(`/admin/ocassion/${occasionId}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to delete occasion');
    throw error;
  }
};
// API function to update an occasion
const updateOccasion = async (
  occasionId: string,
  data: Partial<CreateOccasionPayload>, // Allow partial update
): Promise<any> => {
  try {
    const response = await api.put(`/admin/ocassion/${occasionId}`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to update occasion');
    throw error;
  }
};

const updateExternalForm = async (
  occasionId: string,
  data: {
    active: boolean;
  },
) => {
  try {
    const response = await api.put(`/admin/ocassion/link/${occasionId}`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to update external form');
    throw error;
  }
};
const getExternalForm = async (occassionId: string) => {
  try {
    const response = await api.get(`/admin/ocassion/link/${occassionId}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to get external form');
    throw error;
  }
};

const getPackageFacilities = async (occassionId: string) => {
  try {
    const response = await api.get(
      `/admin/ocassion/packageRooms/${occassionId}`,
    );
    return response.data;
  } catch (error) {
    toast.error('Failed to get package facilities');
    throw error;
  }
};

export const useGetPackageFacilities = (occasionId: string) => {
  return useQuery({
    queryKey: ['packageFacilities', occasionId],
    queryFn: () => getPackageFacilities(occasionId),
    enabled: !!occasionId, // Only fetch if occasionId is provided
  });
};

export const useGetExternalForm = (occasionId: string) => {
  return useQuery({
    queryKey: ['externalForm', occasionId],
    queryFn: () => getExternalForm(occasionId),
    enabled: !!occasionId, // Only fetch if occasionId is provided
  });
};

export const useUpdateExternalForm = (occasionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {active: boolean}) =>
      updateExternalForm(occasionId, data),
    onSuccess: () => {
      toast.success('External form updated successfully!');
      queryClient.invalidateQueries({queryKey: ['externalForm', occasionId]});
    },
    onError: () => toast.error('Failed to update external form'),
  });
};

export const useOccasions = (roleId?: string) =>
  useQuery({
    queryKey: ['occasions'],
    queryFn: () => fetchOccasions(),
    enabled: !!roleId,
  });

export const useGetAllProjects = () =>
  useQuery({
    queryKey: ['occasions'],
    queryFn: () => fetchOccasions(),
  });

export const useOccasionById = (occasionId: string) =>
  useQuery({
    queryKey: ['occasion', occasionId],
    queryFn: () => fetchOccasionById(occasionId),
    enabled: !!occasionId, // Only fetch if occasionId is provided
  });

export const useAddProject = (roleId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOccasionPayload) => addProject(data, roleId),
    onSuccess: () => {
      toast.success('Occasion added successfully!');
      queryClient.invalidateQueries({queryKey: ['occasions', roleId]});
    },
    onError: () => toast.error('Failed to add occasion'),
  });
};

export const useEditOccasion = (roleId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({occasionId, data}: {occasionId: string; data: BookingData}) =>
      editOccasion(occasionId, data),
    onSuccess: () => {
      toast.success('Occasion edited successfully!');
      queryClient.invalidateQueries({queryKey: ['occasions', roleId]});
    },
    onError: () => toast.error('Failed to edit occasion'),
  });
};
export const useUpdateOccasion = (roleId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      occasionId,
      data,
    }: {
      occasionId: string;
      data: Partial<CreateOccasionPayload>;
    }) => updateOccasion(occasionId, data),
    onSuccess: () => {
      toast.success('Occasion updated successfully!');
      queryClient.invalidateQueries({queryKey: ['occasions', roleId]});
    },
    onError: () => toast.error('Failed to update occasion'),
  });
};

export const useDeleteOccasion = (roleId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (occasionId: string) => deleteOccasion(occasionId),
    onSuccess: () => {
      toast.success('Occasion deleted successfully!');
      queryClient.invalidateQueries({queryKey: ['occasions', roleId]});
    },
    onError: () => toast.error('Failed to delete occasion'),
  });
};
