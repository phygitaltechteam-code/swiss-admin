import {SummaryStats, TransactionTopup} from '@/types/transactionhistory';
import React, {useState} from 'react';
import {TopUpDetail} from './TopUpDetail';
import {TopUpList} from './TopUpList';

// Mock Data
const MOCK_TRANSACTIONS: TransactionTopup[] = [
  {
    id: '88292100',
    transactionId: '#TRX-9982',
    clientName: 'Sarah Jenkins',
    clientId: '8821',
    accountType: 'E Private',
    amount: 5000.0,
    date: 'Oct 24, 10:42 AM',
    rawDate: new Date('2023-10-24T10:42:00'),
    status: 'Pending',
    avatarUrl: 'https://picsum.photos/id/64/100/100',
    trustScore: 98,
    receiptUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
    referenceNo: 'REF-00921-XJY',
    paymentMethod: 'Direct Bank Transfer (ACH)',
    accountNo: '4582',
  },
  {
    id: '44321092',
    transactionId: '#TRX-9983',
    clientName: 'Marcus Thorne',
    clientId: '4432',
    accountType: 'Temporarily',
    amount: 12450.0,
    date: 'Oct 24, 10:15 AM',
    rawDate: new Date('2023-10-24T10:15:00'),
    status: 'Pending',
    avatarUrl: 'https://picsum.photos/id/91/100/100',
    trustScore: 85,
    receiptUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
    referenceNo: 'REF-88219-BKL',
    paymentMethod: 'Wire Transfer',
    accountNo: '9921',
  },
  {
    id: '11092283',
    transactionId: '#TRX-9980',
    clientName: 'Elena Rodriguez',
    clientId: '1109',
    accountType: 'Standard',
    amount: 850.0,
    date: 'Oct 24, 09:30 AM',
    rawDate: new Date('2023-10-24T09:30:00'),
    status: 'Approved',
    avatarUrl: 'https://picsum.photos/id/177/100/100',
    trustScore: 92,
    receiptUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
    referenceNo: 'REF-11029-ZZX',
    paymentMethod: 'Credit Card',
    accountNo: '1120',
  },
  {
    id: '55678821',
    transactionId: '#TRX-9975',
    clientName: 'David Kim',
    clientId: '5567',
    accountType: 'E Private',
    amount: 45000.0,
    date: 'Oct 23, 04:12 PM',
    rawDate: new Date('2023-10-23T16:12:00'),
    status: 'Rejected',
    avatarUrl: 'https://picsum.photos/id/338/100/100',
    trustScore: 45,
    receiptUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
    referenceNo: 'REF-55610-PPL',
    paymentMethod: 'Crypto Transfer',
    accountNo: '5599',
  },
  {
    id: '90218833',
    transactionId: '#TRX-9972',
    clientName: 'Priya Patel',
    clientId: '9021',
    accountType: 'Temporarily',
    amount: 2200.0,
    date: 'Oct 23, 03:45 PM',
    rawDate: new Date('2023-10-23T15:45:00'),
    status: 'Pending',
    avatarUrl: 'https://picsum.photos/id/342/100/100',
    trustScore: 88,
    receiptUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
    referenceNo: 'REF-99120-QWE',
    paymentMethod: 'Direct Bank Transfer (ACH)',
    accountNo: '3321',
  },
];

const MOCK_STATS: SummaryStats = {
  totalPendingAmount: 124500.0,
  totalPendingGrowth: 12,
  requestsToday: 45,
  pendingCount: 12,
  approvedCount: 28,
  rejectedCount: 5,
};

const MainTopupPage: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionTopup | null>(null);

  return (
    <div className="bg-gray-50 flex h-screen w-full">
      <main className="h-full flex-1 overflow-hidden">
        {selectedTransaction ? (
          <TopUpDetail
            transaction={selectedTransaction}
            onBack={() => setSelectedTransaction(null)}
          />
        ) : (
          <TopUpList
            transactions={MOCK_TRANSACTIONS}
            stats={MOCK_STATS}
            onSelectTransaction={setSelectedTransaction}
          />
        )}
      </main>
    </div>
  );
};

export default MainTopupPage;
