import React from 'react';
import {MdCalendarToday, MdExpandMore, MdSearch} from 'react-icons/md';

const FilterBar: React.FC = () => {
  return (
    <div className="border-border-light flex flex-col items-start justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm xl:flex-row xl:items-center">
      <div className="flex w-full flex-wrap items-center gap-3 xl:w-auto">
        {/* Date Picker */}
        <div className="relative w-full min-w-[200px] flex-1 sm:w-auto xl:flex-none">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdCalendarToday className="text-text-secondary text-lg" />
          </div>
          <input
            type="text"
            placeholder="Linking Date: All Time"
            className="border-border-light text-text-main placeholder-text-secondary block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm transition-shadow focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Countries Dropdown */}
        <div className="relative w-full min-w-[160px] flex-1 sm:w-auto xl:flex-none">
          <select className="border-border-light text-text-main block w-full cursor-pointer appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option>All Countries</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>France</option>
          </select>
          <div className="text-text-secondary pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <MdExpandMore size={20} />
          </div>
        </div>

        {/* Banks Dropdown */}
        <div className="relative w-full min-w-[160px] flex-1 sm:w-auto xl:flex-none">
          <select className="border-border-light text-text-main block w-full cursor-pointer appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option>All Banks</option>
            <option>JPMorgan Chase</option>
            <option>HSBC</option>
            <option>Deutsche Bank</option>
            <option>BNP Paribas</option>
          </select>
          <div className="text-text-secondary pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <MdExpandMore size={20} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full xl:w-80">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdSearch className="text-text-secondary text-xl" />
        </div>
        <input
          type="text"
          placeholder="Search beneficiary, client or account..."
          className="border-border-light text-text-main placeholder-text-secondary block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm transition-shadow focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
};

export default FilterBar;
