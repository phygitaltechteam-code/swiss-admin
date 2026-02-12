// Define the exact shape of one transaction from your API
export interface Transaction {
  id: string;
  walletId: string;
  particular: string;
  receiverId: string | null;
  senderId: string;
  beneficiaryId: string | null;
  amount: number; // likely in cents
  fee: number; // likely in cents
  amountType: string;
  accountType: string;
  type: 'DEBIT' | 'CREDIT';
  category: string;
  rejectReason: string | null;
  isPending: boolean;
  isRejected: boolean;
  createdAt: string;
  updatedAt: string;
  beneficiary: any | null;
  fullname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  dob: string;
  isVerified: boolean;
}

// The shape your table and filters expect
interface DisplayTransaction {
  date: string;
  transactionId: string;
  clientName: string;
  transactionType: string; // will map from type + category
  amount: number; // in dollars, with decimals
  feeType: string; // derived from fee or particular
  totalFeeCharged: number; // in dollars
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
