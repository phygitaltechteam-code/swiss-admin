// constants.ts
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

export const CHART_DATA: ChartData[] = [
  {name: 'May', value: 12000},
  {name: 'Jun', value: 18000},
  {name: 'Jul', value: 22000},
  {name: 'Aug', value: 28000},
  {name: 'Sep', value: 32000},
  {name: 'Oct', value: 45280},
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: 'Oct 24, 2023',
    transactionId: '#TRX-78921',
    clientName: 'John Doe',
    transactionType: 'Intl Wire',
    amount: 5000.0,
    feeType: 'Wire Fee',
    totalFeeCharged: 45.0,
  },
  {
    id: '2',
    date: 'Oct 24, 2023',
    transactionId: '#TRX-78920',
    clientName: 'Alice Smith',
    transactionType: 'Card Trans.',
    amount: 1200.0,
    feeType: 'Processing',
    totalFeeCharged: 36.0,
  },
  {
    id: '3',
    date: 'Oct 23, 2023',
    transactionId: '#TRX-78919',
    clientName: 'Robert Johnson',
    transactionType: 'Overdraft',
    amount: null,
    feeType: 'Overdraft',
    totalFeeCharged: 35.0,
  },
  {
    id: '4',
    date: 'Oct 22, 2023',
    transactionId: '#TRX-78918',
    clientName: 'Maria Williams',
    transactionType: 'ACH Pay',
    amount: 7500.0,
    feeType: 'ACH',
    totalFeeCharged: 25.0,
  },
  {
    id: '5',
    date: 'Oct 21, 2023',
    transactionId: '#TRX-78917',
    clientName: 'David Brown',
    transactionType: 'Intl Wire',
    amount: 3200.0,
    feeType: 'Wire Fee',
    totalFeeCharged: 32.0,
  },
  {
    id: '6',
    date: 'Oct 20, 2023',
    transactionId: '#TRX-78916',
    clientName: 'Sarah Miller',
    transactionType: 'Card Trans.',
    amount: 850.0,
    feeType: 'Processing',
    totalFeeCharged: 25.5,
  },
  {
    id: '7',
    date: 'Oct 19, 2023',
    transactionId: '#TRX-78915',
    clientName: 'Michael Wilson',
    transactionType: 'ACH Pay',
    amount: 4200.0,
    feeType: 'ACH',
    totalFeeCharged: 20.0,
  },
  {
    id: '8',
    date: 'Oct 18, 2023',
    transactionId: '#TRX-78914',
    clientName: 'Emma Davis',
    transactionType: 'Overdraft',
    amount: null,
    feeType: 'Overdraft',
    totalFeeCharged: 30.0,
  },
  {
    id: '9',
    date: 'Oct 17, 2023',
    transactionId: '#TRX-78913',
    clientName: 'James Taylor',
    transactionType: 'Intl Wire',
    amount: 15000.0,
    feeType: 'Wire Fee',
    totalFeeCharged: 125.0,
  },
  {
    id: '10',
    date: 'Oct 16, 2023',
    transactionId: '#TRX-78912',
    clientName: 'Olivia Anderson',
    transactionType: 'Card Trans.',
    amount: 950.0,
    feeType: 'Processing',
    totalFeeCharged: 28.5,
  },
];
