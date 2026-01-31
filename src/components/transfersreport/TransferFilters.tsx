import React from 'react';
import {MdCalendarToday, MdExpandMore, MdSearch} from 'react-icons/md';

const TransferFilters = () => {
  return (
    <div className="bg-card-bg dark:border-gray-800 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#e5e7eb] p-4 shadow-sm dark:bg-[#111a22] xl:flex-row xl:items-center">
      <div className="flex w-full flex-wrap items-center gap-3 xl:w-auto">
        {/* Date Picker */}
        <div className="relative min-w-[200px] flex-1 lg:flex-none">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdCalendarToday className="text-secondary-text text-[20px]" />
          </div>
          <input
            type="text"
            className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2 pl-10 pr-3 leading-5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white sm:text-sm"
            placeholder="Oct 1 - Oct 31, 2023"
          />
        </div>

        {/* Country Select */}
        <div className="relative min-w-[180px] flex-1 lg:flex-none">
          <select className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm">
            <option>All Countries</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>Singapore</option>
          </select>
          <div className="text-secondary-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <MdExpandMore className="text-[20px]" />
          </div>
        </div>

        {/* Status Select */}
        <div className="relative min-w-[160px] flex-1 lg:flex-none">
          <select className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm">
            <option>All Statuses</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Under Review</option>
          </select>
          <div className="text-secondary-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <MdExpandMore className="text-[20px]" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full xl:w-72">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdSearch className="text-secondary-text text-[20px]" />
        </div>
        <input
          type="text"
          className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2 pl-10 pr-3 leading-5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white sm:text-sm"
          placeholder="Search ID, Name, IBAN..."
        />
      </div>
    </div>
  );
};

export default TransferFilters;
