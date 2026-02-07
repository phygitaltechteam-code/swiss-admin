// components/Dashboard/Dashboard.tsx
import React, {useState, useEffect, useRef} from 'react';
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
import toast from 'react-hot-toast';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {buildDashboardFilters, useDashboardData} from '@/lib/api/dashboard';
import {useGetDashToUpGraph} from '@/lib/react-query/dashboard';

const Dashboard: React.FC = () => {
  const {user} = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    '30d' | '7d' | '24h' | 'custom'
  >('30d');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({start: '', end: ''});
  const datePickerRef = useRef<HTMLDivElement>(null);
  const filters = buildDashboardFilters(
    selectedPeriod,
    selectedPeriod === 'custom' ? customDateRange : undefined,
  );

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
    isError,
  } = useDashboardData(filters);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handlePeriodChange = (period: '30d' | '7d' | '24h' | 'custom') => {
    setSelectedPeriod(period);
    if (period === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
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
      setShowDatePicker(false);
      refetch();
    } else {
      toast.error('Please select both start and end dates');
    }
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="font-body flex min-h-screen w-full items-center justify-center bg-white/50 p-4">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
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
      <div className="font-body flex min-h-screen w-full items-center justify-center bg-white/50 p-4">
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

  // Sample chart data
  const sampleVolumeVsFees = {
    volume: [30, 45, 35, 55, 40, 60, 50],
    fees: [5, 7, 4, 8, 6, 9, 7],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  };

  // const sampleTopupsVsTransfers = {
  //   topups: [65, 59, 80, 81, 56, 55, 40],
  //   transfers: [28, 48, 40, 19, 86, 27, 90],
  //   labels: [
  //     'Week 1',
  //     'Week 2',
  //     'Week 3',
  //     'Week 4',
  //     'Week 5',
  //     'Week 6',
  //     'Week 7',
  //   ],
  // };

  // Responsive breakpoints
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

  return (
    <div className="font-body min-h-screen w-full bg-white/50 text-neutral-500">
      <main className="relative flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {/* Header with controls */}
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-black sm:text-3xl">
                    System Performance
                  </h3>
                  <p className="mt-1 text-sm text-black sm:text-base">
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

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => refetch()}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium sm:px-4 sm:py-2"
                    title="Refresh Data"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>

                  {/* Period Selector - Responsive */}
                  <div className="relative" ref={datePickerRef}>
                    <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-stroke bg-white p-1 shadow-sm">
                      <button
                        onClick={() => handlePeriodChange('30d')}
                        className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          selectedPeriod === '30d'
                            ? 'bg-primary text-white shadow-sm hover:bg-orange-600'
                            : 'hover:bg-gray-50 text-neutral-500 hover:text-black'
                        }`}
                      >
                        <span className="hidden sm:inline">30 Days</span>
                        <span className="sm:hidden">30D</span>
                      </button>
                      <button
                        onClick={() => handlePeriodChange('7d')}
                        className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          selectedPeriod === '7d'
                            ? 'bg-primary text-white shadow-sm hover:bg-orange-600'
                            : 'hover:bg-gray-50 text-neutral-500 hover:text-black'
                        }`}
                      >
                        <span className="hidden sm:inline">7 Days</span>
                        <span className="sm:hidden">7D</span>
                      </button>
                      <button
                        onClick={() => handlePeriodChange('24h')}
                        className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          selectedPeriod === '24h'
                            ? 'bg-primary text-white shadow-sm hover:bg-orange-600'
                            : 'hover:bg-gray-50 text-neutral-500 hover:text-black'
                        }`}
                      >
                        <span className="hidden sm:inline">24 Hours</span>
                        <span className="sm:hidden">24H</span>
                      </button>
                      <div className="bg-gray-200 mx-1 h-5 w-px shrink-0"></div>
                      <button
                        onClick={() => handlePeriodChange('custom')}
                        className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          selectedPeriod === 'custom'
                            ? 'bg-primary text-white shadow-sm hover:bg-orange-600'
                            : 'hover:bg-gray-50 text-neutral-500 hover:text-black'
                        }`}
                      >
                        <CalendarDays className="h-4 w-4" />
                        <span className="hidden sm:inline">Custom</span>
                      </button>
                    </div>

                    {/* Custom Date Range Picker - Dropdown on mobile, inline on desktop */}
                    {selectedPeriod === 'custom' && showDatePicker && (
                      <div
                        className={`${
                          isMobile || isTablet
                            ? 'absolute right-0 top-full z-40 mt-2 w-full min-w-[300px] sm:w-auto'
                            : 'mt-4 w-full'
                        } border-gray-200 rounded-lg border bg-white p-4 shadow-lg`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                            <label className="text-gray-700 text-sm font-medium sm:w-12">
                              From:
                            </label>
                            <input
                              type="date"
                              value={customDateRange.start}
                              onChange={(e) =>
                                handleCustomDateChange('start', e.target.value)
                              }
                              className="border-gray-300 w-full rounded border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                            <label className="text-gray-700 text-sm font-medium sm:w-8">
                              To:
                            </label>
                            <input
                              type="date"
                              value={customDateRange.end}
                              onChange={(e) =>
                                handleCustomDateChange('end', e.target.value)
                              }
                              className="border-gray-300 w-full rounded border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <button
                            onClick={handleApplyCustomFilter}
                            className="mt-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-2 sm:mt-0"
                            disabled={
                              !customDateRange.start || !customDateRange.end
                            }
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid - Responsive */}
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <StatsCard
                  title="Total Clients"
                  value={formatNumber(data.customers)}
                  change={`${changePercentages.customers}%`}
                  isPositive={changePercentages.customers >= 0}
                  icon={Users}
                  compact={isMobile}
                />
                <StatsCard
                  title="Transactions"
                  value={formatNumber(data.transactions)}
                  change={`${changePercentages.transactions}%`}
                  isPositive={changePercentages.transactions >= 0}
                  icon={Receipt}
                  compact={isMobile}
                />
                <StatsCard
                  title="Fees Collected"
                  value={formatCurrency(data.fees)}
                  change={`${changePercentages.fees}%`}
                  isPositive={changePercentages.fees >= 0}
                  icon={DollarSign}
                  compact={isMobile}
                />
                <StatsCard
                  title="Tx Amount"
                  value={formatCurrency(data.txAmount)}
                  change={`${changePercentages.txAmount}%`}
                  isPositive={changePercentages.txAmount >= 0}
                  icon={BarChart3}
                  compact={isMobile}
                />
                <StatsCard
                  title="Total Reserves"
                  value={formatCurrency(data.Total_reserves)}
                  change={`${changePercentages.Total_reserves}%`}
                  isPositive={changePercentages.Total_reserves >= 0}
                  icon={PiggyBank}
                  compact={isMobile}
                />
                <StatsCard
                  title="Beneficiaries"
                  value={formatNumber(data.beneficiary)}
                  change={`${changePercentages.beneficiary}%`}
                  isPositive={changePercentages.beneficiary >= 0}
                  icon={Users2}
                  compact={isMobile}
                />
                <StatsCard
                  title="Total Top-ups"
                  value={formatCurrency(data.totalTopups)}
                  change={`${changePercentages.totalTopups}%`}
                  isPositive={changePercentages.totalTopups >= 0}
                  icon={CreditCard}
                  compact={isMobile}
                />
                <StatsCard
                  title="Total Transfers"
                  value={formatCurrency(data.totalTransfers)}
                  change={`${changePercentages.totalTransfers}%`}
                  isPositive={changePercentages.totalTransfers >= 0}
                  icon={Send}
                  compact={isMobile}
                />
              </div>

              {/* Charts Section - Responsive */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {/* Large Chart */}
                <div className="flex h-[350px] flex-col rounded-xl bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] sm:h-[400px] sm:p-6 lg:col-span-1 lg:col-span-2 xl:col-span-2">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-black sm:text-xl">
                        Transaction Volume vs Fees
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Comparing volume flow against revenue collected.
                      </p>
                    </div>
                    <button className="hover:bg-gray-100 self-start rounded-lg p-2 text-neutral-500 transition-colors hover:text-primary sm:self-auto">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="min-h-0 flex-1">
                    <VolumeVsFeesChart
                      data={sampleVolumeVsFees}
                      responsive={true}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
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
                <div className="flex h-[350px] flex-col rounded-xl bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] sm:h-[400px] sm:p-6 lg:col-span-1">
                  <div className="mb-4">
                    <h3 className="font-display text-lg font-bold text-black sm:text-xl">
                      Top-ups vs Transfers
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Weekly breakdown.
                    </p>
                  </div>

                  <div className="min-h-0 flex-1">
                    <TopUpsVsTransfersChart
                    // data={sampleTopupsVsTransfers}
                    // responsive={true}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-black"></span>
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
            </div>
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
