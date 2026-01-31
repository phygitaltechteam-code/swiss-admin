import React from 'react';
import {Transaction} from './types';
import {FiArrowDown} from 'react-icons/fi';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({transactions}) => {
  const getStatusBadge = (status: Transaction['status']) => {
    let classes = '';
    let dotClass = '';
    switch (status) {
      case 'Success':
        classes = 'bg-green-100 text-green-800';
        dotClass = 'bg-green-600';
        break;
      case 'Failed':
        classes = 'bg-red-100 text-red-800';
        dotClass = 'bg-red-600';
        break;
      case 'Pending':
        classes = 'bg-yellow-100 text-yellow-800';
        dotClass = 'bg-yellow-600';
        break;
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
      >
        <span className={`size-1.5 rounded-full ${dotClass}`}></span>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: Transaction['type']) => {
    const classes =
      type === 'Credit'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-orange-50 text-orange-700 border-orange-200';

    return (
      <span
        className={`inline-flex rounded border px-2 py-0.5 text-xs font-semibold leading-5 ${classes}`}
      >
        {type}
      </span>
    );
  };

  return (
    <div className="border-gray-200 flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="divide-gray-200 min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="text-secondary-text group cursor-pointer whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                <div className="flex items-center gap-1">
                  Date/Time
                  <FiArrowDown className="text-gray-400 text-[16px] transition-colors group-hover:text-primary" />
                </div>
              </th>
              <th
                scope="col"
                className="text-secondary-text whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                TXN ID
              </th>
              <th
                scope="col"
                className="text-secondary-text whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                Sender
              </th>
              <th
                scope="col"
                className="text-secondary-text whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                Recipient
              </th>
              <th
                scope="col"
                className="text-secondary-text whitespace-nowrap px-6 py-4 text-center text-xs font-bold uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="text-secondary-text whitespace-nowrap px-6 py-4 text-right text-xs font-bold uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="text-secondary-text whitespace-nowrap px-6 py-4 text-center text-xs font-bold uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="text-secondary-text whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                Admin Note
              </th>
            </tr>
          </thead>
          <tbody className="divide-gray-200 divide-y bg-white text-sm">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                <td className="text-header-text whitespace-nowrap px-6 py-4 font-medium">
                  <div className="flex flex-col">
                    <span>{txn.date}</span>
                    <span className="text-secondary-text text-xs font-normal">
                      {txn.time}
                    </span>
                  </div>
                </td>
                <td className="text-secondary-text font-mono whitespace-nowrap px-6 py-4 text-xs">
                  {txn.id}
                </td>
                <td className="text-header-text whitespace-nowrap px-6 py-4">
                  {txn.sender.name}
                  <span className="text-secondary-text font-mono block text-xs">
                    {txn.sender.account}
                  </span>
                </td>
                <td className="text-header-text whitespace-nowrap px-6 py-4">
                  {txn.recipient.name}
                  <span className="text-secondary-text font-mono block text-xs">
                    {txn.recipient.account}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {getTypeBadge(txn.type)}
                </td>
                <td className="text-header-text whitespace-nowrap px-6 py-4 text-right font-bold">
                  $
                  {txn.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {getStatusBadge(txn.status)}
                </td>
                <td className="text-secondary-text whitespace-nowrap px-6 py-4 text-xs italic">
                  {txn.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="border-gray-200 flex items-center justify-between border-t bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-secondary-text text-sm">
              Showing <span className="text-header-text font-medium">1</span> to{' '}
              <span className="text-header-text font-medium">
                {transactions.length}
              </span>{' '}
              of <span className="text-header-text font-medium">146,605</span>{' '}
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
                className="border-gray-300 text-secondary-text hover:bg-gray-50 relative inline-flex items-center rounded-l-md border bg-white px-2 py-2 text-sm font-medium"
              >
                <span className="sr-only">Previous</span>
                <span className="material-symbols-outlined text-[20px]">
                  &lsaquo;
                </span>
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
                className="border-gray-300 text-secondary-text hover:bg-gray-50 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium"
              >
                2
              </a>
              <a
                href="#"
                className="border-gray-300 text-secondary-text hover:bg-gray-50 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium"
              >
                3
              </a>
              <span className="border-gray-300 text-secondary-text relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium">
                ...
              </span>
              <a
                href="#"
                className="border-gray-300 text-secondary-text hover:bg-gray-50 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium"
              >
                24
              </a>
              <a
                href="#"
                className="border-gray-300 text-secondary-text hover:bg-gray-50 relative inline-flex items-center rounded-r-md border bg-white px-2 py-2 text-sm font-medium"
              >
                <span className="sr-only">Next</span>
                <span className="material-symbols-outlined text-[20px]">
                  &rsaquo;
                </span>
              </a>
            </nav>
          </div>
        </div>

        {/* Mobile Pagination */}
        <div className="flex w-full items-center justify-between gap-4 sm:hidden">
          <a
            href="#"
            className="border-gray-300 text-secondary-text hover:bg-gray-50 relative inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium"
          >
            Previous
          </a>
          <a
            href="#"
            className="border-gray-300 text-secondary-text hover:bg-gray-50 relative inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium"
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
