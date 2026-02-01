import {useNavigate} from '@tanstack/react-router';
import React from 'react';
import {MdArrowBack, MdFlag} from 'react-icons/md';
import {statusColors} from './methods';

type props = {
  status: string;
};
const Header: React.FC<props> = ({status}) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border border-b border-stroke bg-white/95 px-6 py-3 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({to: '/approval/customerregisterapprove'})}
          className="hover:bg-gray-100 border-gray-100 rounded-lg border border-stroke p-1.5 transition-colors"
        >
          <MdArrowBack className="text-gray-500 text-lg" />
        </button>
        <div>
          <h1 className="text-theme-header text-lg font-bold">
            Client Registration Review
          </h1>
          <div className="text-theme-body flex items-center gap-2 text-[11px]">
            <span
              className={`rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusColors[status]}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center gap-4">
        <span className="text-theme-body hidden text-xs sm:inline">
          Time elapsed:{' '}
          <span className="font-mono text-theme-header font-semibold">
            14m 20s
          </span>
        </span>
        <div className="bg-gray-200 mx-1 hidden h-6 w-px sm:block"></div>
        <button className="text-gray-600 hover:bg-gray-50 border-gray-200 flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-xs font-bold shadow-sm transition-colors">
          <MdFlag className="text-sm" />
          Report Issue
        </button>
      </div> */}
    </header>
  );
};

export default Header;
