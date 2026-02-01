import React from 'react';
import {
  MdSearch,
  MdCalendarToday,
  MdFilterList,
  MdDownload,
  MdRefresh,
  MdAdd,
} from 'react-icons/md';

const Header: React.FC = () => {
  return (
    <header className="border-gray-200 sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1800px]">
          {/* Top Section */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-gray-900 text-2xl font-bold sm:text-3xl">
                Reports Center
              </h1>
              <p className="text-gray-600 mt-2 text-sm">
                Generate, manage, and analyze your financial reports and audit
                logs
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500 inline-flex items-center rounded-lg border bg-white px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2">
                <MdRefresh className="mr-2 h-5 w-5" />
                Refresh
              </button>
              <button className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <MdAdd className="mr-2 h-5 w-5" />
                New Report
              </button>
            </div>
          </div>

          {/* Controls Section */}
          <div className="border-gray-200 bg-gray-50 rounded-xl border p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative max-w-md">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdSearch className="text-gray-400 h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    className="border-gray-300 placeholder-gray-500 block w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Search reports by name, ID, or type..."
                  />
                </div>
              </div>

              {/* Filters Section */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Date Range */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdCalendarToday className="text-gray-400 h-5 w-5" />
                  </div>
                  <select className="border-gray-300 block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last quarter</option>
                    <option>Last year</option>
                    <option>Custom range</option>
                  </select>
                </div>

                {/* Type Filter */}
                <select className="border-gray-300 block rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>All Types</option>
                  <option>Financial</option>
                  <option>Audit</option>
                  <option>Performance</option>
                  <option>Compliance</option>
                </select>

                {/* Filter Button */}
                <button className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500 inline-flex items-center rounded-lg border bg-white px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2">
                  <MdFilterList className="mr-2 h-5 w-5" />
                  More Filters
                </button>

                {/* Download All Button */}
                <button className="bg-gray-800 hover:bg-gray-900 focus:ring-gray-500 inline-flex items-center rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2">
                  <MdDownload className="mr-2 h-5 w-5" />
                  Export All
                </button>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-gray-700 text-sm font-medium">
                Active filters:
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                Last 30 days
                <button className="ml-2 text-blue-600 hover:text-blue-800">
                  ×
                </button>
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                Financial reports
                <button className="ml-2 text-blue-600 hover:text-blue-800">
                  ×
                </button>
              </span>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
