import React from 'react';
import {MdNotifications, MdHelpOutline, MdMenu} from 'react-icons/md';

export const ProfileHeader: React.FC = () => {
  return (
    <header className="bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark sticky top-0 z-20 flex items-center justify-between border-b px-8 py-5">
      <div className="flex items-center gap-4">
        <button className="text-subtext-light dark:text-subtext-dark p-1 md:hidden">
          <MdMenu className="text-2xl" />
        </button>
        <h1 className="text-text-light dark:text-text-dark text-xl font-semibold">
          Client Profile
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-800 relative rounded-full p-2 transition-colors">
          <MdNotifications className="text-2xl" />
          <span className="dark:ring-surface-dark absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <button className="text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition-colors">
          <MdHelpOutline className="text-2xl" />
        </button>
      </div>
    </header>
  );
};
