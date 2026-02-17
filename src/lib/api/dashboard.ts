import {
  DashboardFilters,
  DashboardFilterType,
  DashboardStats,
} from '@/components/Dashboard/types';
import {api} from '@/utils/axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import toast from 'react-hot-toast';

export type dashGraph = {
  from: string;
  to: string;
};

const mapPeriodToFilter = (period: string): DashboardFilterType => {
  switch (period) {
    case '30d':
      return '30Days';
    case '7d':
      return '7Days';
    case '24h':
      return '24Hours';
    case 'custom':
      return 'custom';
    default:
      return '30Days';
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const buildDashboardFilters = (
  period: string,
  customDateRange?: {start: string; end: string},
): DashboardFilters => {
  const filter: DashboardFilterType = mapPeriodToFilter(period);

  const apiFilters: DashboardFilters = {filter};

  if (filter === 'custom' && customDateRange?.start && customDateRange?.end) {
    apiFilters.from = formatDate(customDateRange.start);
    apiFilters.to = formatDate(customDateRange.end);
  }

  return apiFilters;
};

export const useGetDashToUpGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: dashGraph) => getDashboardTopUpGrap(data),

    onSuccess: () => {
      // toast.success('fech data sucessfully!');
      queryClient.invalidateQueries({queryKey: ['top-up-graph']});
    },
    onError: () => {
      // toast.error('Failed To get data!');
    },
  });
};

export const getDashboardData = async (
  filters: DashboardFilters,
): Promise<DashboardStats> => {
  try {
    console.log('Fetching dashboard data with filters:', filters);

    const response = await api.put('/admin/dashboard', filters);

    console.log('Raw API Response:', response);

    let dashboardData: DashboardStats;

    if (response.data && typeof response.data === 'object') {
      if (response.data.customers !== undefined) {
        dashboardData = response.data;
      } else if (
        response.data.data &&
        response.data.data.customers !== undefined
      ) {
        dashboardData = response.data.data;
      } else if (response.data.statusCode === 200 && response.data.data) {
        dashboardData = response.data.data;
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid API response format');
      }
    } else {
      throw new Error('No data received from API');
    }

    const result: DashboardStats = {
      ...dashboardData,
      changePercentages: {
        customers: 12,
        transactions: 5,
        fees: 8,
        txAmount: 15,
        Total_reserves: 2,
        beneficiary: 10,
        totalTopups: -3,
        totalTransfers: 20,
      },
    };

    return result;
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Failed to load dashboard data';

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const getDashboardTopUpGrap = async (data: dashGraph) => {
  try {
    const response = await api.get(
      `/admin/transaction/cash-flow/graphs/weekly`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const useGetfeeChart = () =>
  useQuery({
    queryKey: ['fee-chart'],
    queryFn: async () => {
      const response = await api.get('admin/transaction/fee/chart');
      // console.log('GETDATATAREREREWR', response.data);
      return response.data;
    },
  });

export const useDashboardData = (filters: DashboardFilters) => {
  return useQuery({
    queryKey: ['dashboard', filters],
    queryFn: () => getDashboardData(filters),
  });
};
