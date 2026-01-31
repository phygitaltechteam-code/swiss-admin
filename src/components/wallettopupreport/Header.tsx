import React from 'react';
import {
  MdMenu,
  MdChevronRight,
  MdSearch,
  MdNotifications,
} from 'react-icons/md';

const Header: React.FC = () => {
  return (
    <header className="border-gray-200 dark:border-gray-800 sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid bg-white px-6 py-3 dark:bg-[#111a22]">
      <div className="flex items-center gap-4">
        <button className="text-text-muted p-2 lg:hidden">
          <MdMenu size={24} />
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <a
            className="text-text-muted dark:text-gray-400 text-sm font-medium transition-colors hover:text-primary"
            href="#"
          >
            Home
          </a>
          <MdChevronRight className="text-text-muted dark:text-gray-400 text-sm" />
          <a
            className="text-text-muted dark:text-gray-400 text-sm font-medium transition-colors hover:text-primary"
            href="#"
          >
            Reports
          </a>
          <MdChevronRight className="text-text-muted dark:text-gray-400 text-sm" />
          <span className="text-text-main text-sm font-bold dark:text-white">
            Wallet Top-Up
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted flex items-center justify-center rounded-full p-2">
          <MdSearch size={24} />
        </button>
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted relative flex items-center justify-center rounded-full p-2">
          <MdNotifications size={24} />
          <span className="absolute right-2 top-2 size-2 rounded-full border border-white bg-red-500 dark:border-[#111a22]"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
