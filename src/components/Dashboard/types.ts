// types/dashboard.ts
export type DashboardFilterType = '7Days' | '30Days' | '24Hours' | 'custom';

export interface DashboardFilters {
  filter: DashboardFilterType;
  from?: string;
  to?: string;
}

export interface DashboardStats {
  customers: number;
  transactions: number;
  fees: number;
  txAmount: number;
  Total_reserves: number;
  beneficiary: number;
  totalTopups: number;
  totalTransfers: number;

  volumeVsFees?: {
    volume: number[];
    fees: number[];
    labels: string[];
  };
  topupsVsTransfers?: {
    topups: number[];
    transfers: number[];
    labels: string[];
  };
  changePercentages?: {
    customers: number;
    transactions: number;
    fees: number;
    txAmount: number;
    Total_reserves: number;
    beneficiary: number;
    totalTopups: number;
    totalTransfers: number;
  };
}

export interface DashboardResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: DashboardStats;
  errors: null;
}
