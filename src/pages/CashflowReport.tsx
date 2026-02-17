import React, {useState, useEffect, useMemo} from 'react';
import {
  MdPictureAsPdf,
  MdPrint,
  MdCalendarToday,
  MdSearch,
  MdExpandMore,
} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';

import {
  ChartData,
  StatData,
  Transaction,
} from '@/components/cashflowreport/types';
import StatCard from '@/components/cashflowreport/StatCard';
import ChartSection from '@/components/cashflowreport/ChartSection';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useGetFlowRange, useGettransaction} from '@/lib/react-query/cashflow';

// Types for API response
interface FlowData {
  month: string;
  inflow: number;
  outFlow: number;
}

interface ApiResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    sixMonth: FlowData[];
    oneYear: FlowData[];
    ytd: FlowData[];
  };
  errors: null;
}

// Fallback data matching your API response structure
const fallbackData: ApiResponse = {
  statusCode: 200,
  status: true,
  message: 'Monthly Cash Flow Graphs retrieved successfully',
  data: {
    sixMonth: [],
    oneYear: [],
    ytd: [],
  },
  errors: null,
};

// Mock transactions (replace with actual API data when available)
const transaction: Transaction[] = [
  {
    id: '1',
    date: 'Feb 24, 2026',
    category: 'Top-up',
    description: 'Wire Transfer from JP Morgan',
    inflow: 50000.0,
    runningBalance: 4100230.5,
  },
];

export function transformTransactions(
  data: any[],
  openingBalance = 0,
): Transaction[] {
  let balance = openingBalance;
  console.log('Transforming transactions with opening balance:', data);

  return (
    data
      .map((item) => {
        const isCredit = item.type === 'CREDIT';
        const amount = Number(item.amount);

        balance = isCredit ? balance + amount : balance - amount;

        return {
          id: item.id,
          date: new Date(item.createdAt).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          category: item.type === 'CREDIT' ? 'Top-up' : 'Transfer',
          description:
            item.particular ||
            (isCredit ? 'Wallet Top-up' : 'Beneficiary Transfer'),
          inflow: isCredit ? amount : undefined,
          outflow: !isCredit ? amount : undefined,
          runningBalance: balance,
        };
      })
      // latest first for table display
      .reverse()
  );
}

const CashflowReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateRange, setDateRange] = useState('Feb 1 - Feb 28, 2026');
  const [timeRange, setTimeRange] = useState<'sixMonth' | 'oneYear' | 'ytd'>(
    'sixMonth',
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const {
    data: hookResult,
    isLoading: isFlowLoading,
    isError: isFlowError,
  } = useGetFlowRange();
  const {data: transactionResult, isLoading: isTxLoading} = useGettransaction();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Derive chart data and stats directly from hookResult
  const {chartData, stats} = useMemo(() => {
    // Default empty state
    let chartData: ChartData[] = [];
    let stats: StatData[] = [];

    if (hookResult?.data) {
      const flowData = hookResult.data as ApiResponse['data'];
      const selectedData = flowData[timeRange] || [];

      // Filter out zero months for cleaner chart (optional)
      const nonZeroData = selectedData.filter(
        (item) => item.inflow > 0 || item.outFlow > 0,
      );

      chartData = nonZeroData.map((item) => ({
        month: item.month.split(' ')[0], // short month name
        inflow: item.inflow,
        outflow: item.outFlow,
      }));

      // Calculate stats (same logic as before, using selectedData or nonZeroData)
      const totalInflow = selectedData.reduce(
        (sum, item) => sum + item.inflow,
        0,
      );
      const totalOutflow = selectedData.reduce(
        (sum, item) => sum + item.outFlow,
        0,
      );
      const netCashFlow = totalInflow - totalOutflow;

      const activeMonths = selectedData.filter(
        (item) => item.inflow > 0 || item.outFlow > 0,
      );
      const avgInflow = activeMonths.length
        ? activeMonths.reduce((sum, item) => sum + item.inflow, 0) /
          activeMonths.length
        : 0;
      const avgOutflow = activeMonths.length
        ? activeMonths.reduce((sum, item) => sum + item.outFlow, 0) /
          activeMonths.length
        : 0;

      // Simple change calculation (you can enhance as needed)
      let inflowChange = 0,
        outflowChange = 0;
      if (activeMonths.length > 1) {
        const prev = activeMonths[activeMonths.length - 2];
        const curr = activeMonths[activeMonths.length - 1];
        inflowChange = prev.inflow
          ? ((curr.inflow - prev.inflow) / prev.inflow) * 100
          : curr.inflow
            ? 100
            : 0;
        outflowChange = prev.outFlow
          ? ((curr.outFlow - prev.outFlow) / prev.outFlow) * 100
          : curr.outFlow
            ? 100
            : 0;
      }

      stats = [
        {
          label: 'Total Inflow',
          value: totalInflow,
          change: inflowChange,
          changeLabel: 'vs previous period',
          isPositive: inflowChange >= 0,
          type: 'inflow',
        },
        {
          label: 'Total Outflow',
          value: totalOutflow,
          change: outflowChange,
          changeLabel: 'vs previous period',
          isPositive: outflowChange <= 0,
          type: 'outflow',
        },
        {
          label: 'Net Cash Flow',
          value: netCashFlow,
          change: 0,
          changeLabel:
            netCashFlow >= 0 ? 'Positive cash flow' : 'Negative cash flow',
          isPositive: netCashFlow >= 0,
          type: 'net',
        },
        {
          label: 'Average Monthly',
          value: avgInflow - avgOutflow,
          change: 0,
          changeLabel: 'per active month',
          isPositive: avgInflow - avgOutflow >= 0,
          type: 'closing',
        },
      ];
    }

    return {chartData, stats};
  }, [hookResult, timeRange]);

  // Transform transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    if (transactionResult?.data) {
      setTransactions(transformTransactions(transactionResult.data));
    }
  }, [transactionResult]);

  // Set loading/error states
  useEffect(() => {
    if (!isFlowLoading && !isTxLoading) {
      setIsLoading(false);
    }
    if (isFlowError) {
      setIsError(true);
    }
  }, [isFlowLoading, isTxLoading, isFlowError]);

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (
      searchQuery &&
      !t.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      categoryFilter &&
      categoryFilter !== 'All Categories' &&
      t.category !== categoryFilter
    ) {
      return false;
    }
    return true;
  });

  // Define columns for GenericTable
  const columns: Column<Transaction>[] = [
    {
      header: 'Date',
      accessor: 'date',
      render: (item) => (
        <span className="text-gray-900 text-sm font-medium dark:text-white">
          {item.date}
        </span>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${
            item.category === 'Top-up'
              ? 'bg-primary/10 text-primary dark:bg-primary/20'
              : item.category === 'Fee'
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                : item.category === 'Transfer'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  : item.category === 'Interest'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : ''
          }`}
        >
          {item.category}
        </span>
      ),
      className: 'min-w-[100px]',
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (item) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {item.description}
        </span>
      ),
      className: 'min-w-[200px]',
    },
    {
      header: 'Inflow (+)',
      accessor: 'inflow',
      render: (item) => (
        <span className="text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">
          {item.inflow ? `+${formatCurrency(item.inflow)}` : '-'}
        </span>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
    },
    {
      header: 'Outflow (-)',
      accessor: 'outflow',
      render: (item) => (
        <span className="text-right text-sm font-bold text-red-600 dark:text-red-400">
          {item.outflow ? formatCurrency(item.outflow) : '-'}
        </span>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
    },
    {
      header: 'Running Balance',
      accessor: 'runningBalance',
      render: (item) => (
        <span className="text-gray-900 text-right text-sm font-bold dark:text-white">
          {formatCurrency(item.runningBalance)}
        </span>
      ),
      className: 'min-w-[140px] text-right',
      sortable: true,
    },
  ];

  // Inside CashflowReport.tsx, replace the handlePrint function with this:

  const handlePrint = () => {
    if (filteredTransactions.length === 0) {
      alert('No data to print. Adjust your filters and try again.');
      return;
    }

    // Compute additional stats
    const transactionCount = filteredTransactions.length;

    // Current date/time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Build filter summary
    const filterParts = [];
    if (dateRange) filterParts.push(`Date: ${dateRange}`);
    if (categoryFilter && categoryFilter !== 'All Categories')
      filterParts.push(`Category: ${categoryFilter}`);
    if (searchQuery) filterParts.push(`Search: "${searchQuery}"`);
    const filterSummary = filterParts.length
      ? filterParts.join(' • ')
      : 'No filters applied';

    // Build table rows with alternating background
    const tableRows = filteredTransactions
      .map(
        (tx, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${tx.date}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 50px; font-size: 11px; font-weight: 600; background: ${
            tx.category === 'Top-up'
              ? '#d1fae5'
              : tx.category === 'Transfer'
                ? '#fef3c7'
                : '#dbeafe'
          }; color: ${
            tx.category === 'Top-up'
              ? '#065f46'
              : tx.category === 'Transfer'
                ? '#92400e'
                : '#1e40af'
          };">${tx.category}</span>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${tx.description}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">
          ${tx.inflow ? `<span style="color: #059669; font-weight: bold;">+${formatCurrency(tx.inflow)}</span>` : '-'}
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">
          ${tx.outflow ? `<span style="color: #dc2626; font-weight: bold;">${formatCurrency(tx.outflow)}</span>` : '-'}
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
          ${formatCurrency(tx.runningBalance)}
        </td>
      </tr>
    `,
      )
      .join('');

    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Cash Flow Statement</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #111827; }
          h1 { color: #1e3a8a; font-size: 24px; margin-bottom: 4px; }
          .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 16px; }
          .header-row { display: flex; justify-content: space-between; align-items: center; }
          .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
          .stat-card { background: #f3f4f6; border-radius: 8px; padding: 12px 16px; flex: 1 0 180px; }
          .stat-title { font-size: 14px; color: #4b5563; }
          .stat-value { font-size: 24px; font-weight: bold; color: #1e3a8a; }
          .filter-summary { background: #eff6ff; padding: 10px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #ff7207; color: white; padding: 8px; text-align: left; }
          td { padding: 6px; border: 1px solid #e5e7eb; }
          .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: right; }
          @media print {
            body { margin: 0.5in; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Cash Flow Statement</h1>
          <div class="header-row">
            <span>Generated: ${dateStr} ${timeStr}</span>
            <span>Total transactions: ${transactionCount}</span>
          </div>
        </div>

        <div class="stats">
          ${stats
            .map(
              (stat) => `
            <div class="stat-card">
              <div class="stat-title">${stat.label}</div>
              <div class="stat-value">${formatCurrency(stat.value)}</div>
              <div style="font-size: 11px; color: ${
                stat.isPositive ? '#059669' : '#dc2626'
              };">${stat.change.toFixed(1)}% ${stat.changeLabel}</div>
            </div>
          `,
            )
            .join('')}
        </div>

        <div class="filter-summary">
          <strong>Applied filters:</strong> ${filterSummary}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Inflow</th>
              <th>Outflow</th>
              <th>Running Balance</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          Printed from Cash Flow Management System
        </div>
      </body>
    </html>
  `;

    const printWindow = window.open(
      '',
      '_blank',
      'width=1000,height=800,scrollbars=yes',
    );
    if (!printWindow) {
      alert('Popup blocked. Please allow popups to print.');
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 250);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Loading cash flow data...
          </p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl text-red-500">⚠️</div>
          <h3 className="text-gray-900 text-xl font-bold dark:text-white">
            Error Loading Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Using fallback data. Please check your API connection.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="hover:bg-primary-dark mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-row">
      <main className="flex min-h-screen flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 p-6 md:p-10">
          {/* Page Title & Actions */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-black dark:text-white">
                Cash Flow Statement
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                Detailed overview of inflows, outflows, and net cash movement
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Time Range Selector */}
              {/* <div className="flex gap-2">
                <button
                  onClick={() => setTimeRange('sixMonth')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    timeRange === 'sixMonth'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setTimeRange('oneYear')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    timeRange === 'oneYear'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  1 Year
                </button>
                <button
                  onClick={() => setTimeRange('ytd')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    timeRange === 'ytd'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  YTD
                </button>
              </div> */}

              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="hover:bg-primary-dark flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-colors"
                >
                  <MdPrint size={20} />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={index} data={stat} />
            ))}
          </div> */}

          {/* Transaction Table */}
          <div className="flex flex-col gap-4">
            {/* Filters & Search */}
            <div className="dark:border-gray-700 dark:bg-gray-800 flex flex-col items-start justify-between gap-4 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
              <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                {/* Date Range */}
                <div className="relative min-w-[200px] flex-1 lg:flex-none">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdCalendarToday className="text-gray-500" size={20} />
                  </div>
                  <input
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                    placeholder="Select date range"
                    type="text"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative min-w-[160px] flex-1 lg:flex-none">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option value="">All Categories</option>
                    <option value="Top-up">Top-up</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                  <div className="text-gray-500 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <MdExpandMore size={20} />
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdSearch className="text-gray-500" size={20} />
                </div>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  placeholder="Search transactions..."
                  type="text"
                />
              </div>
            </div>

            {/* Generic Table */}
            <div className="dark:border-gray-700 dark:bg-gray-800 overflow-hidden bg-white shadow-sm">
              {/* Generic Table Component */}
              <div className="flex-1">
                <GenericTable
                  data={filteredTransactions}
                  columns={columns}
                  searchAble={false} // Using external search
                  action={false} // No action buttons for transactions
                  itemsPerPage={8}
                  paginationOff={false}
                />
              </div>
            </div>

            {/* Chart Section */}
            <div className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-gray-900 text-lg font-bold dark:text-white">
                  Cash Flow Trend
                </h3>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  {timeRange === 'sixMonth' && 'Last 6 Months'}
                  {timeRange === 'oneYear' && 'Last 12 Months'}
                  {timeRange === 'ytd' && 'Year to Date'}
                </div>
              </div>
              <ChartSection
                data={chartData}
                activeTimeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
              {chartData.length === 0 && (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No cash flow data available for the selected period
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CashflowReport;
