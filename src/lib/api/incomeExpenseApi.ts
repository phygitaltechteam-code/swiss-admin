import {api} from '@/utils/axios';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';

//Get All Income Expenditure
export const getAllIncomeExpense = async (oscassionId: string) => {
  try {
    const response = await api.get(`admin/income/${oscassionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching income/expense:', error);
    throw error;
  }
};

export const getAlloCCationIncome = async () => {
  try {
    const response = await api.get(`admin/income/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching income/expense:', error);
    throw error;
  }
};

//addIncomeExpense
export const addIncomeExpense = async (
  RoleId: string,
  data: {
    amount: number;
    particular: string;
    date: string;
    status: string;
    transactionId?: string;
    bankName?: string;
    oscassionId?: string;
  },
) => {
  try {
    const response = await api.post(`admin/income/${RoleId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding income/expense:', error);
    throw error;
  }
};

//Update IncomeExpense
export const updateIncomeExpense = async (
  ItemId: string,
  data: {
    amount: number;
    particular: string;
    date: string;
    status: string;
    transactionId?: string;
    bankName?: string;
    oscassionId?: string;
  },
) => {
  try {
    const response = await api.put(`admin/income/${ItemId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating income/expense:', error);
    throw error;
  }
};

//Get All Income Expenditure
export const useGetAllIncomeExpense = (oscassionId: string) => {
  return useQuery({
    queryKey: ['IncomeExpense', oscassionId],
    queryFn: () => getAllIncomeExpense(oscassionId),
  });
};

export const useGetAlloCCationIncome = () => {
  return useQuery({
    queryKey: ['IncomeExpense_all'],
    queryFn: () => getAlloCCationIncome(),
  });
};

//Add IncomeExpense
export const useAddIncomeExpense = (RoleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      amount: number;
      particular: string;
      date: string;
      status: string;
      transactionId?: string;
      bankName?: string;
      oscassionId?: string;
    }) => addIncomeExpense(RoleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['IncomeExpense']});
      toast.success('Transaction added successfully');
    },
    onError: (error: {
      response: {data: {errors: string[]; message: string}};
    }) => {
      toast.error(error.response.data.errors[0] || error.response.data.message);
    },
  });
};

//Update IncomeExpense
export const useUpdateIncomeExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ItemId,
      data,
    }: {
      ItemId: string;
      data: {
        amount: number;
        particular: string;
        date: string;
        status: string;
        transactionId?: string;
        bankName?: string;
        oscassionId?: string;
      };
    }) => updateIncomeExpense(ItemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['IncomeExpense']});
      toast.success('Profile updated successfully');
    },
    onError: (error: {
      response: {data: {errors: string[]; message: string}};
    }) => {
      toast.error(error.response.data.errors[0] || error.response.data.message);
    },
  });
};

//Get Bill Amount

const getBillAmount = async (occId: string) => {
  try {
    const response = await api.get(`admin/ocassion/total/${occId}`);
    console.log('Total Amount Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching total amounts:', error);
    throw error;
  }
};
export const useGetAmounts = (occId: string) => {
  return useQuery({
    queryKey: ['amounts', occId],
    queryFn: () => getBillAmount(occId),
    // select: (data) => data.filter((item) => item.status !== 'DELETED'),
  });
};
