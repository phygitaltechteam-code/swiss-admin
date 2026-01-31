import React from 'react';
import {MdPictureAsPdf, MdPrint} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';
import StatsCard from '@/components/transfersreport/StatsCard';
import TransferFilters from '@/components/transfersreport/TransferFilters';
import TransferTable from '@/components/transfersreport/TransferTable';
import Header from '@/components/transfersreport/Header';

function TransfersPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen w-full">
      <Header />

      <div className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        {/* Page Title & Actions */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <h2 className="text-header-text text-2xl font-extrabold leading-tight tracking-tight dark:text-white sm:text-3xl">
              Transfers Report
            </h2>
            <p className="text-secondary-text dark:text-gray-400 text-sm sm:text-base">
              Comprehensive log of internal and external money movements for Q4
              2023.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button className="dark:bg-gray-800 dark:border-gray-700 text-header-text hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dce0e5] bg-white px-3 text-sm font-medium transition-colors dark:text-white sm:px-4 sm:font-bold">
              <MdPictureAsPdf className="text-lg sm:text-[20px]" />
              <span>Export PDF</span>
            </button>
            <button className="dark:bg-gray-800 dark:border-gray-700 text-header-text hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dce0e5] bg-white px-3 text-sm font-medium transition-colors dark:text-white sm:px-4 sm:font-bold">
              <FaFileCsv className="text-lg sm:text-[20px]" />
              <span>Export CSV</span>
            </button>
            <button className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-orange-500 px-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 sm:px-4 sm:font-bold">
              <MdPrint className="text-lg sm:text-[20px]" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <StatsCard />

        {/* Table Section */}
        <div className="flex flex-col gap-6">
          <TransferFilters />
          <TransferTable />
        </div>
      </div>
    </div>
  );
}

export default TransfersPage;
