import React from 'react';

import {MdChevronRight, MdDownload} from 'react-icons/md';
import Header from './Header';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';

const TransactionHistoryPage: React.FC = () => {
  return (
    <div className="bg-background-light font-body flex h-screen w-full overflow-hidden">
      {/* Main Content Area */}
      <div className="pattern-bg relative flex h-full flex-1 flex-col overflow-y-auto">
        <div className="pattern-overlay pointer-events-none absolute inset-0 z-0"></div>

        <div className="relative z-10 flex flex-1 flex-col">
          <Header />

          {/* Transaction Section Header */}
          <div className="font-display mb-6 flex flex-wrap items-end justify-between gap-4 px-6 lg:px-10">
            <div className="flex flex-col gap-1">
              <h2 className="text-header-text text-xl font-bold leading-tight">
                Transaction History
              </h2>
              <p className="text-secondary-text text-sm font-normal">
                Detailed list of all movements for this client account.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="text-secondary-text hover:bg-gray-50 flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors">
                <MdDownload className="text-sm" />
                Statement
              </button>
            </div>
          </div>

          {/* Main Transaction Content */}
          <div className="mb-10 px-6 lg:px-10">
            <TransactionFilters />
            <TransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
