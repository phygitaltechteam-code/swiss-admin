import {Transaction, ChartData} from './types';

export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: 'Oct 24, 2023',
    transactionId: 'TXN-884201',
    clientName: 'Acme Corp.',
    transactionType: 'Intl Wire',
    amount: 50000.0,
    feeType: 'Fixed ($45)',
    totalFeeCharged: 45.0,
  },
  {
    id: '2',
    date: 'Oct 24, 2023',
    transactionId: 'TXN-884199',
    clientName: 'John Smith',
    transactionType: 'Card Trans.',
    amount: 1200.0,
    feeType: '2.5%',
    totalFeeCharged: 30.0,
  },
  {
    id: '3',
    date: 'Oct 23, 2023',
    transactionId: 'TXN-884156',
    clientName: 'Global Tech Inc',
    transactionType: 'Overdraft',
    amount: null,
    feeType: 'Fixed ($35)',
    totalFeeCharged: 35.0,
  },
  {
    id: '4',
    date: 'Oct 23, 2023',
    transactionId: 'TXN-884102',
    clientName: 'Sarah Connor',
    transactionType: 'ACH Pay',
    amount: 500.0,
    feeType: 'Fixed ($1)',
    totalFeeCharged: 1.0,
  },
  {
    id: '5',
    date: 'Oct 22, 2023',
    transactionId: 'TXN-883995',
    clientName: 'Stark Industries',
    transactionType: 'Intl Wire',
    amount: 125000.0,
    feeType: 'Fixed ($45)',
    totalFeeCharged: 45.0,
  },
];

export const CHART_DATA: ChartData[] = [
  {name: 'Jan', value: 5500},
  {name: 'Feb', value: 6500},
  {name: 'Mar', value: 7400},
  {name: 'Apr', value: 5900},
  {name: 'May', value: 8100},
  {name: 'Jun', value: 8500},
];
