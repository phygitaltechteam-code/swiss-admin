// MainTopupPage.tsx
import {SummaryStats, TransactionTopup} from '@/types/transactionhistory';
import React, {useState, useEffect} from 'react';
import {TopUpDetail} from './TopUpDetail';
import {TopUpList} from './TopUpList';
import {useGetTopupApproved} from '@/lib/react-query/Topup';

// Default/fallback stats
const DEFAULT_STATS: SummaryStats = {
  totalPendingAmount: 0,
  totalPendingGrowth: 0,
  requestsToday: 0,
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
};

const MainTopupPage: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null,
  );
  const {data: topupData, isLoading, error, refetch} = useGetTopupApproved();
  const [transactions, setTransactions] = useState<TransactionTopup[]>([]);
  const [stats, setStats] = useState<SummaryStats>(DEFAULT_STATS);

  // Update local state when data changes
  useEffect(() => {
    if (topupData) {
      setTransactions(topupData.transactions || []);
      setStats(topupData.stats || DEFAULT_STATS);
    }
  }, [topupData]);

  // Handle status updates from TopUpDetail
  const handleStatusUpdate = (
    transactionId: string,
    newStatus: 'Approved' | 'Rejected',
    rejectReason?: string,
  ) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              status: newStatus,
              rejectReason: rejectReason || transaction.rejectReason,
            }
          : transaction,
      ),
    );

    // Update stats based on new status
    setStats((prev) => {
      const newStats = {...prev};

      if (newStatus === 'Approved') {
        newStats.approvedCount += 1;
        newStats.pendingCount -= 1;
      } else if (newStatus === 'Rejected') {
        newStats.rejectedCount += 1;
        newStats.pendingCount -= 1;
      }

      return newStats;
    });

    // Refetch data from server to ensure consistency
    setTimeout(() => {
      refetch();
    }, 500);
  };

  // Debug logging
  useEffect(() => {
    console.log('Topup Data:', topupData);
    console.log('Loading:', isLoading);
    console.log('Error:', error);
  }, [topupData, isLoading, error]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading topup requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 flex h-screen w-full items-center justify-center">
        <div className="rounded-lg bg-red-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl text-red-600">!</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-800">
            Failed to load data
          </h3>
          <p className="mb-4 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : 'Unable to fetch topup requests'}
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex h-screen w-full">
      <main className="h-full flex-1 overflow-hidden">
        {selectedTransaction ? (
          <TopUpDetail
            transactionId={selectedTransaction}
            onBack={() => setSelectedTransaction(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        ) : (
          <TopUpList
            transactions={transactions}
            stats={stats}
            onSelectTransaction={setSelectedTransaction}
          />
        )}
      </main>
    </div>
  );
};

export default MainTopupPage;
