import React from 'react';
import {
  MdMenu,
  MdChevronRight,
  MdSearch,
  MdNotifications,
} from 'react-icons/md';

const Header: React.FC = () => {
  return (
    <header className="border-gray-200 sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button className="text-body-text hover:bg-gray-100 rounded-lg p-2 lg:hidden">
          <MdMenu className="text-[24px]" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#"
            className="text-body-text text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </a>
          <MdChevronRight className="text-body-text text-sm" />
          <a
            href="#"
            className="text-body-text text-sm font-medium transition-colors hover:text-primary"
          >
            Reports
          </a>
          <MdChevronRight className="text-body-text text-sm" />
          <span className="text-header-text text-sm font-bold">
            Client List
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button className="hover:bg-gray-50 text-body-text flex items-center justify-center rounded-full p-2 transition-colors">
          <MdSearch className="text-[24px]" />
        </button>
        <button className="hover:bg-gray-50 text-body-text relative flex items-center justify-center rounded-full p-2 transition-colors">
          <MdNotifications className="text-[24px]" />
          <span className="absolute right-2 top-2 size-2 rounded-full border border-white bg-primary"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
