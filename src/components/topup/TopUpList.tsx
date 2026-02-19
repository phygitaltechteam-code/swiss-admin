import React, {useState} from 'react';
import {
  DollarSign,
  Bell,
  Hourglass,
  CheckCircle2,
  XCircle,
  Calendar,
  Search,
  Briefcase,
  ShieldCheck,
  BadgeCheck,
  FileText,
  ChevronRight,
  MoreVertical,
  Eye,
  AlertCircle,
  X,
  ChevronDown,
  Filter,
} from 'lucide-react';
import GenericButton from '../Forms/Buttons/GenericButton';
import GenericTable, {Column} from '../Forms/Table/GenericTable';
import toast from 'react-hot-toast';
import {MdTrendingUp} from 'react-icons/md';

// Format large numbers in Indian style (K, L, Cr)
const formatCompactIndian = (num: number): string => {
  const abs = Math.abs(num);

  if (abs >= 10000000) {
    return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
  }
  if (abs >= 100000) {
    return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  }
  if (abs >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

interface TopUpListProps {
  transactions: any;
  onSelectTransaction: (transaction: any) => void;
}

// Helper to calculate stats from transactions
const calculateStats = (transactions: any) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return {
    totalPendingAmount: transactions
      .filter((t) => t.isPending)
      .reduce((sum, t) => sum + t.amount, 0),
    requestsToday: transactions.filter((t) => {
      const createdDate = new Date(t.createdAt);
      return createdDate >= today;
    }).length,
    pendingCount: transactions.filter((t) => t.isPending && !t.isRejected)
      .length,
    approvedCount: transactions.filter((t) => !t.isPending && !t.isRejected)
      .length,
    rejectedCount: transactions.filter((t) => t.isRejected).length,
  };
};

// Format date from API
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

// Map account type to display name
const getAccountTypeDisplay = (type: string) => {
  switch (type) {
    case 'E_PRIVATEACCOUNT':
      return 'E Private Account';
    case 'E_TEMPORARYACCOUNT':
      return 'Temporary Account';
    default:
      return type.replace('E_', '').replace('ACCOUNT', ' Account');
  }
};

export const TopUpList: React.FC<TopUpListProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const [filter, setFilter] = useState<
    'All' | 'Pending' | 'Approved' | 'Rejected'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const stats = calculateStats(transactions);

  const filteredTransactions = transactions.filter((t) => {
    // Status filter
    if (filter !== 'All') {
      if (filter === 'Pending' && !t.isPending) return false;
      if (filter === 'Approved' && (t.isPending || t.isRejected)) return false;
      if (filter === 'Rejected' && !t.isRejected) return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        t.id?.toLowerCase().includes(query) ||
        t.fullname?.toLowerCase().includes(query) ||
        t.email?.toLowerCase().includes(query) ||
        t.phoneNumber?.toLowerCase().includes(query) ||
        t.particular?.toLowerCase().includes(query) ||
        t.amount?.toString().includes(query) ||
        t.walletId?.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Date filter
    if (startDate || endDate) {
      const transactionDate = new Date(t.createdAt);
      const transactionTime = transactionDate.getTime();

      if (startDate) {
        const start = new Date(startDate + 'T00:00:00').getTime();
        if (transactionTime < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate + 'T23:59:59').getTime();
        if (transactionTime > end) return false;
      }
    }

    return true;
  });

  const getStatusBadge = (transaction: any) => {
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

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'E_PRIVATEACCOUNT':
        return (
          <div className="flex size-8 items-center justify-center rounded bg-orange-50 text-orange-600">
            <BadgeCheck size={18} />
          </div>
        );
      case 'E_TEMPORARYACCOUNT':
        return (
          <div className="flex size-8 items-center justify-center rounded bg-purple-50 text-purple-600">
            <Briefcase size={18} />
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 text-gray-600 flex size-8 items-center justify-center rounded">
            <Briefcase size={18} />
          </div>
        );
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Date & Time',
      accessor: 'createdAt',
      render: (item) => (
        <span className="text-gray-500 whitespace-nowrap text-sm">
          {formatTransactionDate(item.createdAt)}
        </span>
      ),
    },
    {
      header: 'Client',
      accessor: 'fullname',
      render: (item) => (
        <div
          className="flex min-w-[140px] flex-col"
          onClick={() => onSelectTransaction(item.id)}
        >
          <span className="text-gray-900 truncate text-sm font-semibold">
            {item.fullname}
          </span>
          <span className="text-gray-500 truncate text-xs">{item.email}</span>
        </div>
      ),
    },
    {
      header: 'Account Type',
      accessor: 'accountType',
      render: (item) => (
        <div
          className="flex min-w-[140px] items-center gap-2"
          onClick={() => onSelectTransaction(item.id)}
        >
          {getAccountIcon(item.accountType)}
          <span className="text-gray-700 whitespace-nowrap text-sm">
            {getAccountTypeDisplay(item.accountType)}
          </span>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item) => (
        <span className="text-gray-900 whitespace-nowrap text-sm font-bold">
          ${item.amount.toLocaleString('en-US')}
          <span className="text-gray-500 ml-1 text-xs">{item.amountType}</span>
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'isPending',
      render: (item) => getStatusBadge(item),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              console.log(' Viewing details for transaction:', item);
              onSelectTransaction(item.id);
            }}
            className="inline-flex items-center justify-center rounded p-1 hover:text-primary dark:hover:text-secondary"
            title="View Details"
          >
            <Eye size={18} />
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
              className="whitespace-nowrap text-xs font-medium text-red-600 hover:underline"
            >
              View Reason
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <div className="shrink-0 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
              Top-Up Approvals
            </h1>
            <p className="text-gray-600 text-xs font-normal sm:text-sm">
              Manage and review incoming top-up requests.
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 lg:gap-8">
          {/* Stats Cards - Horizontal Scroll on Mobile */}
          <div className="w-full overflow-x-auto pb-2 md:overflow-visible md:pb-0">
            <div className="flex min-w-max gap-4 md:grid md:min-w-0 md:grid-cols-2 md:gap-4 lg:grid-cols-5">
              {/* Total Pending Amount */}
              <button
                onClick={() => setFilter('Pending')}
                className={`dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  filter === 'Pending'
                    ? 'bg-orange-50 ring-2 ring-primary/20'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Total Pending Amount
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      ${formatCompactIndian(stats.totalPendingAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-neutral-500">
                  <MdTrendingUp className="mr-1 text-green-600" />
                  <span className="text-green-600">Pending transfers</span>
                </div>
              </button>

              {/* Requests Today */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Requests Today
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {stats.requestsToday}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Pending Count */}
              <button
                onClick={() => setFilter('Pending')}
                className={`dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  filter === 'Pending'
                    ? 'bg-yellow-50 ring-2 ring-yellow-200'
                    : ''
                }`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {stats.pendingCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <Hourglass className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </button>

              {/* Approved Count */}
              <button
                onClick={() => setFilter('Approved')}
                className={`dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  filter === 'Approved'
                    ? 'bg-green-50 ring-2 ring-green-200'
                    : ''
                }`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {stats.approvedCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </button>

              {/* Rejected Count */}
              <button
                onClick={() => setFilter('Rejected')}
                className={`dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm transition-all hover:scale-[1.02] md:w-auto ${
                  filter === 'Rejected' ? 'bg-red-50 ring-2 ring-red-200' : ''
                }`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {stats.rejectedCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <XCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Filters Section - Responsive */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              {/* Status Filters */}
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
                    className="text-gray-400 absolute left-3 top-1.5"
                  />
                  <input
                    type="text"
                    placeholder="Search by ID, name, email, beneficiary..."
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

          {/* Table - Mobile Responsive with Horizontal Scroll */}
          {filteredTransactions.length > 0 ? (
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              {/* Mobile/Tablet Horizontal Scroll Table */}
              <div className="block overflow-x-auto lg:hidden">
                <div className="min-w-[900px] p-4">
                  <GenericTable
                    data={filteredTransactions}
                    columns={columns}
                    itemsPerPage={10}
                    title=""
                    paginationOff={false}
                    searchAble={false}
                    action={false}
                  />
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <GenericTable
                  data={filteredTransactions}
                  columns={columns}
                  itemsPerPage={10}
                  title=""
                  paginationOff={false}
                  searchAble={false}
                  action={false}
                />
              </div>
            </div>
          ) : (
            <div className="border-gray-300 flex flex-col items-center justify-center rounded-xl border border-dashed bg-white px-4 py-12">
              <div className="bg-gray-100 mb-4 flex size-16 items-center justify-center rounded-full">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-2 text-center text-lg font-semibold">
                No transactions found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md text-center">
                {searchQuery || filter !== 'All' || startDate || endDate
                  ? 'No transactions match your current filters. Try adjusting your search criteria.'
                  : 'No top-up transactions available.'}
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
