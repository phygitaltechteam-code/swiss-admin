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
import {
  FileText,
  DollarSign,
  Bell,
  Hourglass,
  CheckCircle2,
  XCircle,
  Calendar,
  Search,
  X,
  Filter,
  ChevronDown,
} from 'lucide-react'; // used for icons like TopUpList
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
  const baseClasses =
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap';

  let status = '';
  let colorClasses = '';
  let dotColor = '';

  if (transaction.isRejected) {
    status = 'Rejected';
    colorClasses = 'bg-red-50 text-red-800';
    dotColor = 'bg-red-500';
  } else if (transaction.isPending) {
    status = 'Pending';
    colorClasses = 'bg-yellow-50 text-yellow-800';
    dotColor = 'bg-yellow-500';
  } else {
    status = 'Approved';
    colorClasses = 'bg-green-50 text-green-800';
    dotColor = 'bg-green-500';
  }

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      <span className={`size-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
};

// ========== Main Component ==========
export const TransferDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filter, setFilter] = useState<
    'All' | 'Pending' | 'Approved' | 'Rejected'
  >('All');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionTransfer[]
  >([]);

  const {data: apiData, isLoading, error, refetch} = useGetPendingTransfers();

  // Filter transactions
  useEffect(() => {
    if (!apiData?.transactions) return;
    let filtered = apiData.transactions;

    // Status filter
    if (filter !== 'All') {
      filtered = filtered.filter((t) => {
        if (filter === 'Pending') return t.isPending && !t.isRejected;
        if (filter === 'Approved') return !t.isPending && !t.isRejected;
        if (filter === 'Rejected') return t.isRejected;
        return true;
      });
    }

    // Search filter
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

    // Date filter
    if (startDate || endDate) {
      const start = startDate
        ? new Date(startDate + 'T00:00:00').getTime()
        : -Infinity;
      const end = endDate
        ? new Date(endDate + 'T23:59:59').getTime()
        : Infinity;
      filtered = filtered.filter((t) => {
        const txTime = new Date(t.createdAt).getTime();
        return txTime >= start && txTime <= end;
      });
    }

    setFilteredTransactions(filtered);
  }, [apiData, searchQuery, filter, startDate, endDate]);

  // Stats
  const stats = {
    totalPendingAmount: filteredTransactions
      .filter((t) => t.isPending && !t.isRejected)
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    totalTransactions: filteredTransactions.length,
    pendingCount: filteredTransactions.filter(
      (t) => t.isPending && !t.isRejected,
    ).length,
    approvedCount: filteredTransactions.filter(
      (t) => !t.isPending && !t.isRejected,
    ).length,
    rejectedCount: filteredTransactions.filter((t) => t.isRejected).length,
  };

  // Table Columns
  const columns: Column<any>[] = [
    {
      header: 'Date & Time',
      accessor: 'createdAt',
      render: (item) => (
        <span className="text-gray-500 text-sm">
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
            className="inline-flex items-center justify-center rounded p-1 hover:text-primary"
            title="View Details"
          >
            <MdVisibility size={18} />
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

  // Loading / Error states (unchanged)
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
      <div className="shrink-0 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
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

      {/* Mobile Filter Toggle */}
      <div className="border-gray-200 border-b bg-white p-4 lg:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="border-gray-300 flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <span className="text-gray-700 font-medium">
              Filters {filter !== 'All' && `(${filter})`}
            </span>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 lg:gap-8">
          {/* Stats Cards (unchanged) */}
          <div className="w-full overflow-x-auto pb-2 md:overflow-visible md:pb-0">
            <div className="flex min-w-max gap-3 md:grid md:min-w-0 md:grid-cols-2 md:gap-4 lg:grid-cols-5">
              {/* Total Pending Amount */}
              <button
                onClick={() => setFilter('Pending')}
                className={`flex w-[260px] flex-shrink-0 flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  filter === 'Pending'
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
                      ${formatCompactIndian(stats.totalPendingAmount)}
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
                onClick={() => setFilter('Pending')}
                className={`flex w-[150px] flex-shrink-0 flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  filter === 'Pending'
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
                onClick={() => setFilter('Approved')}
                className={`flex w-[150px] flex-shrink-0 flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  filter === 'Approved'
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
                onClick={() => setFilter('Rejected')}
                className={`flex w-[150px] flex-shrink-0 flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  filter === 'Rejected'
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

          {/* Filters Section */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Status Tabs */}
              <div className="bg-gray-100 inline-flex overflow-x-auto rounded-lg p-1">
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(
                  (f) => (
                    <GenericButton
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`whitespace-nowrap px-3 py-1.5 text-sm font-semibold ${
                        filter === f
                          ? 'text-gray-900 bg-white shadow-sm ring-2 ring-primary/20'
                          : 'text-gray-600 hover:text-gray-900 bg-transparent'
                      }`}
                    >
                      {f}
                    </GenericButton>
                  ),
                )}
              </div>

              {/* Search and Date Filters */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
                {/* Date Range */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="border-gray-200 flex h-10 flex-1 items-center rounded-lg border bg-white px-3 shadow-sm">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="text-gray-900 w-full border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
                      max={endDate || undefined}
                    />
                  </div>
                  <span className="text-gray-400 mx-2 hidden sm:block">-</span>
                  <div className="border-gray-200 flex h-10 flex-1 items-center rounded-lg border bg-white px-3 shadow-sm">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="text-gray-900 w-full border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
                      min={startDate || undefined}
                    />
                  </div>
                </div>

                {/* Search */}
                <div className="relative h-10 flex-1 lg:min-w-[240px]">
                  <Search
                    size={18}
                    className="text-gray-400 absolute left-3 top-2.5"
                  />
                  <input
                    type="text"
                    placeholder="Search by ID, name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-gray-200 text-gray-900 h-full w-full rounded-lg border bg-white pl-10 pr-10 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-gray-600 absolute right-3 top-2.5"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table / Mobile Card View */}
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
                                {
                                  minimumFractionDigits: 2,
                                },
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
                  searchAble={false}
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
                No transactions found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md px-4 text-center">
                {searchQuery || filter !== 'All' || startDate || endDate
                  ? 'No transactions match your current filters. Try adjusting your search criteria.'
                  : 'No transfer transactions available.'}
              </p>
              {(searchQuery || filter !== 'All' || startDate || endDate) && (
                <button
                  onClick={() => {
                    setFilter('All');
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
