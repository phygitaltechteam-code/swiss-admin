export interface Transaction {
  id: string;
  date: string;
  transactionId: string;
  clientName: string;
  transactionType: 'Intl Wire' | 'Card Trans.' | 'Overdraft' | 'ACH Pay';
  amount: number | null;
  feeType: string;
  totalFeeCharged: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface StatData {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  isCurrency?: boolean;
}
