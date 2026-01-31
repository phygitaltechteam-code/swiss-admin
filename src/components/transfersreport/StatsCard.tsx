import React from 'react';
import {MdPayments, MdArrowUpward, MdSend} from 'react-icons/md';

const StatsCard = () => {
  return (
    <div className="bg-card-bg dark:border-gray-800 relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl border border-[#e5e7eb] p-6 shadow-sm dark:bg-[#111a22] md:flex-row md:items-center md:p-8">
      {/* Decorative Background Icon */}
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 dark:opacity-10">
        <MdSend className="-mr-8 -mt-8 rotate-[-45deg] text-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        <div className="text-secondary-text dark:text-gray-400 flex items-center gap-2">
          <MdPayments className="text-[24px]" />
          <p className="text-sm font-bold uppercase tracking-wide">
            Total Sent
          </p>
        </div>
        <p className="text-header-text mt-1 text-4xl font-extrabold dark:text-white md:text-5xl">
          $8,245,300.50
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="bg-gray-50 dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 flex items-center gap-3 rounded-lg border px-4 py-2.5">
          <span className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-sm font-bold text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <MdArrowUpward className="mr-1 text-[16px]" />
            18.2%
          </span>
          <span className="text-secondary-text dark:text-gray-500 text-sm font-medium">
            Increase vs previous period
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
