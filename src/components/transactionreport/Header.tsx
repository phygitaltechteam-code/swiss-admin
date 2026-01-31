import React from 'react';
import {
  MdChevronRight,
  MdSearch,
  MdNotifications,
  MdMenu,
} from 'react-icons/md';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({onMenuClick}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-text-secondary hover:bg-gray-50 rounded-md p-2 lg:hidden"
        >
          <MdMenu className="text-2xl" />
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#"
            className="text-text-secondary text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </a>
          <MdChevronRight className="text-text-secondary text-sm" />
          <a
            href="#"
            className="text-text-secondary text-sm font-medium transition-colors hover:text-primary"
          >
            Reports
          </a>
          <MdChevronRight className="text-text-secondary text-sm" />
          <span className="text-text-primary text-sm font-bold">
            Transactions Fee Report
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hover:bg-gray-50 text-text-secondary flex items-center justify-center rounded-full p-2 transition-colors">
          <MdSearch className="text-2xl" />
        </button>
        <button className="hover:bg-gray-50 text-text-secondary relative flex items-center justify-center rounded-full p-2 transition-colors">
          <MdNotifications className="text-2xl" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-white bg-red-500"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
