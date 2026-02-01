import React from 'react';
import {MdCalendarToday, MdExpandMore, MdSearch} from 'react-icons/md';

const Filters: React.FC = () => {
  return (
    <div className="border-gray-200 flex flex-col items-start justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
        {/* Date Filter */}
        <div className="relative min-w-[220px] flex-1 lg:flex-none">
          <label className="text-body-text mb-1 ml-1 block text-xs font-medium">
            Registration Date
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdCalendarToday className="text-body-text text-[20px]" />
            </div>
            <input
              type="text"
              className="border-gray-200 text-header-text placeholder-gray-500 block w-full rounded-lg border bg-white py-2 pl-10 pr-3 leading-5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="All time"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative min-w-[180px] flex-1 lg:flex-none">
          <label className="text-body-text mb-1 ml-1 block text-xs font-medium">
            Account Status
          </label>
          <div className="relative">
            <select className="border-gray-200 text-header-text block w-full appearance-none rounded-lg border bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
            <div className="text-body-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <MdExpandMore className="text-[20px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mt-auto w-full lg:w-72">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdSearch className="text-body-text text-[20px]" />
        </div>
        <input
          type="text"
          className="border-gray-200 text-header-text placeholder-gray-500 block w-full rounded-lg border bg-white py-2 pl-10 pr-3 leading-5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          placeholder="Search clients by ID, name or email..."
        />
      </div>
    </div>
  );
};

export default Filters;
