import React from 'react';
import {FiMenu, FiSearch, FiChevronRight} from 'react-icons/fi';
import {IoNotificationsOutline} from 'react-icons/io5';

const Header: React.FC = () => {
  return (
    <header className="border-gray-200 sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button className="text-secondary-text hover:bg-gray-100 rounded-lg p-2 lg:hidden">
          <FiMenu className="text-xl" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#"
            className="text-secondary-text text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </a>
          <FiChevronRight className="text-secondary-text text-sm" />
          <a
            href="#"
            className="text-secondary-text text-sm font-medium transition-colors hover:text-primary"
          >
            Reports
          </a>
          <FiChevronRight className="text-secondary-text text-sm" />
          <span className="text-header-text text-sm font-bold">
            All Transactions
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hover:bg-gray-100 text-secondary-text flex items-center justify-center rounded-full p-2 transition-colors">
          <FiSearch className="text-xl" />
        </button>
        <button className="hover:bg-gray-100 text-secondary-text relative flex items-center justify-center rounded-full p-2 transition-colors">
          <IoNotificationsOutline className="text-xl" />
          <span className="absolute right-2 top-2 size-2 rounded-full border border-white bg-primary"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
