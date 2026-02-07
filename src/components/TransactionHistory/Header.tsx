import React from 'react';
import {
  MdBadge,
  MdPhoneIphone,
  MdAccountBalanceWallet,
  MdPendingActions,
} from 'react-icons/md';

interface HeaderProps {
  fullname?: string;
  phoneNumber?: string;
  accountNumber?: string;
  eprivateAccount?: number;
  temporyAccount?: number;
  avatarUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  fullname,
  phoneNumber,
  accountNumber,
  eprivateAccount = 0,
  temporyAccount = 0,
  avatarUrl,
}) => {
  return (
    <div className="font-display px-6 py-6 lg:px-10 lg:pb-0">
      <div className="mb-8 rounded-xl border border-stroke bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-8 xl:flex-row">
          {/* User Info */}
          <div className="flex shrink-0 items-center gap-5">
            <div
              className="size-20 rounded-full border-4 border-stroke bg-slate-200 bg-cover bg-center shadow-sm"
              style={{
                backgroundImage: avatarUrl ? `url('${avatarUrl}')` : undefined,
              }}
            />

            <div>
              <h1 className="text-header-text text-2xl font-bold">
                {fullname ?? '—'}
              </h1>

              <div className="mt-1 flex flex-col gap-0.5">
                <p className="text-secondary-text flex items-center gap-1.5 text-sm font-medium">
                  <MdBadge className="text-[18px]" />
                  Account:
                  <span className="font-mono text-header-text">
                    {accountNumber ?? '—'}
                  </span>
                </p>

                <p className="text-secondary-text flex items-center gap-1.5 text-sm font-medium">
                  <MdPhoneIphone className="text-[18px]" />
                  Mobile:
                  <span className="text-header-text">{phoneNumber ?? '—'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 h-px w-full xl:hidden" />

          {/* Wallet Cards */}
          <div className="grid w-full flex-1 grid-cols-1 gap-4 md:grid-cols-2">
            {/* Private Account */}
            <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-primary/10 p-4 transition hover:shadow-md">
              <div>
                <p className="text-secondary-text mb-1 text-xs font-bold uppercase">
                  Private Account
                </p>
                <p className="text-header-text font-mono text-2xl font-bold">
                  ${eprivateAccount.toLocaleString()}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <MdAccountBalanceWallet className="text-2xl" />
              </div>
            </div>

            {/* Temporary Account */}
            <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-primary/10 p-4 transition hover:shadow-md">
              <div>
                <p className="text-secondary-text mb-1 text-xs font-bold uppercase">
                  Temporary Account
                </p>
                <p className="text-header-text font-mono text-2xl font-bold">
                  ${temporyAccount.toLocaleString()}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
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
