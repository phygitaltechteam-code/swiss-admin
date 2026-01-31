import React from 'react';
import {Search, Bell, Menu} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({onMenuClick}) => {
  return (
    <header className="border-gray-200 bg-card sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="hover:bg-gray-100 rounded-lg p-2 text-secondary lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-header font-display hidden text-xl font-bold md:block">
          Overview
        </h2>
      </div>

      <div className="flex w-full flex-1 items-center justify-end gap-4 md:w-auto md:flex-none">
        <div className="group relative hidden w-full max-w-xs sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-gray-400 h-5 w-5" />
          </div>
          <input
            type="text"
            className="text-header ring-gray-200 placeholder:text-gray-400 bg-gray-50 block w-full rounded-lg border-0 py-2 pl-10 pr-3 ring-1 ring-inset transition-shadow focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            placeholder="Search transactions, clients..."
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="hover:bg-gray-100 relative rounded-full p-2 text-secondary transition-colors hover:text-primary">
            <Bell className="h-6 w-6" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full border border-white bg-primary"></span>
          </button>

          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 md:hidden">
            <span className="text-xs font-bold text-primary">AM</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
