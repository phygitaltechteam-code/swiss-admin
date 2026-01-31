import React from 'react';
// import Sidebar from './components/Sidebar';
// import Header from './components/Header';
// import StatsCard from './components/StatsCard';
// import TransactionTable from './components/TransactionTable';
import {
  MdAccountBalanceWallet,
  MdReceiptLong,
  MdPayments,
  MdPending,
  MdPictureAsPdf,
  MdPrint,
  MdCalendarToday,
  MdExpandMore,
  MdSearch,
} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';
import Header from '@/components/wallettopupreport/Header';
import StatsCard from '@/components/wallettopupreport/StatsCard';
import TransactionTable from '@/components/wallettopupreport/TransactionTable';

const WalletReport: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-row">
      <main className="flex min-h-screen flex-1 flex-col">
        <Header />

        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 p-6 md:p-10">
          {/* Page Header */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-black dark:text-white">
                Wallet Top-Up Report
              </h2>
              <p className="text-text-muted dark:text-gray-400 text-base">
                Detailed log of all wallet funding requests, payment proofs, and
                verification status.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-text-main hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-bold transition-colors dark:text-white">
                <MdPictureAsPdf className="text-[20px]" />
                <span>Export PDF</span>
              </button>
              <button className="dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-text-main hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-bold transition-colors dark:text-white">
                <FaFileCsv className="text-[18px]" />
                <span>Export CSV</span>
              </button>
              <button className="flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#d96a2b]">
                <MdPrint className="text-[20px]" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Top-Ups Value"
              value="$4,850,240.00"
              trend="8.2%"
              trendDirection="up"
              subtext="vs last month"
              icon={<MdAccountBalanceWallet />}
            />
            <StatsCard
              title="Total Requests"
              value="1,245"
              trend="12.5%"
              trendDirection="up"
              subtext="volume increase"
              icon={<MdReceiptLong />}
            />
            <StatsCard
              title="Most Used Method"
              value="Bank Transfer"
              subtext="65% of total volume"
              icon={<MdPayments />}
              highlightValue
            />
            <StatsCard
              title="Pending Approval"
              value="24"
              icon={<MdPending />}
              alert
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4">
            <div className="border-gray-200 dark:border-gray-800 flex flex-col items-start justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-[#111a22] lg:flex-row lg:items-center">
              <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                {/* Date Picker */}
                <div className="relative min-w-[200px] flex-1 lg:flex-none">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdCalendarToday className="text-text-muted text-[20px]" />
                  </div>
                  <input
                    type="text"
                    className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-text-main placeholder-gray-500 block w-full rounded-lg border bg-white py-2 pl-10 pr-3 leading-5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white sm:text-sm"
                    placeholder="Oct 1 - Oct 31, 2023"
                  />
                </div>

                {/* Account Type Dropdown */}
                <div className="relative min-w-[160px] flex-1 lg:flex-none">
                  <select className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-text-main block w-full appearance-none rounded-lg border bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm">
                    <option>All Account Types</option>
                    <option>E-Private</option>
                    <option>Temporary</option>
                    <option>Corporate</option>
                  </select>
                  <div className="text-text-muted pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <MdExpandMore className="text-[20px]" />
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="relative min-w-[160px] flex-1 lg:flex-none">
                  <select className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-text-main block w-full appearance-none rounded-lg border bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm">
                    <option>All Statuses</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                  <div className="text-text-muted pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <MdExpandMore className="text-[20px]" />
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdSearch className="text-text-muted text-[20px]" />
                </div>
                <input
                  type="text"
                  className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-text-main placeholder-gray-500 block w-full rounded-lg border bg-white py-2 pl-10 pr-3 leading-5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white sm:text-sm"
                  placeholder="Search client, ID..."
                />
              </div>
            </div>

            {/* Table */}
            <TransactionTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletReport;
