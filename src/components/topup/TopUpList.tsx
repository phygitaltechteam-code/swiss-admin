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
  TrendingUp,
  ChevronRight,
  MoreVertical,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react';
import {SummaryStats, TransactionTopup} from '@/types/transactionhistory';
import GenericButton from '../Forms/Buttons/GenericButton';
import {Column} from '@/types';
import GenericTable from '../Forms/Table/GenericTable';
import toast from 'react-hot-toast';

interface TopUpListProps {
  transactions: TransactionTopup[];
  stats: SummaryStats;
  onSelectTransaction: (transaction: TransactionTopup) => void;
}

const parseTransactionDate = (dateStr: string): Date | null => {
  const now = new Date();

  if (dateStr.startsWith('Today')) {
    return now;
  }

  if (dateStr.startsWith('Yesterday')) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }

  // Try normal date parsing (e.g. "12 Sep 2024, 3:15 pm")
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
};

export const TopUpList: React.FC<TopUpListProps> = ({
  transactions,
  stats,
  onSelectTransaction,
}) => {
  const [filter, setFilter] = useState<
    'All' | 'Pending' | 'Approved' | 'Rejected'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState<TransactionTopup[]>(transactions);

  const [selectedRejection, setSelectedRejection] =
    useState<TransactionTopup | null>(null);

  const filteredTransactions = transactions.filter((t) => {
    if (filter !== 'All' && t.status !== filter) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        t.transactionId?.toLowerCase().includes(query) ||
        t.clientName?.toLowerCase().includes(query) ||
        t.clientId?.toLowerCase().includes(query) ||
        t.status?.toLowerCase().includes(query) ||
        t.accountType?.toLowerCase().includes(query) ||
        t.amount?.toString().includes(query) ||
        t.date?.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // DATE FILTERING
    const transactionDate = parseTransactionDate(t.date);
    if (!transactionDate) return true;

    if (startDate) {
      const start = new Date(startDate + 'T00:00:00');
      if (transactionDate < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate + 'T23:59:59');
      if (transactionDate > end) return false;
    }

    return true;
  });

  console.log('Sample transaction date:', transactions[0]?.date);

  const getStatusBadge = (status: string) => {
    const baseClasses =
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium';

    switch (status) {
      case 'Pending':
        return (
          <span className={`${baseClasses} bg-yellow-50 text-yellow-800`}>
            <span className="size-1.5 rounded-full bg-yellow-500"></span>
            {status}
          </span>
        );
      case 'Approved':
        return (
          <span className={`${baseClasses} bg-green-50 text-green-800`}>
            <span className="size-1.5 rounded-full bg-green-500"></span>
            {status}
          </span>
        );
      case 'Rejected':
        return (
          <span className={`${baseClasses} bg-red-50 text-red-800`}>
            <span className="size-1.5 rounded-full bg-red-500"></span>
            {status}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            <span className="bg-gray-500 size-1.5 rounded-full"></span>
            {status}
          </span>
        );
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'E Private':
        return (
          <div className="flex size-8 items-center justify-center rounded bg-orange-50 text-primary">
            <BadgeCheck size={18} />
          </div>
        );
      case 'Temporarily':
        return (
          <div className="flex size-8 items-center justify-center rounded bg-purple-50 text-purple-600">
            <Briefcase size={18} />
          </div>
        );
      case 'Standard':
        return (
          <div className="flex size-8 items-center justify-center rounded bg-green-50 text-green-600">
            <ShieldCheck size={18} />
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

  const handleViewReason = (
    transaction: TransactionTopup,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (transaction.rejectReason) {
      setSelectedRejection(transaction);
    } else {
      toast.error('No rejection reason available');
    }
  };

  const columns: Column<TransactionTopup>[] = [
    {
      header: 'Transaction',
      accessor: 'transactionId',
      render: (item) => (
        <button
          onClick={() => onSelectTransaction(item)}
          className="text-left text-sm font-medium text-primary hover:underline"
        >
          {item.transactionId}
        </button>
      ),
    },
    {
      header: 'Client',
      accessor: 'clientName',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-semibold">
            {item.clientName}
          </span>
          <span className="text-gray-500 text-xs">ID: {item.clientId}</span>
        </div>
      ),
    },
    {
      header: 'Account Type',
      accessor: 'accountType',
      render: (item) => (
        <div className="flex items-center gap-2">
          {getAccountIcon(item.accountType)}
          <span className="text-gray-700 text-sm">
            {item.accountType} Account
          </span>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item) => (
        <span className="text-gray-900 text-sm font-bold">
          $
          {item.amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      header: 'Date & Time',
      accessor: 'date',
      render: (item) => (
        <span className="text-gray-500 text-sm">{item.date}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => getStatusBadge(item.status, item.isUpdating),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectTransaction(item);
            }}
            className="border-gray-200 text-gray-500 flex size-9 items-center justify-center rounded-lg border transition-colors hover:border-primary/50 hover:bg-white hover:text-primary"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          {item.status === 'Rejected' && (
            <button
              onClick={(e) => handleViewReason(item, e)}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              View Reason
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#F9FAFB]">
      {/* Rejection Reason Modal */}
      {selectedRejection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg font-bold">
                    Rejection Reason
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Transaction: {selectedRejection.transactionId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRejection(null)}
                className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedRejection.rejectReason || 'No reason provided'}
                </p>
              </div>
              <p className="text-gray-500 mt-3 text-sm">
                Rejected on: {selectedRejection.date}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRejection(null)}
                className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
          {/* Stats Grid - Make them clickable */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {/* Total Pending */}
            <button
              onClick={() => setFilter('Pending')}
              className={`col-span-1 flex flex-col gap-3 rounded-xl p-5 shadow-sm transition-all hover:scale-[1.02] md:col-span-2 lg:col-span-2 ${
                filter === 'Pending'
                  ? 'bg-orange-50 ring-2 ring-primary/20'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm font-medium">
                  Total Pending Amount
                </p>
                <div className="flex size-8 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-gray-900 text-3xl font-bold leading-none">
                  $
                  {stats.totalPendingAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="flex items-center rounded bg-green-50 px-1.5 py-0.5 text-xs font-bold text-[#078838]">
                  <TrendingUp size={14} className="mr-0.5" />
                  {stats.totalPendingGrowth}%
                </div>
              </div>
              <div className="text-gray-500 mt-2 flex items-center text-xs">
                <span className="flex items-center gap-1">
                  Click to filter Pending transactions
                  <ChevronRight size={12} />
                </span>
              </div>
            </button>

            {/* Requests Today */}
            <div className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm font-medium">
                  Requests Today
                </p>
                <div className="flex size-8 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Bell size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-gray-900 text-2xl font-bold leading-none">
                  {stats.requestsToday}
                </p>
              </div>
            </div>

            {/* Pending */}
            <button
              onClick={() => setFilter('Pending')}
              className={`flex flex-col gap-3 rounded-xl p-5 shadow-sm transition-all hover:scale-[1.02] ${
                filter === 'Pending'
                  ? 'bg-yellow-50 ring-2 ring-yellow-200'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <div className="flex size-8 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
                  <Hourglass size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-gray-900 text-2xl font-bold leading-none">
                  {stats.pendingCount}
                </p>
              </div>
              <div className="text-gray-500 mt-2 flex items-center text-xs">
                <span className="flex items-center gap-1">
                  Click to filter
                  <ChevronRight size={12} />
                </span>
              </div>
            </button>

            {/* Approved */}
            <button
              onClick={() => setFilter('Approved')}
              className={`flex flex-col gap-3 rounded-xl p-5 shadow-sm transition-all hover:scale-[1.02] ${
                filter === 'Approved'
                  ? 'bg-green-50 ring-2 ring-green-200'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <div className="flex size-8 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-gray-900 text-2xl font-bold leading-none">
                  {stats.approvedCount}
                </p>
              </div>
              <div className="text-gray-500 mt-2 flex items-center text-xs">
                <span className="flex items-center gap-1">
                  Click to filter
                  <ChevronRight size={12} />
                </span>
              </div>
            </button>

            {/* Rejected */}
            <button
              onClick={() => setFilter('Rejected')}
              className={`flex flex-col gap-3 rounded-xl p-5 shadow-sm transition-all hover:scale-[1.02] ${
                filter === 'Rejected'
                  ? 'bg-red-50 ring-2 ring-red-200'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm font-medium">Rejected</p>
                <div className="flex size-8 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <XCircle size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-gray-900 text-2xl font-bold leading-none">
                  {stats.rejectedCount}
                </p>
              </div>
              <div className="text-gray-500 mt-2 flex items-center text-xs">
                <span className="flex items-center gap-1">
                  Click to filter
                  <ChevronRight size={12} />
                </span>
              </div>
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="bg-gray-100 inline-flex rounded-lg p-1">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(
                (f) => (
                  <GenericButton
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 text-sm font-semibold shadow-sm transition-all ${
                      filter === f
                        ? 'text-gray-900 bg-white shadow-sm ring-2 ring-primary/20'
                        : 'text-gray-600 hover:text-gray-900 bg-transparent shadow-none'
                    }`}
                  >
                    {f}
                  </GenericButton>
                ),
              )}
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              <div className="border-gray-200 flex h-10 items-center rounded-lg border bg-white px-3 shadow-sm">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-gray-900 w-32 border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
                />
                <span className="text-gray-400 mx-2">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-gray-900 w-32 border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
                />
              </div>
              <div className="relative h-10 min-w-[240px] flex-1 lg:flex-none">
                <Search
                  size={18}
                  className="text-gray-400 absolute left-3 top-2.5"
                />
                <input
                  type="text"
                  placeholder="Search Transaction ID, Client, Status..."
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

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 text-lg font-bold">
                Top-Up Requests
              </h3>
              <p className="text-gray-600 text-sm">
                Showing {filteredTransactions.length} transaction
                {filteredTransactions.length !== 1 ? 's' : ''}
                {filter !== 'All' && ` (${filter} only)`}
                {searchQuery && ` matching "${searchQuery}"`}
                {(startDate || endDate) && ' within selected date range'}
              </p>
            </div>
          </div>

          {/* Table */}
          {filteredTransactions.length > 0 ? (
            <GenericTable
              data={filteredTransactions}
              columns={columns}
              itemsPerPage={10}
              title=""
              paginationOff={false}
              searchAble={false}
              action={false}
            />
          ) : (
            <div className="border-gray-300 flex flex-col items-center justify-center rounded-xl border border-dashed bg-white py-16">
              <div className="bg-gray-100 mb-4 flex size-16 items-center justify-center rounded-full">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-2 text-lg font-semibold">
                No transactions found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md text-center">
                {searchQuery || filter !== 'All' || startDate || endDate
                  ? 'No transactions match your current filters. Try adjusting your search criteria.'
                  : 'No top-up requests available at the moment.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
