import React, {useState} from 'react';
import {
  MdPerson,
  MdEdit,
  MdEmail,
  MdPhone,
  MdPlace,
  MdVerified,
  MdImage,
  MdDescription,
  MdContentCopy,
  MdMoreHoriz,
  MdSavings,
  MdArrowUpward,
  MdInfo,
  MdAccountBalance,
} from 'react-icons/md';
import {Card} from './Card';

const ClientProfile: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  return (
    <div className="dark:bg-background-dark text-text-light dark:text-text-dark flex overflow-hidden bg-white/50">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-8">
          {/* Breadcrumb */}

          {/* Main Header Card */}
          <div className="dark:bg-surface-dark dark:border-border-dark rounded-xl border border-stroke bg-white p-6 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-6 xl:flex-row xl:items-center">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="dark:from-gray-700 dark:to-gray-800 dark:border-gray-800 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-neutral-200 shadow-sm">
                    <MdPerson className="text-gray-400 dark:text-gray-500 text-5xl" />
                    {/* Placeholder for real image if available */}
                    {/* <img src="https://picsum.photos/100" alt="Robert Fox" className="w-full h-full object-cover" /> */}
                  </div>
                  <div
                    className={`dark:border-gray-800 absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                  ></div>
                </div>

                <div>
                  <h2 className="text-text-light dark:text-text-dark text-2xl font-bold">
                    Robert Fox
                  </h2>
                  <div className="text-subtext-light dark:text-subtext-dark mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span className="flex items-center gap-1">
                      Account ID:{' '}
                      <span className="font-mono text-text-light dark:text-text-dark font-medium">
                        #8932-1209
                      </span>
                    </span>
                    <span className="bg-gray-300 dark:bg-gray-600 hidden h-1 w-1 rounded-full sm:inline"></span>
                    <span>DOB: 12 Jan 1985</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Tier 2 Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex w-full flex-wrap items-center gap-3 xl:mt-0 xl:w-auto">
                <button className="text-text-light dark:text-text-dark dark:bg-gray-800 border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 flex-1 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 xl:flex-none">
                  See History
                </button>
                <button className="text-text-light dark:text-text-dark dark:bg-gray-800 border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 flex-1 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 xl:flex-none">
                  View Transactions
                </button>

                <div className="bg-border-light dark:bg-border-dark mx-1 hidden h-8 w-px xl:block"></div>

                <label className="relative ml-auto inline-flex cursor-pointer items-center xl:ml-0">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    className="peer sr-only"
                  />
                  <div className="bg-gray-200 dark:bg-gray-700 after:border-gray-300 peer h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30"></div>
                  <span className="text-text-light dark:text-text-dark ml-3 select-none text-sm font-medium">
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column (2/3) */}
            <div className="space-y-6 lg:col-span-2">
              {/* Personal Info */}
              <Card
                title="Personal & Contact Information"
                action={
                  <button className="hover:text-primary-hover flex items-center gap-1 text-sm font-medium text-primary transition-colors">
                    Edit Details
                  </button>
                }
              >
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Full Legal Name
                    </label>
                    <p className="text-text-light dark:text-text-dark text-base font-medium">
                      Robert Fox
                    </p>
                  </div>
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Registration Date
                    </label>
                    <p className="text-text-light dark:text-text-dark text-base font-medium">
                      24 Oct 2023
                    </p>
                  </div>
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="group flex cursor-pointer items-center gap-2">
                      <MdEmail className="text-subtext-light dark:text-subtext-dark text-lg transition-colors group-hover:text-primary" />
                      <p className="text-text-light dark:text-text-dark text-base font-medium transition-colors group-hover:text-primary">
                        robert.fox@example.com
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <div className="group flex cursor-pointer items-center gap-2">
                      <MdPhone className="text-subtext-light dark:text-subtext-dark text-lg transition-colors group-hover:text-primary" />
                      <p className="text-text-light dark:text-text-dark text-base font-medium transition-colors group-hover:text-primary">
                        +1 (555) 012-3456
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Residential Address
                    </label>
                    <div className="flex items-start gap-2">
                      <MdPlace className="text-subtext-light dark:text-subtext-dark mt-0.5 flex-shrink-0 text-lg" />
                      <p className="text-text-light dark:text-text-dark text-base font-medium">
                        4517 Washington Ave. Manchester, Kentucky 39495, United
                        States
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Docs & Bank - Split Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card
                  title="Identity Documents"
                  className="h-full"
                  action={
                    <MdVerified
                      className="text-xl text-green-500"
                      title="All documents verified"
                    />
                  }
                >
                  <div className="space-y-4">
                    <div className="hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-4 rounded-lg p-2 transition-colors">
                      <div className="bg-gray-100 dark:bg-gray-800 border-border-light dark:border-border-dark flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border">
                        <MdImage className="text-gray-400 text-2xl" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-text-light dark:text-text-dark truncate text-sm font-bold">
                          Passport
                        </p>
                        <p className="text-subtext-light dark:text-subtext-dark truncate text-xs">
                          A1234567 • Exp: 2028
                        </p>
                      </div>
                      <button className="px-2 text-sm font-medium text-primary hover:underline">
                        View
                      </button>
                    </div>

                    <div className="hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-4 rounded-lg p-2 transition-colors">
                      <div className="bg-gray-100 dark:bg-gray-800 border-border-light dark:border-border-dark flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border">
                        <MdDescription className="text-gray-400 text-2xl" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-text-light dark:text-text-dark truncate text-sm font-bold">
                          Utility Bill
                        </p>
                        <p className="text-subtext-light dark:text-subtext-dark truncate text-xs">
                          Uploaded 24 Oct 2023
                        </p>
                      </div>
                      <button className="px-2 text-sm font-medium text-primary hover:underline">
                        View
                      </button>
                    </div>
                  </div>
                </Card>

                <Card title="Bank Identification" className="h-full">
                  <div className="space-y-5">
                    <div className="border-gray-200 dark:border-gray-800 flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        Bank Name
                      </span>
                      <span className="text-text-light dark:text-text-dark text-right text-sm font-medium">
                        Chase Bank
                      </span>
                    </div>
                    <div className="border-gray-200 dark:border-gray-800 flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        Country
                      </span>
                      <span className="text-text-light dark:text-text-dark text-right text-sm font-medium">
                        United States
                      </span>
                    </div>
                    <div className="border-gray-200 dark:border-gray-800 flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        SWIFT / BIC
                      </span>
                      <span className="text-text-light dark:text-text-dark font-mono text-right text-sm font-medium">
                        CHASUS33
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        IBAN
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-text-light dark:text-text-dark font-mono text-sm font-medium">
                          US00 **** 0000
                        </span>
                        <MdContentCopy
                          className="text-gray-400 cursor-pointer text-sm transition-colors hover:text-primary"
                          title="Copy IBAN"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Column (1/3) */}
            <div className="space-y-6 lg:col-span-1">
              <Card
                title="Account Balances"
                action={
                  <button className="hover:bg-gray-100 dark:hover:bg-gray-800 text-subtext-light dark:text-subtext-dark rounded p-1 transition-colors">
                    <MdMoreHoriz className="text-xl" />
                  </button>
                }
                className="h-full"
              >
                <div className="space-y-6">
                  {/* Dark Card */}
                  <div className="to-gray-800 group relative overflow-hidden rounded-2xl bg-black via-[#1a2332] p-6 text-white shadow-xl">
                    <div className="absolute right-[-10px] top-[-10px] rotate-12 transform p-4 opacity-[0.08] transition-transform duration-500 group-hover:rotate-0">
                      <MdAccountBalance className="text-9xl" />
                    </div>

                    <div className="relative z-10">
                      <div className="mb-6 flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            E-Private Account
                          </p>
                          <p className="text-gray-500 font-mono mt-1 text-xs tracking-wide">
                            **** 4589
                          </p>
                        </div>
                        <span className="rounded border border-green-500/30 bg-green-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-300">
                          Active
                        </span>
                      </div>

                      <div className="mb-2">
                        <h4 className="text-3xl font-bold tracking-tight text-white">
                          $124,592.00
                        </h4>
                      </div>

                      <div className="mb-6 flex items-center gap-1 text-xs font-medium text-green-400">
                        <span className="rounded bg-green-400/10 p-0.5">
                          <MdArrowUpward className="text-sm" />
                        </span>
                        <span>2.4% this month</span>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 rounded-lg bg-white/10 py-2.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 active:bg-white/30">
                          Add Funds
                        </button>
                        <button className="hover:bg-primary-hover flex-1 rounded-lg bg-primary py-2.5 text-xs font-medium text-white shadow-lg shadow-orange-900/20 transition-all active:bg-orange-700">
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Account */}
                  <div className="dark:bg-gray-800/50 dark:border-border-dark rounded-2xl border border-stroke bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-text-light dark:text-text-dark text-sm font-semibold">
                          Temporary Account
                        </p>
                        <p className="text-subtext-light dark:text-subtext-dark font-mono mt-1 text-xs">
                          **** 9921
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full p-2">
                        <MdSavings className="text-xl" />
                      </div>
                    </div>

                    <div className="mb-1">
                      <h4 className="text-text-light dark:text-text-dark text-2xl font-bold tracking-tight">
                        $4,250.50
                      </h4>
                    </div>
                    <p className="text-subtext-light dark:text-subtext-dark text-xs">
                      Available for immediate transfer
                    </p>

                    <div className="border-border-light dark:border-border-dark mt-4 flex items-center justify-between border-t border-dashed pt-4">
                      <span className="text-subtext-light dark:text-subtext-dark text-xs font-medium">
                        Last activity: Today
                      </span>
                      <button className="text-xs font-semibold text-primary hover:underline">
                        View details
                      </button>
                    </div>
                  </div>

                  {/* Alert Box */}
                  <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/10">
                    <MdInfo className="mt-0.5 flex-shrink-0 text-xl text-amber-600 dark:text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                        Pending Review
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                        A large transaction of $15,000 is pending admin
                        approval.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientProfile;
