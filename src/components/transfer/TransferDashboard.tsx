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
import {TransactionTransfer} from '@/types/transactionhistory';
import {useNavigate} from '@tanstack/react-router';
import GenericButton from '../Forms/Buttons/GenericButton';
import GenericTable from '../Forms/Table/GenericTable';
import {useGetPendingTransfers} from '@/lib/react-query/transfer';
import toast from 'react-hot-toast';

const StatCard = ({
  label,
  value,
  subValue,
  subValueColor,
  icon,
  iconBgColor,
  iconColor,
}: any) => (
  <div className="group flex h-full flex-col justify-between rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-start justify-between">
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <span
        className={`rounded-lg p-2 ${iconBgColor} ${iconColor} transition-transform group-hover:scale-110`}
      >
        {icon}
      </span>
    </div>
    <h3 className="text-gray-900 text-2xl font-bold">{value}</h3>
    <p
      className={`mt-1 flex items-center gap-1 text-xs font-bold ${subValueColor}`}
    >
      {subValue}
    </p>
  </div>
);

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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${styles[status] || 'bg-gray-50 text-gray-700'}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dots[status] || 'bg-gray-500'}`}
      ></span>
      {status}
    </span>
  );
};

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

  // Filter transactions when data, search, filter, or dates change
  useEffect(() => {
    if (!apiData?.transactions) return;

    let filtered = apiData.transactions;

    // Apply search filter
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

    // Apply status filter
    if (activeFilter !== 'All Requests') {
      filtered = filtered.filter((t) => {
        if (activeFilter === 'Pending') return t.isPending && !t.isRejected;
        if (activeFilter === 'Approved') return !t.isPending && !t.isRejected;
        if (activeFilter === 'Rejected') return t.isRejected;
        return true;
      });
    }

    // Apply date filter
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

  // Calculate stats
  const calculateStats = () => {
    const transactions =
      filteredTransactions.length > 0
        ? filteredTransactions
        : apiData?.transactions || [];

    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0,
    );
    const pendingCount = transactions.filter(
      (t) => t.isPending && !t.isRejected,
    ).length;
    const rejectedCount = transactions.filter((t) => t.isRejected).length;
    const approvedCount = transactions.filter(
      (t) => !t.isPending && !t.isRejected,
    ).length;

    return {
      totalTransactions,
      totalAmount,
      pendingCount,
      rejectedCount,
      approvedCount,
    };
  };

  const stats = calculateStats();

  // Calculate pending amount
  const pendingAmount = filteredTransactions
    .filter((t) => t.isPending && !t.isRejected)
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const columns: any[] = [
    {
      header: 'Transaction ID',
      accessor: 'id',
      render: (item: TransactionTransfer) => (
        <span className="font-mono text-gray-900 text-sm font-medium">
          {item.id?.slice(0, 8)}...
        </span>
      ),
    },
    {
      header: 'Sender Client',
      accessor: 'senderName',
      render: (item: TransactionTransfer) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {(item.fullname || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 text-sm font-medium">
              {item.fullname || 'Unknown Sender'}
            </span>
            {item.email && (
              <span className="text-gray-500 text-xs">{item.email}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Beneficiary',
      accessor: 'beneficiary',
      render: (item: TransactionTransfer) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium">
            {item.beneficiaryDetails?.fullName || item.beneficiary || 'Unknown'}
          </span>
          <span className="text-gray-500 text-xs">
            {item.beneficiaryDetails?.bankName || ''}
          </span>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item: TransactionTransfer) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-bold">
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
      header: 'Date & Time',
      accessor: 'date',
      render: (item: TransactionTransfer) => (
        <span className="text-gray-600 text-sm">
          {item.date ||
            new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item: TransactionTransfer) => <StatusBadge transaction={item} />,
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (item: TransactionTransfer) => (
        <div className="flex items-center gap-1">
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
        </div>
      ),
    },
  ];

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="text-gray-600 mt-2">Loading transfer requests...</p>
        </div>
      </div>
    );
  }

  // Handle error state
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

  // Use filtered transactions or API data
  const displayTransactions =
    filteredTransactions.length > 0
      ? filteredTransactions
      : apiData?.transactions || [];

  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <div className="shrink-0 px-6 py-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-black">
              Transfer Approvals
            </h1>
            <p className="text-gray-600 text-sm font-normal">
              Manage and review incoming transfer requests.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-lg border bg-white px-4 py-2 font-semibold shadow-sm"
            >
              <MdRefresh className="text-[20px]" />
              Refresh
            </button>
            <GenericButton
              onClick={() => {
                setSearchQuery('');
                setStartDate('');
                setEndDate('');
                setActiveFilter('All Requests');
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 border bg-white px-4 py-2 font-semibold shadow-sm"
            >
              <MdFilterList className="text-[20px] text-primary" />
              Clear Filters
            </GenericButton>
            <GenericButton className="flex items-center gap-2 bg-orange-500 px-4 py-2 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-700">
              <MdDownload className="text-[20px]" />
              Export Report
            </GenericButton>
          </div>
        </div>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="flex h-full flex-col justify-between rounded-xl border border-primary/20 bg-orange-50 p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <p className="text-gray-600 text-sm font-medium">
                  Total Pending Amount
                </p>
                <span className="rounded-lg bg-white p-2 text-primary shadow-sm">
                  <MdPayments className="text-[22px]" />
                </span>
              </div>
              <h3 className="text-gray-900 text-2xl font-bold">
                $
                {pendingAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-green-600">
                <MdTrendingUp /> Pending transfers
              </p>
            </div>

            <StatCard
              label="Total Transactions"
              value={stats.totalTransactions.toString()}
              subValue={`${filteredTransactions.length} filtered`}
              subValueColor="text-gray-600"
              icon={<MdToday className="text-[22px]" />}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatCard
              label="Pending"
              value={stats.pendingCount.toString()}
              subValue="Requires Action"
              subValueColor="text-yellow-600"
              icon={<MdHourglassEmpty className="text-[22px]" />}
              iconBgColor="bg-yellow-50"
              iconColor="text-yellow-600"
            />
            <StatCard
              label="Approved"
              value={stats.approvedCount.toString()}
              subValue="Successful transfers"
              subValueColor="text-green-600"
              icon={<MdCheckCircle className="text-[22px]" />}
              iconBgColor="bg-green-50"
              iconColor="text-green-600"
            />
            <StatCard
              label="Rejected"
              value={stats.rejectedCount.toString()}
              subValue={`${stats.totalTransactions > 0 ? Math.round((stats.rejectedCount / stats.totalTransactions) * 100) : 0}% Rejection Rate`}
              subValueColor="text-red-600"
              icon={<MdCancel className="text-[22px]" />}
              iconBgColor="bg-red-50"
              iconColor="text-red-600"
            />
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:items-center">
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative flex-1 sm:w-72">
                <div className="text-gray-400 pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdSearch className="text-[20px]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-gray-200 text-gray-900 placeholder-gray-400 block w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Search Transaction ID, Client, Beneficiary..."
                />
              </div>
              <div className="text-gray-400 flex w-full items-center gap-2 sm:w-auto">
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

            <div className="flex w-full overflow-x-auto pb-1 lg:w-auto lg:pb-0">
              <div className="bg-gray-100 flex gap-1 rounded-lg p-1">
                {['All Requests', 'Pending', 'Approved', 'Rejected'].map(
                  (tab) => (
                    <GenericButton
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`whitespace-nowrap px-4 py-1.5 text-sm font-semibold transition-colors ${
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

          {/* Transactions Table */}
          {displayTransactions.length > 0 ? (
            <GenericTable
              data={displayTransactions}
              columns={columns}
              itemsPerPage={10}
              title="Recent Transfer Requests"
              searchable={false}
              action={false}
              paginationOff={false}
            />
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <div className="text-gray-400 mb-3 text-5xl">📄</div>
              <h3 className="text-gray-900 mb-1 text-lg font-semibold">
                {searchQuery ||
                activeFilter !== 'All Requests' ||
                startDate ||
                endDate
                  ? 'No matching transfers found'
                  : 'No transfer requests available'}
              </h3>
              <p className="text-gray-600">
                {searchQuery ||
                activeFilter !== 'All Requests' ||
                startDate ||
                endDate
                  ? 'Try changing your search or filter criteria'
                  : 'There are no pending transfer requests at the moment'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
