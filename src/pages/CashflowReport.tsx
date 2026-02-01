import React, {useState} from 'react';
import {
  MdPictureAsPdf,
  MdPrint,
  MdCalendarToday,
  MdSearch,
  MdExpandMore,
  MdArrowDownward,
} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';

import {
  ChartData,
  StatData,
  Transaction,
} from '@/components/cashflowreport/types';
import Header from '@/components/cashflowreport/Header';
import StatCard from '@/components/cashflowreport/StatCard';
import ChartSection from '@/components/cashflowreport/ChartSection';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';

// Mock Data
const stats: StatData[] = [
  {
    label: 'Total Inflow',
    value: 1250000.0,
    change: 12.5,
    changeLabel: 'vs last month',
    isPositive: true,
    type: 'inflow',
  },
  {
    label: 'Total Outflow',
    value: 980500.0,
    change: 5.2,
    changeLabel: 'vs last month',
    isPositive: false,
    type: 'outflow',
  },
  {
    label: 'Net Cash Flow',
    value: 269500.0,
    change: 0.0,
    changeLabel: 'Target reached',
    isPositive: true,
    type: 'net',
  },
  {
    label: 'Closing Balance',
    value: 4100230.5,
    change: 8.4,
    changeLabel: 'vs last year',
    isPositive: true,
    type: 'closing',
  },
];

const chartData: ChartData[] = [
  {month: 'Jan', inflow: 600000, outflow: 500000},
  {month: 'Feb', inflow: 800000, outflow: 650000},
  {month: 'Mar', inflow: 950000, outflow: 450000},
  {month: 'Apr', inflow: 650000, outflow: 750000},
  {month: 'May', inflow: 1100000, outflow: 900000},
  {month: 'Jun', inflow: 1200000, outflow: 800000},
];

const transactions: Transaction[] = [
  {
    id: '1',
    date: 'Oct 24, 2023',
    category: 'Top-up',
    description: 'Wire Transfer from JP Morgan',
    inflow: 50000.0,
    runningBalance: 4100230.5,
  },
  {
    id: '2',
    date: 'Oct 23, 2023',
    category: 'Fee',
    description: 'Monthly Maintenance',
    outflow: 50.0,
    runningBalance: 4050230.5,
  },
  {
    id: '3',
    date: 'Oct 22, 2023',
    category: 'Transfer',
    description: 'Payroll Disbursement',
    outflow: 120000.0,
    runningBalance: 4050280.5,
  },
  {
    id: '4',
    date: 'Oct 21, 2023',
    category: 'Top-up',
    description: 'ACH Deposit: Stripe Inc.',
    inflow: 24500.0,
    runningBalance: 4170280.5,
  },
  {
    id: '5',
    date: 'Oct 20, 2023',
    category: 'Transfer',
    description: 'Vendor Payment: AWS Services',
    outflow: 4200.0,
    runningBalance: 4145780.5,
  },
  {
    id: '6',
    date: 'Oct 19, 2023',
    category: 'Interest',
    description: 'Monthly Interest Payment',
    inflow: 1250.0,
    runningBalance: 4149980.5,
  },
  {
    id: '7',
    date: 'Oct 18, 2023',
    category: 'Fee',
    description: 'Wire Transfer Fee',
    outflow: 25.0,
    runningBalance: 4148730.5,
  },
  {
    id: '8',
    date: 'Oct 17, 2023',
    category: 'Top-up',
    description: 'Client Payment: ABC Corp',
    inflow: 35000.0,
    runningBalance: 4148755.5,
  },
];

const CashflowReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateRange, setDateRange] = useState('Oct 1 - Oct 31, 2023');

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    if (
      searchQuery &&
      !transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      categoryFilter &&
      categoryFilter !== 'All Categories' &&
      transaction.category !== categoryFilter
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

  const handleView = (transaction: Transaction) => {
    console.log('View transaction:', transaction);
    // Open transaction details modal or navigate
  };

  const handleEdit = (transaction: Transaction) => {
    console.log('Edit transaction:', transaction);
    // Open edit modal
  };

  const handleDelete = (transaction: Transaction) => {
    console.log('Delete transaction:', transaction);
    // Show confirmation dialog
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
    // PDF export logic
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // CSV export logic
  };

  const handlePrint = () => {
    console.log('Printing...');
    window.print();
  };

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
                for FY 2023.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-bold transition-colors dark:text-white"
              >
                <MdPictureAsPdf size={20} />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-bold transition-colors dark:text-white"
              >
                <FaFileCsv size={18} />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="hover:bg-primary-dark flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-colors"
              >
                <MdPrint size={20} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={index} data={stat} />
            ))}
          </div>

          {/* Chart Section */}
          <ChartSection data={chartData} />

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
                    <option value="Fee">Fee</option>
                    <option value="Interest">Interest</option>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default CashflowReport;
