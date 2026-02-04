// components/Dashboard/Dashboard.tsx
import React, {useState, useCallback, useEffect} from 'react';
import {
  Users,
  Receipt,
  DollarSign,
  BarChart3,
  PiggyBank,
  Users2,
  CreditCard,
  Send,
  MoreVertical,
  CalendarDays,
  RefreshCw,
} from 'lucide-react';
import StatsCard from '@/components/Dashboard/StatsCards';
import {
  TopUpsVsTransfersChart,
  VolumeVsFeesChart,
} from '@/components/Dashboard/Charts';
import {useAuthContext} from '@/context/AuthContext';
//import { buildDashboardFilters, useDashboardData } from '@/lib/react-query/dashboard';
import toast from 'react-hot-toast';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {buildDashboardFilters, useDashboardData} from '@/lib/api/dashboard';

const Dashboard: React.FC = () => {
  const {user} = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    '30d' | '7d' | '24h' | 'custom'
  >('30d');
  const [customDateRange, setCustomDateRange] = useState({start: '', end: ''});

  // Build API filters
  const filters = buildDashboardFilters(
    selectedPeriod,
    selectedPeriod === 'custom' ? customDateRange : undefined,
  );

  // Use the dashboard data hook
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
    isError,
  } = useDashboardData(filters);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Handle period change
  const handlePeriodChange = (period: '30d' | '7d' | '24h' | 'custom') => {
    setSelectedPeriod(period);
  };

  // Handle custom date range change
  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    setCustomDateRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Apply custom filter
  const handleApplyCustomFilter = () => {
    if (customDateRange.start && customDateRange.end) {
      refetch();
    } else {
      toast.error('Please select both start and end dates');
    }
  };

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return '$0';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${formatNumber(amount)}`;
  };

  // Set default custom dates
  useEffect(() => {
    if (
      selectedPeriod === 'custom' &&
      !customDateRange.start &&
      !customDateRange.end
    ) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);

      setCustomDateRange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      });
    }
  }, [selectedPeriod]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="font-body flex h-screen w-full items-center justify-center bg-white/50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary"></div>
          <h3 className="text-gray-900 text-lg font-semibold">
            Loading Dashboard
          </h3>
          <p className="text-gray-600">Fetching latest data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError || error) {
    return (
      <div className="font-body flex h-screen w-full items-center justify-center bg-white/50">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl text-red-500">⚠️</div>
          <h3 className="text-gray-900 mb-2 text-lg font-semibold">
            Failed to Load Dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : 'An unknown error occurred'}
          </p>
          <GenericButton
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-primary px-4 py-2 font-bold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </GenericButton>
        </div>
      </div>
    );
  }

  // Use actual data from API response or empty defaults
  const data = dashboardData || {
    customers: 0,
    transactions: 0,
    fees: 0,
    txAmount: 0,
    Total_reserves: 0,
    beneficiary: 0,
    totalTopups: 0,
    totalTransfers: 0,
  };

  // Use percentage changes from API or defaults
  const changePercentages = data.changePercentages || {
    customers: 12,
    transactions: 5,
    fees: 8,
    txAmount: 15,
    Total_reserves: 2,
    beneficiary: 10,
    totalTopups: -3,
    totalTransfers: 20,
  };

  // Sample chart data (since API doesn't provide it)
  const sampleVolumeVsFees = {
    volume: [30, 45, 35, 55, 40, 60, 50],
    fees: [5, 7, 4, 8, 6, 9, 7],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  };

  const sampleTopupsVsTransfers = {
    topups: [65, 59, 80, 81, 56, 55, 40],
    transfers: [28, 48, 40, 19, 86, 27, 90],
    labels: [
      'Week 1',
      'Week 2',
      'Week 3',
      'Week 4',
      'Week 5',
      'Week 6',
      'Week 7',
    ],
  };

  return (
    <div className="font-body flex w-full overflow-hidden bg-white/50 text-neutral-500">
      <main className="relative flex h-full flex-1 flex-col transition-all duration-300">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6 lg:p-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
              {/* Header with controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-header font-display text-2xl font-bold text-black">
                    System Performance
                  </h3>
                  <p className="text-sm text-black">
                    Current Filter:{' '}
                    <span className="font-medium text-primary">
                      {filters.filter === '30Days'
                        ? '30 Days'
                        : filters.filter === '7Days'
                          ? '7 Days'
                          : filters.filter === '24Hours'
                            ? '24 Hours'
                            : 'Custom Range'}
                    </span>
                    {filters.from && filters.to && (
                      <span className="text-gray-600 ml-2">
                        ({filters.from} to {filters.to})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => refetch()}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium"
                    title="Refresh Data"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                  <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-stroke bg-white p-1 shadow-sm">
                    <button
                      onClick={() => handlePeriodChange('30d')}
                      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedPeriod === '30d'
                          ? 'bg-primary text-white shadow-sm hover:bg-orange-600'
                          : 'hover:bg-gray-50 hover:text-header text-neutral-500'
                      }`}
                    >
                      30 Days
                    </button>
                    <button
                      onClick={() => handlePeriodChange('7d')}
                      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedPeriod === '7d'
                          ? 'bg-primary text-white shadow-sm hover:bg-orange-600'
                          : 'hover:bg-gray-50 hover:text-header text-neutral-500'
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => handlePeriodChange('24h')}
                      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedPeriod === '24h'
                          ? 'bg-primary text-white shadow-sm hover:bg-orange-600'
                          : 'hover:bg-gray-50 hover:text-header text-neutral-500'
                      }`}
                    >
                      24 Hours
                    </button>
                    <div className="bg-gray-200 mx-1 h-5 w-px shrink-0"></div>
                    <button
                      onClick={() => handlePeriodChange('custom')}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedPeriod === 'custom'
                          ? 'bg-primary text-white shadow-sm hover:bg-orange-600'
                          : 'hover:bg-gray-50 hover:text-header text-neutral-500'
                      }`}
                    >
                      <CalendarDays className="h-4 w-4" />
                      Custom
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Date Range Picker */}
              {selectedPeriod === 'custom' && (
                <div className="border-gray-200 flex flex-wrap items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <label className="text-gray-700 text-sm font-medium">
                      From:
                    </label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) =>
                        handleCustomDateChange('start', e.target.value)
                      }
                      className="border-gray-300 rounded border px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-700 text-sm font-medium">
                      To:
                    </label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) =>
                        handleCustomDateChange('end', e.target.value)
                      }
                      className="border-gray-300 rounded border px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={handleApplyCustomFilter}
                    className="ml-auto rounded bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!customDateRange.start || !customDateRange.end}
                  >
                    Apply Filter
                  </button>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatsCard
                  title="Total Clients"
                  value={formatNumber(data.customers)}
                  change={`${changePercentages.customers}%`}
                  isPositive={changePercentages.customers >= 0}
                  icon={Users}
                />
                <StatsCard
                  title="Transactions"
                  value={formatNumber(data.transactions)}
                  change={`${changePercentages.transactions}%`}
                  isPositive={changePercentages.transactions >= 0}
                  icon={Receipt}
                />
                <StatsCard
                  title="Fees Collected"
                  value={formatCurrency(data.fees)}
                  change={`${changePercentages.fees}%`}
                  isPositive={changePercentages.fees >= 0}
                  icon={DollarSign}
                />
                <StatsCard
                  title="Tx Amount"
                  value={formatCurrency(data.txAmount)}
                  change={`${changePercentages.txAmount}%`}
                  isPositive={changePercentages.txAmount >= 0}
                  icon={BarChart3}
                />
                <StatsCard
                  title="Total Reserves"
                  value={formatCurrency(data.Total_reserves)}
                  change={`${changePercentages.Total_reserves}%`}
                  isPositive={changePercentages.Total_reserves >= 0}
                  icon={PiggyBank}
                />
                <StatsCard
                  title="Beneficiaries"
                  value={formatNumber(data.beneficiary)}
                  change={`${changePercentages.beneficiary}%`}
                  isPositive={changePercentages.beneficiary >= 0}
                  icon={Users2}
                />
                <StatsCard
                  title="Total Top-ups"
                  value={formatCurrency(data.totalTopups)}
                  change={`${changePercentages.totalTopups}%`}
                  isPositive={changePercentages.totalTopups >= 0}
                  icon={CreditCard}
                />
                <StatsCard
                  title="Total Transfers"
                  value={formatCurrency(data.totalTransfers)}
                  change={`${changePercentages.totalTransfers}%`}
                  isPositive={changePercentages.totalTransfers >= 0}
                  icon={Send}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Large Chart */}
                <div className="flex h-[400px] flex-col rounded-xl bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] xl:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-header font-display text-lg font-bold text-black">
                        Transaction Volume vs Fees
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Comparing volume flow against revenue collected.
                      </p>
                    </div>
                    <button className="hover:bg-gray-100 rounded-lg p-2 text-neutral-500 transition-colors hover:text-primary">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="min-h-0 w-full flex-1">
                    <VolumeVsFeesChart data={sampleVolumeVsFees} />
                  </div>

                  <div className="mt-2 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-primary"></span>
                      <span className="text-xs font-medium text-neutral-500">
                        Volume
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-navy h-3 w-3 rounded-full"></span>
                      <span className="text-xs font-medium text-neutral-500">
                        Fees
                      </span>
                    </div>
                  </div>
                </div>

                {/* Small Chart */}
                <div className="flex h-[400px] flex-col rounded-xl bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] xl:col-span-1">
                  <div className="mb-2">
                    <h3 className="text-header font-display text-lg font-bold text-black">
                      Top-ups vs Transfers
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Weekly breakdown.
                    </p>
                  </div>

                  <div className="min-h-0 w-full flex-1">
                    <TopUpsVsTransfersChart data={sampleTopupsVsTransfers} />
                  </div>

                  <div className="mt-2 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-navy h-3 w-3 rounded-full"></span>
                      <span className="text-xs font-medium text-neutral-500">
                        Top-ups
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-primary"></span>
                      <span className="text-xs font-medium text-neutral-500">
                        Transfers
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Summary Card */}
              <div className="border-gray-100 rounded-xl border bg-white p-6 shadow-sm">
                <h4 className="text-gray-900 mb-4 text-lg font-bold">
                  Data Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-gray-600 text-sm">Filter Applied</p>
                    <p className="font-semibold">{filters.filter}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Last Updated</p>
                    <p className="font-semibold">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="font-semibold">
                      {formatCurrency(data.txAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Active Period</p>
                    <p className="font-semibold">{selectedPeriod}</p>
                  </div>
                </div>
              </div>
            </div>
            <footer className="mb-6 mt-12 text-center">
              <p className="text-xs text-secondary/60">
                © {new Date().getFullYear()} Nexus Bank Admin Portal. All
                rights reserved. Version 2.4.0
              </p>
              <p className="text-gray-500 mt-1 text-xs">
                Data fetched: {new Date().toLocaleString()}
              </p>
            </footer>
          </div>
        </div>
      </main>

      {/* Mobile Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
