import React, {useState, useEffect} from 'react';
import {
  MdFilterList,
  MdDownload,
  MdPayments,
  MdTrendingUp,
  MdToday,
  MdHourglassEmpty,
  MdCheckCircle,
  MdCancel,
  MdSearch,
  MdRefresh,
  MdVisibility,
} from 'react-icons/md';
import {FileText} from 'lucide-react'; // for empty state icon
import {TransactionTransfer} from '@/types/transactionhistory';
import {useNavigate} from '@tanstack/react-router';
import GenericButton from '../Forms/Buttons/GenericButton';
import GenericTable, {Column} from '../Forms/Table/GenericTable';
import {useGetPendingTransfers} from '@/lib/react-query/transfer';
import toast from 'react-hot-toast';

// ========== Helper Functions ==========
const formatTransactionDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date >= today;
  const isYesterday = date >= yesterday && date < today;

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;

  const dateStr = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${dateStr}, ${timeStr}`;
};

const formatCompactIndian = (num: number): string => {
  const abs = Math.abs(num);
  if (abs >= 10000000)
    return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
  if (abs >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  if (abs >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

// ========== Status Badge Component ==========
const StatusBadge = ({transaction}: {transaction: TransactionTransfer}) => {
  const getStatus = () => {
    if (transaction.isRejected) return 'Rejected';
    if (!transaction.isPending && !transaction.isRejected) return 'Approved';
    return 'Pending';
  };
  const status = getStatus();

  const styles: Record<string, string> = {
    Pending: 'bg-yellow-50 text-yellow-700',
    Approved: 'bg-blue-50 text-blue-700',
    Rejected: 'bg-red-50 text-red-700',
  };

  const dots: Record<string, string> = {
    Pending: 'bg-yellow-500',
    Approved: 'bg-blue-500',
    Rejected: 'bg-red-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-bold ${styles[status] || 'bg-gray-50 text-gray-700'}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dots[status] || 'bg-gray-500'}`}
      />
      {status}
    </span>
  );
};

// ========== Stat Card (unchanged) ==========
const StatCard = ({
  label,
  value,
  subValue,
  subValueColor,
  icon,
  iconBgColor,
  iconColor,
}: any) => (
  <div className="group flex h-full flex-col justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
    <div className="mb-3 flex items-start justify-between sm:mb-4">
      <p className="text-gray-600 text-xs font-medium sm:text-sm">{label}</p>
      <span
        className={`rounded-lg p-1.5 sm:p-2 ${iconBgColor} ${iconColor} transition-transform group-hover:scale-110`}
      >
        {React.cloneElement(icon, {className: 'text-[18px] sm:text-[22px]'})}
      </span>
    </div>
    <h3 className="text-gray-900 text-xl font-bold sm:text-2xl">{value}</h3>
    <p
      className={`mt-1 flex items-center gap-1 text-xs font-bold ${subValueColor}`}
    >
      {subValue}
    </p>
  </div>
);

