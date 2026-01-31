import React from 'react';
import {
  MdHistory,
  MdSearch,
  MdCalendarToday,
  MdFilterList,
} from 'react-icons/md';

const Header: React.FC = () => {
  return (
    <header className="bg-bg-main/95 border-gray-200 sticky top-0 z-10 w-full border-b px-8 py-6 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Top Row: Title & Action Button */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-navy text-3xl font-bold tracking-tight">
              Reports Center
            </h2>
            <p className="text-slate-custom text-base font-normal">
              Generate and manage financial statements and audit logs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="border-gray-300 text-slate-custom hover:text-navy hover:border-gray-400 flex h-10 items-center justify-center gap-2 rounded-lg border bg-white px-4 text-sm font-medium shadow-sm transition-colors">
              <MdHistory className="text-lg" />
              Recent Downloads
            </button>
          </div>
        </div>

        {/* Bottom Row: Controls */}
        <div className="border-gray-200 flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
          {/* Search Bar */}
          <div className="min-w-[240px] flex-1">
            <div className="group relative">
              <MdSearch className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-colors group-focus-within:text-primary" />
              <input
                className="bg-bg-main border-gray-200 text-navy placeholder-gray-400 h-10 w-full rounded-lg border pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Search by report name or ID..."
                type="text"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="bg-gray-200 hidden h-8 w-px sm:block"></div>

          {/* Date & Filters */}
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap">
            <label className="flex w-full min-w-[180px] cursor-pointer items-center gap-2 sm:w-auto">
              <span className="text-slate-custom whitespace-nowrap text-sm">
                Date Range:
              </span>
              <div className="relative w-full">
                <select className="bg-bg-main border-gray-200 text-navy h-10 w-full cursor-pointer appearance-none rounded-lg border pl-3 pr-10 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>This Year</option>
                  <option>Custom Range</option>
                </select>
                <MdCalendarToday className="text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base" />
              </div>
            </label>
            <button className="border-gray-200 text-slate-custom hover:text-navy hover:bg-gray-50 bg-bg-main flex h-10 w-10 items-center justify-center rounded-lg border transition-colors">
              <MdFilterList className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
