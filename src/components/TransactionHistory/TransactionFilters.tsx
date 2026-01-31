import React from 'react';
import {MdCalendarMonth, MdExpandMore} from 'react-icons/md';

const TransactionFilters: React.FC = () => {
  return (
    <div className="font-display mb-6 rounded-xl border border-stroke bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Date Range */}
        <div className="lg:col-span-1">
          <label className="text-header-text mb-1.5 block text-sm font-medium">
            Date Range
          </label>
          <div className="relative">
            <input
              className="bg-gray-50 text-header-text placeholder-gray-400 h-11 w-full rounded-lg border border-stroke pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
              placeholder="All time"
              type="text"
            />
            <MdCalendarMonth className="text-gray-400 absolute left-3 top-3 text-xl" />
          </div>
        </div>

        {/* Type Select */}
        <div className="lg:col-span-1">
          <label className="text-header-text mb-1.5 block text-sm font-medium">
            Type
          </label>
          <div className="relative">
            <select className="bg-gray-50 text-header-text h-11 w-full cursor-pointer appearance-none rounded-lg border border-stroke pl-4 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50">
              <option value="">All Types</option>
              <option value="transfer">Transfer</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="payment">Payment</option>
            </select>
            <MdExpandMore className="text-gray-400 pointer-events-none absolute right-3 top-3 text-xl" />
          </div>
        </div>

        {/* Amount Range Slider (Visual Mock) */}
        <div className="lg:col-span-1">
          <label className="text-header-text mb-1.5 block text-sm font-medium">
            Amount Range
          </label>
          <div className="flex h-11 items-center px-1">
            <div className="bg-gray-200 relative h-1 w-full rounded-full">
              {/* Active Track */}
              <div className="absolute left-[0%] right-[0%] top-0 h-full rounded-full bg-primary"></div>

              {/* Left Thumb */}
              <div className="absolute left-[0%] top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-primary bg-white shadow transition-transform hover:scale-110"></div>

              {/* Right Thumb */}
              <div className="absolute right-[0%] top-1/2 size-4 -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full border-2 border-primary bg-white shadow transition-transform hover:scale-110"></div>

              {/* Labels */}
              <div className="text-gray-400 absolute -bottom-6 left-0 text-xs">
                $0
              </div>
              <div className="text-gray-400 absolute -bottom-6 right-0 text-xs">
                Max
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 lg:col-span-1">
          <button className="hover:bg-primary-hover h-11 flex-1 rounded-lg bg-primary font-medium text-white shadow-md shadow-primary/20 transition-colors">
            Filter
          </button>
          <button className="text-secondary-text hover:bg-gray-100 h-11 rounded-lg border border-transparent px-4 font-medium transition-colors">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
