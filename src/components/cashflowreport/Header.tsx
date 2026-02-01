import React from 'react';
import {
  MdMenu,
  MdChevronRight,
  MdSearch,
  MdNotifications,
} from 'react-icons/md';

const Header: React.FC = () => {
  return (
    <header className="dark:border-gray-800 dark:bg-dark-surface sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f2f4] bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        <button className="p-2 text-[#6B7280] lg:hidden">
          <MdMenu size={24} />
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <a
            className="dark:text-gray-400 text-sm font-medium text-[#6B7280] transition-colors hover:text-primary"
            href="#"
          >
            Home
          </a>
          <MdChevronRight
            className="dark:text-gray-400 text-[#6B7280]"
            size={16}
          />
          <a
            className="dark:text-gray-400 text-sm font-medium text-[#6B7280] transition-colors hover:text-primary"
            href="#"
          >
            Reports
          </a>
          <MdChevronRight
            className="dark:text-gray-400 text-[#6B7280]"
            size={16}
          />
          <span className="text-sm font-bold text-black dark:text-white">
            Cash Flow Statement
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center rounded-full p-2 text-[#6B7280] transition-colors">
          <MdSearch size={24} />
        </button>
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 relative flex items-center justify-center rounded-full p-2 text-[#6B7280] transition-colors">
          <MdNotifications size={24} />
          <span className="dark:border-dark-surface absolute right-2 top-2 size-2 rounded-full border border-white bg-red-500"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
