import {
  STATS,
  TRANSACTIONS,
} from '@/components/alltransactionreports/constants';
import FilterBar from '@/components/alltransactionreports/FilterBar';
import Header from '@/components/alltransactionreports/Header';
import StatsCards from '@/components/alltransactionreports/StatsCards';
import TransactionTable from '@/components/alltransactionreports/TransactionsTable';
import React from 'react';
import {FaFilePdf, FaFileCsv} from 'react-icons/fa6';
import {FiPrinter} from 'react-icons/fi';

function AllTransaction() {
  return (
    <div className="bg-page-bg font-display relative flex min-h-screen w-full flex-col overflow-x-hidden text-slate-900">
      {/* Main Content Wrapper */}
      <main className="flex min-h-screen flex-col">
        <Header />

        <div className="flex w-full flex-1 flex-col gap-8 px-4 md:px-6 lg:px-8 xl:px-10">
          {/* Page Title & Actions */}
          <div className="flex flex-col items-start justify-between gap-4 pt-6 md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-header-text text-3xl font-extrabold leading-tight tracking-tight">
                All Transaction Reports
              </h2>
              <p className="text-secondary-text text-base">
                Comprehensive log of all financial activities, including
                successful and failed transactions.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="border-gray-200 text-header-text hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-bold shadow-sm transition-colors">
                <FaFilePdf className="text-[16px]" />
                <span>Export PDF</span>
              </button>
              <button className="border-gray-200 text-header-text hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-bold shadow-sm transition-colors">
                <FaFileCsv className="text-[16px]" />
                <span>Export CSV</span>
              </button>
              <button className="flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90">
                <FiPrinter className="text-[16px]" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <StatsCards stats={STATS} />

          {/* Filters & Table Section */}
          <div className="flex flex-col gap-4">
            <FilterBar />
            <TransactionTable transactions={TRANSACTIONS} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllTransaction;
