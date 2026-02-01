import React from 'react';
import {
  MdMenu,
  MdChevronRight,
  MdSearch,
  MdNotifications,
} from 'react-icons/md';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({onMenuClick}) => {
  return (
    <header className="border-border-light sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-text-secondary hover:bg-gray-100 -ml-2 rounded-lg p-2 transition-colors lg:hidden"
        >
          <MdMenu size={24} />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <a
            href="#"
            className="text-text-secondary text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </a>
          <MdChevronRight className="text-text-secondary flex-shrink-0 text-lg" />
          <a
            href="#"
            className="text-text-secondary text-sm font-medium transition-colors hover:text-primary"
          >
            Reports
          </a>
          <MdChevronRight className="text-text-secondary flex-shrink-0 text-lg" />
          <span className="text-text-main truncate text-sm font-bold">
            All Beneficiary List
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="text-text-secondary hover:bg-gray-100 flex items-center justify-center rounded-full p-2 transition-colors">
          <MdSearch size={22} />
        </button>
        <button className="text-text-secondary hover:bg-gray-100 relative flex items-center justify-center rounded-full p-2 transition-colors">
          <MdNotifications size={22} />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
