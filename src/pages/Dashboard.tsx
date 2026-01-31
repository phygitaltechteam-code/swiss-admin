import RightPanel from '@/components/Dashboard/DashboardRightPanel';
import StatsCard from '@/components/Dashboard/StatsCards';
import Header from '@/components/Header';
import React, {useState} from 'react';

import {
  Users,
  Receipt,
  DollarSign,
  BarChart3,
  PiggyBank,
  Users2,
  CreditCard,
  Send,
  MoreVertical,
  CalendarDays,
} from 'lucide-react';
import {
  TopUpsVsTransfersChart,
  VolumeVsFeesChart,
} from '@/components/Dashboard/Charts';
import {useAuthContext} from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const {user} = useAuthContext();
  console.log('userrrrr', user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // For mobile responsiveness if needed

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="font-body flex w-full overflow-hidden bg-white/50 text-neutral-500">
      <main className="relative flex h-full flex-1 flex-col transition-all duration-300">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6 lg:p-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-header font-display text-2xl font-bold text-black">
                    System Performance
                  </h3>
                  <p className="text-sm text-black">
                    Real-time update:{' '}
                    <span className="font-medium text-primary">Just now</span>
                  </p>
                </div>
                <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-stroke bg-white p-1 shadow-sm">
                  <button className="whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600">
                    30 Days
                  </button>
                  <button className="hover:text-header hover:bg-gray-50 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 transition-colors">
                    7 Days
                  </button>
                  <button className="hover:text-header hover:bg-gray-50 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 transition-colors">
                    24 Hours
                  </button>
                  <div className="bg-gray-200 mx-1 h-5 w-px shrink-0"></div>
                  <button className="hover:text-header hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 transition-colors">
                    <CalendarDays className="h-4 w-4" />
                    Custom
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatsCard
                  title="Total Clients"
                  value="12,450"
                  change="12%"
                  isPositive={true}
                  icon={Users}
                />
                <StatsCard
                  title="Transactions"
                  value="8,932"
                  change="5%"
                  isPositive={true}
                  icon={Receipt}
                />
                <StatsCard
                  title="Fees Collected"
                  value="$1.2M"
                  change="8%"
                  isPositive={true}
                  icon={DollarSign}
                />
                <StatsCard
                  title="Tx Amount"
                  value="$45.5M"
                  change="15%"
                  isPositive={true}
                  icon={BarChart3}
                />
                <StatsCard
                  title="Total Reserves"
                  value="$2.1M"
                  change="2%"
                  isPositive={true}
                  icon={PiggyBank}
                />
                <StatsCard
                  title="Beneficiaries"
                  value="3,200"
                  change="10%"
                  isPositive={true}
                  icon={Users2}
                />
                <StatsCard
                  title="Total Top-ups"
                  value="$500k"
                  change="3%"
                  isPositive={false}
                  icon={CreditCard}
                />
                <StatsCard
                  title="Total Transfers"
                  value="$8.2M"
                  change="20%"
                  isPositive={true}
                  icon={Send}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Large Chart */}
                <div className="flex h-[400px] flex-col rounded-xl bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] xl:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-header font-display text-lg font-bold text-black">
                        Transaction Volume vs Fees
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Comparing volume flow against revenue collected.
                      </p>
                    </div>
                    <button className="hover:bg-gray-100 rounded-lg p-2 text-neutral-500 transition-colors hover:text-primary">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="min-h-0 w-full flex-1">
                    <VolumeVsFeesChart />
                  </div>

                  <div className="mt-2 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-primary"></span>
                      <span className="text-xs font-medium text-neutral-500">
                        Volume
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-navy h-3 w-3 rounded-full"></span>
                      <span className="text-xs font-medium text-neutral-500">
                        Fees
                      </span>
                    </div>
                  </div>
                </div>

                {/* Small Chart */}
                <div className="flex h-[400px] flex-col rounded-xl bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] xl:col-span-1">
                  <div className="mb-2">
                    <h3 className="text-header font-display text-lg font-bold text-black">
                      Top-ups vs Transfers
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Weekly breakdown.
                    </p>
                  </div>

                  <div className="min-h-0 w-full flex-1">
                    <TopUpsVsTransfersChart />
                  </div>

                  <div className="mt-2 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-navy h-3 w-3 rounded-full"></span>
                      <span className="text-xs font-medium text-neutral-500">
                        Top-ups
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-primary"></span>
                      <span className="text-xs font-medium text-neutral-500">
                        Transfers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className="mb-6 mt-12 text-center">
              <p className="text-xs text-secondary/60">
                © 2023 Nexus Bank Admin Portal. All rights reserved. Version
                2.4.0
              </p>
            </footer>
          </div>
        </div>
      </main>

      {/* Mobile Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
