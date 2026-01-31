import React from 'react';
import {FiCalendar, FiChevronDown, FiSearch} from 'react-icons/fi';

const FilterBar: React.FC = () => {
  return (
    <div className="border-gray-200 flex flex-col items-start justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
        {/* Date Picker Mock */}
        <div className="group relative min-w-[200px] flex-1 lg:flex-none">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiCalendar className="text-secondary-text text-[18px]" />
          </div>
          <input
            type="text"
            className="border-gray-300 text-header-text placeholder-gray-500 block w-full rounded-lg border bg-white py-2 pl-10 pr-3 leading-5 transition-shadow focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            placeholder="Oct 1 - Oct 31, 2023"
          />
        </div>

        {/* Status Select */}
        <div className="relative min-w-[140px] flex-1 lg:flex-none">
          <select className="border-gray-300 text-header-text hover:border-gray-400 block w-full cursor-pointer appearance-none rounded-lg border bg-white py-2 pl-3 pr-10 text-base transition-colors focus:border-primary focus:outline-none focus:ring-primary sm:text-sm">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Reverted</option>
          </select>
          <div className="text-secondary-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <FiChevronDown className="text-[18px]" />
          </div>
        </div>

        {/* Type Select */}
        <div className="relative min-w-[140px] flex-1 lg:flex-none">
          <select className="border-gray-300 text-header-text hover:border-gray-400 block w-full cursor-pointer appearance-none rounded-lg border bg-white py-2 pl-3 pr-10 text-base transition-colors focus:border-primary focus:outline-none focus:ring-primary sm:text-sm">
            <option>All Types</option>
            <option>Credit</option>
            <option>Debit</option>
          </select>
          <div className="text-secondary-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <FiChevronDown className="text-[18px]" />
          </div>
        </div>

        {/* Amount Select */}
        <div className="relative min-w-[140px] flex-1 lg:flex-none">
          <select className="border-gray-300 text-header-text hover:border-gray-400 block w-full cursor-pointer appearance-none rounded-lg border bg-white py-2 pl-3 pr-10 text-base transition-colors focus:border-primary focus:outline-none focus:ring-primary sm:text-sm">
            <option>Any Amount</option>
            <option>&lt; $100</option>
            <option>$100 - $1,000</option>
            <option>$1,000 - $10,000</option>
            <option>&gt; $10,000</option>
          </select>
          <div className="text-secondary-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <FiChevronDown className="text-[18px]" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full lg:w-64">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <FiSearch className="text-secondary-text text-[18px]" />
        </div>
        <input
          type="text"
          className="border-gray-300 text-header-text placeholder-gray-500 block w-full rounded-lg border bg-white py-2 pl-10 pr-3 leading-5 transition-shadow focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          placeholder="Search TXN ID, User..."
        />
      </div>
    </div>
  );
};

export default FilterBar;
