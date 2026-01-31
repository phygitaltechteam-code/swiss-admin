import React from 'react';
import {
  MdBadge,
  MdPhoneIphone,
  MdAccountBalanceWallet,
  MdPendingActions,
} from 'react-icons/md';
import {AVATAR_URL} from './constants';

const Header: React.FC = () => {
  return (
    <div className="font-display px-6 py-6 lg:px-10 lg:pb-0">
      <div className="mb-8 rounded-xl border border-stroke bg-white p-6 shadow-sm">
        <div className="flex flex-col items-start gap-8 xl:flex-row">
          <div className="flex shrink-0 items-center gap-5">
            <div
              className="size-20 rounded-full border-4 border-stroke bg-slate-200 bg-cover bg-center shadow-sm"
              style={{backgroundImage: `url('${AVATAR_URL}')`}}
            ></div>
            <div>
              <h1 className="text-header-text text-2xl font-bold">
                Robert Fox
              </h1>
              <div className="mt-1 flex flex-col gap-0.5">
                <p className="text-secondary-text flex items-center gap-1.5 text-sm font-medium">
                  <MdBadge className="text-[18px]" />
                  Account:{' '}
                  <span className="font-mono text-header-text">
                    1099-8832-4452
                  </span>
                </p>
                <p className="text-secondary-text flex items-center gap-1.5 text-sm font-medium">
                  <MdPhoneIphone className="text-[18px]" />
                  Mobile:{' '}
                  <span className="text-header-text">+1 (555) 012-3456</span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 h-px w-full xl:hidden"></div>
          <div className="grid w-full flex-1 grid-cols-1 gap-4 md:grid-cols-2">
            <div className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-orange-100 bg-primary/10 p-4 transition-all hover:shadow-md">
              <div className="relative z-10">
                <p className="text-secondary-text mb-1 text-xs font-bold uppercase tracking-wider">
                  Private Account
                </p>
                <p className="text-header-text font-mono text-2xl font-bold">
                  $124,592.00
                </p>
              </div>
              <div className="relative z-10 flex size-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <MdAccountBalanceWallet className="text-2xl" />
              </div>
            </div>
            <div className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-orange-100 bg-primary/10 p-4 transition-all hover:shadow-md">
              <div className="relative z-10">
                <p className="text-secondary-text mb-1 text-xs font-bold uppercase tracking-wider">
                  Temporary Account
                </p>
                <p className="text-header-text font-mono text-2xl font-bold">
                  $5,240.50
                </p>
              </div>
              <div className="relative z-10 flex size-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <MdPendingActions className="text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
