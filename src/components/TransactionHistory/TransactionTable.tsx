import React from 'react';
import {
  MdArrowDropDown,
  MdAccountBalance,
  MdCreditCard,
  MdSyncAlt,
  MdPayments,
  MdVisibility,
} from 'react-icons/md';

import {TRANSACTIONS} from './constants';
import {Transaction} from '@/types/transactionhistory';

const TransactionTable: React.FC = () => {
  const getStatusBadge = (status: Transaction['status']) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
        Pending
      </span>
    );
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'Deposit':
        return <MdAccountBalance className="text-base" />;
      case 'Payment':
        return <MdCreditCard className="text-base" />;
      case 'Transfer':
        return <MdSyncAlt className="text-base" />;
      case 'Withdrawal':
        return <MdPayments className="text-base" />;
      default:
        return null;
    }
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'text-emerald-600';
    if (amount < -1000) return 'text-header-text'; // High negative styling if desired, usually just red or dark
    if (amount === -250) return 'text-rose-500'; // Mimicking the specific visual
    return 'text-header-text';
  };

  const formatAmount = (amount: number) => {
    const sign = amount > 0 ? '+' : '-';
    const absVal = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${sign}$${absVal}`;
  };

  return (
    <div className="font-display flex flex-col overflow-hidden rounded-xl border border-stroke bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stroke bg-neutral-100">
              <th className="text-secondary-text whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-wider">
                <div className="group flex cursor-pointer items-center gap-1 hover:text-primary">
                  Date & Time
                  <MdArrowDropDown className="text-base group-hover:text-primary" />
                </div>
              </th>
              <th className="text-secondary-text whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="text-secondary-text whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Recipient / Beneficiary
              </th>
              <th className="text-secondary-text whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Type
              </th>
              <th className="text-secondary-text whitespace-nowrap px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">
                Amount
              </th>
              <th className="text-secondary-text whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="text-secondary-text whitespace-nowrap px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke">
            {TRANSACTIONS.map((trx) => (
              <tr
                key={trx.id}
                className="hover:bg-gray-50 group transition-colors"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-header-text text-sm font-medium">
                    {trx.date}
                  </div>
                  <div className="text-secondary-text text-xs">{trx.time}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-mono text-secondary-text bg-gray-100 rounded px-2 py-1 text-sm">
                    {trx.id}
                  </span>
                </td>
                <td className="text-secondary-text whitespace-nowrap px-6 py-4 text-sm">
                  {trx.recipient}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-secondary-text flex items-center gap-2 text-sm">
                    {getTypeIcon(trx.type)}
                    {trx.type}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span
                    className={`text-sm font-bold ${getAmountColor(trx.amount)}`}
                  >
                    {formatAmount(trx.amount)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {getStatusBadge(trx.status)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <button
                    className="text-gray-400 hover:bg-gray-100 rounded-full p-2 transition-colors hover:text-primary"
                    title="View Details"
                  >
                    <MdVisibility className="text-[20px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-gray-50 flex items-center justify-between border-t border-stroke px-6 py-4">
        <p className="text-secondary-text text-sm">
          Showing <span className="text-header-text font-bold">1</span> to{' '}
          <span className="text-header-text font-bold">4</span> of{' '}
          <span className="text-header-text font-bold">42</span> results
        </p>
        <div className="flex items-center gap-2">
          <button
            className="border-gray-300 text-secondary-text rounded border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <div className="hidden items-center gap-1 sm:flex">
            <button className="flex size-8 items-center justify-center rounded bg-primary text-sm font-medium text-white">
              1
            </button>
            <button className="hover:bg-gray-200 text-secondary-text flex size-8 items-center justify-center rounded text-sm font-medium transition-colors">
              2
            </button>
            <button className="hover:bg-gray-200 text-secondary-text flex size-8 items-center justify-center rounded text-sm font-medium transition-colors">
              3
            </button>
          </div>
          <button className="border-gray-300 text-secondary-text rounded border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
