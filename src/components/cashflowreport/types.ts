export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  inflow?: number;
  outflow?: number;
  runningBalance: number;
}

export interface StatData {
  label: string;
  value: number;
  change: number;
  changeLabel: string;
  isPositive: boolean;
  type: 'inflow' | 'outflow' | 'net' | 'closing';
}

export interface ChartData {
  month: string;
  inflow: number;
  outflow: number;
}
