import React from 'react';
import {
  MdCalendarToday,
  MdExpandMore,
  MdSearch,
  MdArrowDownward,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';
import {TRANSACTIONS} from './constants';
import {Transaction} from './types';

const TransactionTable: React.FC = () => {
  const getBadgeStyle = (type: Transaction['transactionType']) => {
    switch (type) {
      case 'Intl Wire':
        return 'bg-blue-50 text-blue-700';
      case 'Card Trans.':
        return 'bg-purple-50 text-purple-700';
      case 'Overdraft':
        return 'bg-orange-50 text-orange-700';
      case 'ACH Pay':
        return 'bg-emerald-50 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Bar */}
      <div className="bg-card-light flex flex-col items-start justify-between gap-4 rounded-xl border border-[#e5e7eb] p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
          {/* Date Picker Mock */}
          <div className="relative min-w-[200px] flex-1 lg:flex-none">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdCalendarToday className="text-text-secondary text-lg" />
            </div>
            <input
              className="text-text-primary placeholder-gray-400 block w-full rounded-lg border border-[#e5e7eb] bg-white py-2 pl-10 pr-3 leading-5 transition-shadow focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="Oct 1 - Oct 31, 2023"
              type="text"
              readOnly
            />
          </div>

          {/* Type Dropdown */}
          <div className="relative min-w-[160px] flex-1 lg:flex-none">
            <select className="text-text-primary block w-full cursor-pointer appearance-none rounded-lg border border-[#e5e7eb] bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
              <option>All Types</option>
              <option>Wire Transfer</option>
              <option>ACH Payment</option>
              <option>International Wire</option>
              <option>Card Transaction</option>
              <option>Overdraft</option>
            </select>
            <div className="text-text-secondary pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <MdExpandMore className="text-xl" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdSearch className="text-text-secondary text-xl" />
          </div>
          <input
            className="text-text-primary placeholder-gray-400 block w-full rounded-lg border border-[#e5e7eb] bg-white py-2 pl-10 pr-3 leading-5 transition-shadow focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            placeholder="Search ID, Client..."
            type="text"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-light overflow-hidden rounded-xl border border-[#e5e7eb] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#e5e7eb]">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="text-text-secondary group cursor-pointer px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors hover:text-primary"
                >
                  <div className="flex items-center gap-1">
                    Date
                    <MdArrowDownward className="text-gray-400 text-base group-hover:text-primary" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="text-text-secondary px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                >
                  Transaction ID
                </th>
                <th
                  scope="col"
                  className="text-text-secondary px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                >
                  Client Name
                </th>
                <th
                  scope="col"
                  className="text-text-secondary px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                >
                  Transaction Type
                </th>
                <th
                  scope="col"
                  className="text-text-secondary px-6 py-4 text-right text-xs font-bold uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="text-text-secondary px-6 py-4 text-center text-xs font-bold uppercase tracking-wider"
                >
                  Fee Type
                </th>
                <th
                  scope="col"
                  className="text-text-secondary px-6 py-4 text-right text-xs font-bold uppercase tracking-wider"
                >
                  Total Fee Charged
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb] bg-white">
              {TRANSACTIONS.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="text-text-primary whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {txn.date}
                  </td>
                  <td className="text-text-secondary font-mono whitespace-nowrap px-6 py-4 text-sm">
                    {txn.transactionId}
                  </td>
                  <td className="text-text-primary whitespace-nowrap px-6 py-4 text-sm font-semibold">
                    {txn.clientName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${getBadgeStyle(
                        txn.transactionType,
                      )}`}
                    >
                      {txn.transactionType}
                    </span>
                  </td>
                  <td className="text-text-primary whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    {txn.amount
                      ? `$${txn.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : '-'}
                  </td>
                  <td className="text-text-secondary whitespace-nowrap px-6 py-4 text-center text-sm">
                    {txn.feeType}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-primary">
                    ${txn.totalFeeCharged.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#e5e7eb] bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-text-secondary text-sm">
                Showing <span className="text-text-primary font-medium">1</span>{' '}
                to <span className="text-text-primary font-medium">5</span> of{' '}
                <span className="text-text-primary font-medium">128</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="text-text-secondary hover:bg-gray-50 relative inline-flex items-center rounded-l-md border border-[#e5e7eb] bg-white px-2 py-2 text-sm font-medium transition-colors"
                >
                  <span className="sr-only">Previous</span>
                  <MdChevronLeft className="text-xl" />
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="relative z-10 inline-flex items-center border border-primary bg-primary/10 px-4 py-2 text-sm font-bold text-primary"
                >
                  1
                </a>
                <a
                  href="#"
                  className="text-text-secondary hover:bg-gray-50 relative inline-flex items-center border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium transition-colors"
                >
                  2
                </a>
                <a
                  href="#"
                  className="text-text-secondary hover:bg-gray-50 relative inline-flex items-center border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium transition-colors"
                >
                  3
                </a>
                <span className="text-text-secondary relative inline-flex items-center border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium">
                  ...
                </span>
                <a
                  href="#"
                  className="text-text-secondary hover:bg-gray-50 relative inline-flex items-center border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium transition-colors"
                >
                  12
                </a>
                <a
                  href="#"
                  className="text-text-secondary hover:bg-gray-50 relative inline-flex items-center rounded-r-md border border-[#e5e7eb] bg-white px-2 py-2 text-sm font-medium transition-colors"
                >
                  <span className="sr-only">Next</span>
                  <MdChevronRight className="text-xl" />
                </a>
              </nav>
            </div>
          </div>
          {/* Mobile Pagination View */}
          <div className="flex w-full items-center justify-between gap-4 sm:hidden">
            <a
              href="#"
              className="text-text-secondary hover:bg-gray-50 relative inline-flex items-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium"
            >
              Previous
            </a>
            <a
              href="#"
              className="text-text-secondary hover:bg-gray-50 relative inline-flex items-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium"
            >
              Next
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