// ========== Main Component ==========
export const TransferDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Requests');
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionTransfer[]
  >([]);

  const {data: apiData, isLoading, error, refetch} = useGetPendingTransfers();

  // Filter transactions
  useEffect(() => {
    if (!apiData?.transactions) return;
    let filtered = apiData.transactions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id?.toLowerCase().includes(query) ||
          t.fullname?.toLowerCase().includes(query) ||
          t.email?.toLowerCase().includes(query) ||
          t.beneficiary?.toLowerCase().includes(query) ||
          t.beneficiaryDetails?.fullName?.toLowerCase().includes(query) ||
          t.particular?.toLowerCase().includes(query),
      );
    }

    if (activeFilter !== 'All Requests') {
      filtered = filtered.filter((t) => {
        if (activeFilter === 'Pending') return t.isPending && !t.isRejected;
        if (activeFilter === 'Approved') return !t.isPending && !t.isRejected;
        if (activeFilter === 'Rejected') return t.isRejected;
        return true;
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.createdAt);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    setFilteredTransactions(filtered);
  }, [apiData, searchQuery, activeFilter, startDate, endDate]);

  // Stats
  const calculateStats = () => {
    const transactions =
      filteredTransactions.length > 0
        ? filteredTransactions
        : apiData?.transactions || [];
    const totalTransactions = transactions.length;
    const pendingCount = transactions.filter(
      (t) => t.isPending && !t.isRejected,
    ).length;
    const rejectedCount = transactions.filter((t) => t.isRejected).length;
    const approvedCount = transactions.filter(
      (t) => !t.isPending && !t.isRejected,
    ).length;
    return {totalTransactions, pendingCount, rejectedCount, approvedCount};
  };
  const stats = calculateStats();

  const pendingAmount = filteredTransactions
    .filter((t) => t.isPending && !t.isRejected)
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Table Columns (updated date formatter)
  const columns: Column<any>[] = [
    {
      header: 'Date & Time',
      accessor: 'createdAt',
      render: (item) => (
        <span className="text-gray-600 text-sm">
          {formatTransactionDate(item.createdAt)}
        </span>
      ),
    },
    {
      header: 'Beneficiary',
      accessor: 'beneficiary',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-medium">
            {item.beneficiaryDetails?.fullName || item.beneficiary || 'Unknown'}
          </span>
          <span className="text-gray-500 max-w-[100px] truncate text-xs">
            {item.beneficiaryDetails?.bankName || ''}
          </span>
        </div>
      ),
    },
    {
      header: 'Sender Client',
      accessor: 'fullname',
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {(item.fullname || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 text-sm font-medium">
              {item.fullname || 'Unknown'}
            </span>
            {item.email && (
              <span className="text-gray-500 max-w-[120px] truncate text-xs">
                {item.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-bold">
            {item.amountType === 'USD' ? '$' : ''}
            {(item.amount || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
          <span className="text-gray-500 text-xs">{item.amountType}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => <StatusBadge transaction={item} />,
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigate({
                to: '/client/transferview',
                search: {transactionId: item.id},
              })
            }
            className="text-gray-500 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            title="View Details"
          >
            <MdVisibility className="text-[20px]" />
          </button>
          {item.isRejected && item.rejectReason && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast(item.rejectReason || 'No reason provided', {
                  icon: '⚠️',
                  duration: 4000,
                });
              }}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              View Reason
            </button>
          )}
        </div>
      ),
    },
  ];

  // Loading / Error states
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary"></div>
          <p className="text-gray-600 mt-2">Loading transfer requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl text-red-500">⚠️</div>
          <h3 className="text-gray-900 mb-2 text-lg font-semibold">
            Failed to load transfers
          </h3>
          <p className="text-gray-600 mb-4">Please try again</p>
          <GenericButton
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-primary px-4 py-2 font-bold text-white"
          >
            <MdRefresh /> Retry
          </GenericButton>
        </div>
      </div>
    );
  }

  const displayTransactions =
    filteredTransactions.length > 0
      ? filteredTransactions
      : apiData?.transactions || [];

  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <div className="shrink-0 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
              Transfer Approvals
            </h1>
            <p className="text-gray-600 text-xs font-normal sm:text-sm">
              Manage and review incoming transfer requests.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 sm:gap-6">
          {/* Stats Cards (unchanged) */}
          <div className="w-full overflow-x-auto pb-2 md:overflow-visible md:pb-0">
            <div className="flex min-w-max gap-3 md:grid md:min-w-0 md:grid-cols-2 md:gap-4 lg:grid-cols-5">
              {/* Total Pending Amount */}
              <button
                onClick={() => setActiveFilter('Pending')}
                className={`flex w-[260px] flex-shrink-0 flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  activeFilter === 'Pending'
                    ? 'border-primary/20 bg-orange-50 ring-2 ring-primary/20'
                    : 'border-stroke bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Total Pending Amount
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-[#0F1535]">
                      ${formatCompactIndian(pendingAmount)}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2">
                    <MdPayments className="text-[20px] text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <MdTrendingUp className="mr-1 text-base" />
                  <span>Pending transfers</span>
                </div>
              </button>

              <div className="flex w-[200px] flex-shrink-0 flex-col justify-between rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Total Transactions
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-[#0F1535]">
                      {stats.totalTransactions}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2">
                    <MdToday className="text-[20px] text-orange-600" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveFilter('Pending')}
                className={`flex w-[150px] flex-shrink-0 flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  activeFilter === 'Pending'
                    ? 'bg-yellow-50 ring-2 ring-yellow-200'
                    : 'border-stroke bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Pending</p>
                    <h3 className="mt-2 text-2xl font-bold text-[#0F1535]">
                      {stats.pendingCount}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2">
                    <MdHourglassEmpty className="text-[20px] text-orange-600" />
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveFilter('Approved')}
                className={`flex w-[150px] flex-shrink-0 flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  activeFilter === 'Approved'
                    ? 'bg-green-50 ring-2 ring-green-200'
                    : 'border-stroke bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Approved
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-[#0F1535]">
                      {stats.approvedCount}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2">
                    <MdCheckCircle className="text-[20px] text-orange-600" />
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveFilter('Rejected')}
                className={`flex w-[150px] flex-shrink-0 flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  activeFilter === 'Rejected'
                    ? 'bg-red-50 ring-2 ring-red-200'
                    : 'border-stroke bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Rejected
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-[#0F1535]">
                      {stats.rejectedCount}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2">
                    <MdCancel className="text-[20px] text-orange-600" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar (unchanged) */}
          <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex w-full flex-col gap-3">
              <div className="relative w-full">
                <div className="text-gray-400 pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdSearch className="text-[18px] sm:text-[20px]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-gray-200 text-gray-900 placeholder-gray-400 block w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Search Transaction ID, Client, Beneficiary..."
                />
              </div>
              <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
                <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-gray-200 text-gray-900 block w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-gray-600 text-sm font-medium">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-gray-200 text-gray-900 block w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full overflow-x-auto pb-1">
              <div className="bg-gray-100 flex min-w-min gap-1 rounded-lg p-1">
                {['All Requests', 'Pending', 'Approved', 'Rejected'].map(
                  (tab) => (
                    <GenericButton
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                        activeFilter === tab
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-600 hover:bg-white hover:text-primary'
                      }`}
                    >
                      {tab}
                    </GenericButton>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* ===== UPDATED TABLE SECTION ===== */}
          {displayTransactions.length > 0 ? (
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              {/* Mobile Card View */}
              <div className="divide-gray-200 divide-y lg:hidden">
                {displayTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="hover:bg-gray-50 cursor-pointer p-4"
                    onClick={() =>
                      navigate({
                        to: '/client/transferview',
                        search: {transactionId: transaction.id},
                      })
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                              {(transaction.fullname || 'U')
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <span className="text-gray-700 text-sm font-medium">
                              {transaction.fullname || 'Unknown'}
                            </span>
                          </div>
                          <StatusBadge transaction={transaction} />
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-gray-900 font-bold">
                              {transaction.amountType === 'USD' ? '$' : ''}
                              {(transaction.amount || 0).toLocaleString(
                                undefined,
                                {minimumFractionDigits: 2},
                              )}
                              <span className="text-gray-500 ml-1 text-sm">
                                {transaction.amountType}
                              </span>
                            </p>
                            <p className="text-gray-500 text-sm">
                              To:{' '}
                              {transaction.beneficiaryDetails?.fullName ||
                                transaction.beneficiary ||
                                'Unknown'}
                            </p>
                            {transaction.beneficiaryDetails?.bankName && (
                              <p className="text-gray-500 text-xs">
                                {transaction.beneficiaryDetails.bankName}
                              </p>
                            )}
                          </div>

                          <p className="text-gray-500 text-xs">
                            {formatTransactionDate(transaction.createdAt)}
                          </p>

                          <p className="text-gray-500 font-mono text-xs">
                            ID: {transaction.id?.substring(0, 12)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    {transaction.isRejected && transaction.rejectReason && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast(
                            transaction.rejectReason || 'No reason provided',
                            {
                              icon: '⚠️',
                              duration: 4000,
                            },
                          );
                        }}
                        className="mt-3 text-xs font-medium text-red-600 hover:underline"
                      >
                        View Rejection Reason
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <GenericTable
                  data={displayTransactions}
                  columns={columns}
                  itemsPerPage={10}
                  title=""
                  searchable={false}
                  action={false}
                  paginationOff={false}
                />
              </div>
            </div>
          ) : (
            <div className="border-gray-300 flex flex-col items-center justify-center rounded-xl border border-dashed bg-white py-12">
              <div className="bg-gray-100 mb-4 flex size-16 items-center justify-center rounded-full">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-2 text-lg font-semibold">
                No transfers found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md px-4 text-center">
                {searchQuery ||
                activeFilter !== 'All Requests' ||
                startDate ||
                endDate
                  ? 'No transfers match your current filters. Try adjusting your search criteria.'
                  : 'No transfer transactions available.'}
              </p>
              {(searchQuery ||
                activeFilter !== 'All Requests' ||
                startDate ||
                endDate) && (
                <button
                  onClick={() => {
                    setActiveFilter('All Requests');
                    setSearchQuery('');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-orange-600"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
