import {
  DashboardFilters,
  DashboardFilterType,
  DashboardStats,
} from '@/components/Dashboard/types';
import {api} from '@/utils/axios';
import {useQuery} from '@tanstack/react-query';

import toast from 'react-hot-toast';

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

export const useDashboardData = (filters: DashboardFilters) => {
  return useQuery({
    queryKey: ['dashboard', filters],
    queryFn: () => getDashboardData(filters),
    onError: (error: any) => {
      console.error('Dashboard query error:', error);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Keep previous data while fetching new data
    keepPreviousData: true,
  });
};
