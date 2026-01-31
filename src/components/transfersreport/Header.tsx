import React from 'react';
import {
  MdMenu,
  MdChevronRight,
  MdSearch,
  MdNotifications,
} from 'react-icons/md';

const Header = () => {
  return (
    <header className="dark:border-gray-800 sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f2f4] bg-white px-6 py-3 dark:bg-[#111a22]">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button className="text-secondary-text p-2 lg:hidden">
          <MdMenu className="text-2xl" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#"
            className="text-secondary-text dark:text-gray-400 text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </a>
          <MdChevronRight className="text-secondary-text dark:text-gray-400 text-sm" />
          <a
            href="#"
            className="text-secondary-text dark:text-gray-400 text-sm font-medium transition-colors hover:text-primary"
          >
            Reports
          </a>
          <MdChevronRight className="text-secondary-text dark:text-gray-400 text-sm" />
          <span className="text-header-text text-sm font-bold dark:text-white">
            Transfers Report
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 text-secondary-text flex items-center justify-center rounded-full p-2 transition-colors">
          <MdSearch className="text-2xl" />
        </button>
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 text-secondary-text relative flex items-center justify-center rounded-full p-2 transition-colors">
          <MdNotifications className="text-2xl" />
          <span className="absolute right-2 top-2 size-2 rounded-full border border-white bg-red-500 dark:border-[#111a22]"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
