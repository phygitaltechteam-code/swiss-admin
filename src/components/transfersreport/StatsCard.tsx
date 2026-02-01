// StatsCard.tsx
import React from 'react';
import {MdPayments, MdArrowUpward, MdSend, MdTrendingUp} from 'react-icons/md';

const StatsCard = () => {
  const totalAmount = 8245300.5;
  const totalTransactions = 1248;
  const averageTransfer = 6607.45;
  const growth = 18.2;

  return (
    <div className="dark:border-gray-800 relative overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:bg-[#111a22]">
      {/* Decorative Background Icon */}
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 dark:opacity-10">
        <MdSend className="-mr-8 -mt-8 rotate-[-45deg] text-[140px]" />
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <MdPayments className="text-xl text-primary" />
              </div>
              <p className="text-secondary-text dark:text-gray-400 text-sm font-semibold">
                Total Sent
              </p>
            </div>
            <p className="text-header-text text-2xl font-bold dark:text-white lg:text-3xl">
              ${totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <MdSend className="text-xl text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-secondary-text dark:text-gray-400 text-sm font-semibold">
                Total Transactions
              </p>
            </div>
            <p className="text-header-text text-2xl font-bold dark:text-white lg:text-3xl">
              {totalTransactions.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <MdTrendingUp className="text-xl text-green-600 dark:text-green-400" />
              </div>
              <p className="text-secondary-text dark:text-gray-400 text-sm font-semibold">
                Average Transfer
              </p>
            </div>
            <p className="text-header-text text-2xl font-bold dark:text-white lg:text-3xl">
              $
              {averageTransfer.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <MdArrowUpward className="text-xl text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-secondary-text dark:text-gray-400 text-sm font-semibold">
                Growth
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-header-text text-2xl font-bold dark:text-white lg:text-3xl">
                {growth}%
              </p>
              <span className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-sm font-bold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <MdArrowUpward className="mr-1 text-[14px]" />
                vs last period
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
