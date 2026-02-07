// TransferFilters.tsx
import React from 'react';
import {MdCalendarToday, MdExpandMore, MdSearch} from 'react-icons/md';

interface TransferFiltersProps {
  filters: {
    dateRange: string;
    country: string;
    status: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  countries?: string[];
}

const TransferFilters: React.FC<TransferFiltersProps> = ({
  filters,
  onFilterChange,
  countries = [
    'All Countries',
    'United States',
    'United Kingdom',
    'Germany',
    'Singapore',
    'Japan',
    'Australia',
    'Canada',
    'France',
  ],
}) => {
  const statuses = [
    'All Statuses',
    'Completed',
    'Pending',
    'Failed',
    'Under Review',
  ];

  return (
    <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
      <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
        {/* Date Picker */}
        <div className="relative min-w-[180px] flex-1 sm:flex-none">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdCalendarToday className="text-secondary-text text-lg" />
          </div>
          <input
            type="text"
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
            placeholder="All dates"
          />
        </div>

        {/* Country Select */}
        <div className="relative min-w-[160px] flex-1 sm:flex-none">
          <select
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
            className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <div className="text-secondary-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <MdExpandMore className="text-xl" />
          </div>
        </div>

        {/* Status Select */}
        <div className="relative min-w-[150px] flex-1 sm:flex-none">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="text-secondary-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <MdExpandMore className="text-xl" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full lg:w-72">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdSearch className="text-secondary-text text-lg" />
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
          placeholder="Search ID, Name, IBAN..."
        />
      </div>
    </div>
  );
};

export default TransferFilters;
