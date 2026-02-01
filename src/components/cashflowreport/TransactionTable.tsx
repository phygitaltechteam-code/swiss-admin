import React from 'react';
import {
  MdCalendarToday,
  MdSearch,
  MdExpandMore,
  MdArrowDownward,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';
import {Transaction} from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({transactions}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="dark:bg-dark-surface dark:border-gray-800 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
          <div className="relative min-w-[200px] flex-1 lg:flex-none">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdCalendarToday className="text-[#6B7280]" size={20} />
            </div>
            <input
              className="dark:border-gray-700 dark:bg-gray-800 text-text-main placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2 pl-10 pr-3 leading-5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white sm:text-sm"
              placeholder="Oct 1 - Oct 31, 2023"
              type="text"
            />
          </div>
          <div className="relative min-w-[160px] flex-1 lg:flex-none">
            <select className="dark:border-gray-700 dark:bg-gray-800 text-text-main block w-full appearance-none rounded-lg border border-[#dce0e5] bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm">
              <option>All Categories</option>
              <option>Top-up</option>
              <option>Transfer</option>
              <option>Fee</option>
              <option>Interest</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6B7280]">
              <MdExpandMore size={20} />
            </div>
          </div>
        </div>
        <div className="relative w-full lg:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdSearch className="text-[#6B7280]" size={20} />
          </div>
          <input
            className="dark:border-gray-700 dark:bg-gray-800 text-text-main placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2 pl-10 pr-3 leading-5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white sm:text-sm"
            placeholder="Search transactions..."
            type="text"
          />
        </div>
      </div>

      {/* Table */}
      <div className="dark:bg-dark-surface dark:border-gray-800 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="dark:divide-gray-800 min-w-full divide-y divide-[#e5e7eb]">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="dark:text-gray-400 group cursor-pointer px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    Date
                    <MdArrowDownward
                      size={16}
                      className="text-gray-400 transition-colors group-hover:text-primary"
                    />
                  </div>
                </th>
                <th className="dark:text-gray-400 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Category
                </th>
                <th className="dark:text-gray-400 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Description
                </th>
                <th className="dark:text-gray-400 px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Inflow (+)
                </th>
                <th className="dark:text-gray-400 px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Outflow (-)
                </th>
                <th className="dark:text-gray-400 px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Running Balance
                </th>
              </tr>
            </thead>
            <tbody className="dark:bg-dark-surface dark:divide-gray-800 divide-y divide-[#e5e7eb] bg-white">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="text-text-main whitespace-nowrap px-6 py-4 text-sm font-medium dark:text-white">
                    {tx.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${
                        tx.category === 'Top-up'
                          ? 'bg-primary/10 text-primary dark:bg-primary/20'
                          : tx.category === 'Fee'
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                            : tx.category === 'Transfer'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              : ''
                      }`}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td className="dark:text-gray-300 whitespace-nowrap px-6 py-4 text-sm text-[#6B7280]">
                    {tx.description}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {tx.inflow
                      ? `+$${tx.inflow.toLocaleString(undefined, {minimumFractionDigits: 2})}`
                      : '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-red-600 dark:text-red-400">
                    {tx.outflow
                      ? `$${tx.outflow.toLocaleString(undefined, {minimumFractionDigits: 2})}`
                      : '-'}
                  </td>
                  <td className="text-text-main whitespace-nowrap px-6 py-4 text-right text-sm font-bold dark:text-white">
                    $
                    {tx.runningBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="dark:bg-dark-surface dark:border-gray-800 flex items-center justify-between border-t border-[#e5e7eb] bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="dark:text-gray-400 text-sm text-[#6B7280]">
                Showing{' '}
                <span className="text-text-main font-medium dark:text-white">
                  1
                </span>{' '}
                to{' '}
                <span className="text-text-main font-medium dark:text-white">
                  5
                </span>{' '}
                of{' '}
                <span className="text-text-main font-medium dark:text-white">
                  42
                </span>{' '}
                results
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
              >
                <a
                  href="#"
                  className="dark:border-gray-700 dark:bg-dark-surface dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-l-md border border-[#dce0e5] bg-white px-2 py-2 text-sm font-medium text-[#6B7280]"
                >
                  <span className="sr-only">Previous</span>
                  <MdChevronLeft size={20} />
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
                  className="dark:bg-dark-surface dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium text-[#6B7280]"
                >
                  2
                </a>
                <a
                  href="#"
                  className="dark:bg-dark-surface dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium text-[#6B7280]"
                >
                  3
                </a>
                <span className="dark:border-gray-700 dark:bg-dark-surface dark:text-gray-400 relative inline-flex items-center border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium text-[#6B7280]">
                  ...
                </span>
                <a
                  href="#"
                  className="dark:bg-dark-surface dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium text-[#6B7280]"
                >
                  8
                </a>
                <a
                  href="#"
                  className="dark:border-gray-700 dark:bg-dark-surface dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-r-md border border-[#dce0e5] bg-white px-2 py-2 text-sm font-medium text-[#6B7280]"
                >
                  <span className="sr-only">Next</span>
                  <MdChevronRight size={20} />
                </a>
              </nav>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-4 sm:hidden">
            <a
              href="#"
              className="dark:border-gray-700 dark:text-gray-400 dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-md border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium text-[#6B7280]"
            >
              Previous
            </a>
            <a
              href="#"
              className="dark:border-gray-700 dark:text-gray-400 dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-md border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium text-[#6B7280]"
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
