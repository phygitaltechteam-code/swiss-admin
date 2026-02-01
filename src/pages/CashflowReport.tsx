import React from 'react';
import {MdPictureAsPdf, MdPrint} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';
import Sidebar from './components/Sidebar';
import {
  ChartData,
  StatData,
  Transaction,
} from '@/components/cashflowreport/types';
import Header from '@/components/cashflowreport/Header';
import StatCard from '@/components/cashflowreport/StatCard';
import ChartSection from '@/components/cashflowreport/ChartSection';
import TransactionTable from '@/components/cashflowreport/TransactionTable';
// import Header from './components/Header';
// import StatCard from './components/StatCard';
// import ChartSection from './components/ChartSection';
// import TransactionTable from './components/TransactionTable';
// import { StatData, ChartData, Transaction } from './types';

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
    isPositive: false, // In this context, higher outflow is usually "bad", or represented in red, but the design shows red arrow up. We'll follow the design's visual cues.
    type: 'outflow',
  },
  {
    label: 'Net Cash Flow',
    value: 269500.0,
    change: 0.0,
    changeLabel: 'Target reached',
    isPositive: true, // Neutral logic handled in component
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
];

const CashflowReport: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-row">
      <main className="flex min-h-screen flex-1 flex-col">
        <Header />

        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 p-6 md:p-10">
          {/* Page Title & Actions */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-black dark:text-white">
                Cash Flow Statement
              </h2>
              <p className="dark:text-gray-400 text-base text-[#6B7280]">
                Detailed overview of inflows, outflows, and net cash movement
                for FY 2023.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="dark:bg-gray-800 dark:border-gray-700 text-text-main hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 rounded-lg border border-[#dce0e5] bg-white px-4 text-sm font-bold transition-colors dark:text-white">
                <MdPictureAsPdf size={20} />
                <span>Export PDF</span>
              </button>
              <button className="dark:bg-gray-800 dark:border-gray-700 text-text-main hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 rounded-lg border border-[#dce0e5] bg-white px-4 text-sm font-bold transition-colors dark:text-white">
                <FaFileCsv size={18} />
                <span>Export CSV</span>
              </button>
              <button className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e06d2c]">
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
          <TransactionTable transactions={transactions} />
        </div>
      </main>
    </div>
  );
};

export default CashflowReport;
