import React from 'react';
import {MdArrowDownward} from 'react-icons/md';
import {MOCK_TRANSFERS} from './constants';
import {TransferStatus} from './types';

const StatusBadge = ({status}: {status: TransferStatus}) => {
  const styles = {
    Completed:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    Pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    Failed:
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    'Under Review':
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold leading-5 sm:px-2.5 sm:py-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const TransferTable = () => {
  return (
    <div className="bg-card-bg dark:border-gray-800 overflow-hidden rounded-xl border border-[#e5e7eb] shadow-sm dark:bg-[#111a22]">
      <div className="overflow-x-auto">
        <table className="dark:divide-gray-800 w-full divide-y divide-[#e5e7eb]">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th
                scope="col"
                className="text-secondary-text dark:text-gray-400 group min-w-[90px] cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
              >
                <div className="flex items-center gap-1">
                  Date
                  <MdArrowDownward className="text-gray-400 text-sm group-hover:text-primary" />
                </div>
              </th>
              <th
                scope="col"
                className="text-secondary-text dark:text-gray-400 min-w-[120px] whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
              >
                Transfer ID
              </th>
              <th
                scope="col"
                className="text-secondary-text dark:text-gray-400 min-w-[140px] whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
              >
                Sender Account
              </th>
              <th
                scope="col"
                className="text-secondary-text dark:text-gray-400 min-w-[140px] whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
              >
                Beneficiary
              </th>
              <th
                scope="col"
                className="text-secondary-text dark:text-gray-400 hidden min-w-[110px] whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider lg:table-cell"
              >
                Bank
              </th>
              <th
                scope="col"
                className="text-secondary-text dark:text-gray-400 hidden min-w-[150px] whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider xl:table-cell"
              >
                SWIFT/IBAN
              </th>
              <th
                scope="col"
                className="text-secondary-text dark:text-gray-400 min-w-[100px] whitespace-nowrap px-4 py-3 text-right text-xs font-bold uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="text-secondary-text dark:text-gray-400 min-w-[80px] whitespace-nowrap px-4 py-3 text-right text-xs font-bold uppercase tracking-wider"
              >
                Fee
              </th>
              <th
                scope="col"
                className="text-secondary-text dark:text-gray-400 min-w-[100px] whitespace-nowrap px-4 py-3 text-center text-xs font-bold uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="dark:divide-gray-800 divide-y divide-[#e5e7eb] bg-white dark:bg-[#111a22]">
            {MOCK_TRANSFERS.map((transfer) => (
              <tr
                key={transfer.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="text-header-text text-sm font-medium dark:text-white">
                    {transfer.date}
                  </div>
                  <div className="text-secondary-text text-xs font-normal">
                    {transfer.time}
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap px-4 py-3 text-sm font-medium text-primary hover:underline">
                  {transfer.transferId}
                </td>
                <td className="px-4 py-3">
                  <div className="text-header-text max-w-[130px] truncate text-sm dark:text-white">
                    {transfer.senderName}
                  </div>
                  <div className="text-secondary-text max-w-[130px] truncate text-xs">
                    {transfer.senderAccount}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-header-text max-w-[130px] truncate text-sm dark:text-white">
                    {transfer.beneficiaryName}
                  </div>
                  <div className="text-secondary-text max-w-[130px] truncate text-xs">
                    {transfer.beneficiaryLocation}
                  </div>
                </td>
                <td className="text-secondary-text dark:text-gray-300 hidden max-w-[100px] truncate whitespace-nowrap px-4 py-3 text-sm lg:table-cell">
                  {transfer.bankName}
                </td>
                <td className="hidden px-4 py-3 xl:table-cell">
                  <div className="font-mono text-secondary-text dark:text-gray-400 max-w-[140px] truncate text-xs">
                    {transfer.swiftIban}
                  </div>
                </td>
                <td className="text-header-text whitespace-nowrap px-4 py-3 text-right text-sm font-bold dark:text-white">
                  $
                  {transfer.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="text-secondary-text dark:text-gray-500 whitespace-nowrap px-4 py-3 text-right text-sm">
                  $
                  {transfer.fee.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  <StatusBadge status={transfer.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </div>
  );
};

const Pagination = () => {
  return (
    <div className="dark:border-gray-800 border-t border-[#e5e7eb] bg-white px-4 py-3 dark:bg-[#111a22]">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-secondary-text dark:text-gray-400 whitespace-nowrap text-sm">
          Showing{' '}
          <span className="text-header-text font-medium dark:text-white">
            1
          </span>{' '}
          to{' '}
          <span className="text-header-text font-medium dark:text-white">
            5
          </span>{' '}
          of{' '}
          <span className="text-header-text font-medium dark:text-white">
            1,248
          </span>{' '}
          results
        </div>
        <div className="w-full overflow-x-auto sm:w-auto">
          <nav
            className="flex items-center justify-center"
            aria-label="Pagination"
          >
            <div className="hidden sm:flex">
              <a
                href="#"
                className="dark:border-gray-700 text-secondary-text dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-l-md border border-[#dce0e5] bg-white px-2 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
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
                className="dark:border-gray-700 text-secondary-text dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                2
              </a>
              <a
                href="#"
                className="dark:border-gray-700 text-secondary-text dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                3
              </a>
              <span className="dark:border-gray-700 text-secondary-text dark:text-gray-400 relative inline-flex items-center border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]">
                ...
              </span>
              <a
                href="#"
                className="dark:border-gray-700 text-secondary-text dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                25
              </a>
              <a
                href="#"
                className="dark:border-gray-700 text-secondary-text dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-r-md border border-[#dce0e5] bg-white px-2 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <div className="flex w-full justify-between sm:hidden">
              <a
                href="#"
                className="dark:border-gray-700 text-secondary-text dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-md border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                Previous
              </a>
              <span className="text-secondary-text dark:text-gray-400 px-4 text-sm">
                Page 1 of 25
              </span>
              <a
                href="#"
                className="dark:border-gray-700 text-secondary-text dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-md border border-[#dce0e5] bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                Next
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TransferTable;
