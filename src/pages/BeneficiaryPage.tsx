import BeneficiaryTable from '@/components/beneficiaryreport/BeneficiaryTable';
import {STATS} from '@/components/beneficiaryreport/constants';
import FilterBar from '@/components/beneficiaryreport/FilterBar';
import Header from '@/components/beneficiaryreport/Header';
import StatsCard from '@/components/beneficiaryreport/StatsCard';
import React, {useState} from 'react';
import {FaFilePdf, FaFileCsv} from 'react-icons/fa6';
import {MdPrint, MdPendingActions, MdDomain} from 'react-icons/md';

const BeneficiaryPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Map icon types for stats dynamically if needed, or pass directly
  const getIconForStat = (title: string) => {
    switch (title) {
      case 'Pending Approval':
        return MdPendingActions;
      case 'Active Clients':
        return MdDomain;
      default:
        return undefined;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-[#F9FAFB]">
      <div className="flex min-h-screen flex-1 flex-col transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-8 p-6 md:p-10">
          {/* Page Title & Actions */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-black">
                All Beneficiary List Report
              </h2>
              <p className="text-text-secondary max-w-2xl text-base">
                A master list of all beneficiaries across all clients, including
                linking details and status.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="border-border-light text-text-main hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-bold shadow-sm transition-colors">
                <FaFilePdf className="text-text-secondary text-lg" />
                <span>Export PDF</span>
              </button>
              <button className="border-border-light text-text-main hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-bold shadow-sm transition-colors">
                <FaFileCsv className="text-text-secondary text-lg" />
                <span>Export CSV</span>
              </button>
              <button className="hover:bg-primary-hover flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-colors">
                <MdPrint className="text-lg" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat) => (
              <StatsCard
                key={stat.title}
                {...stat}
                icon={stat.icon || getIconForStat(stat.title)}
              />
            ))}
          </div>

          {/* Filters & Table */}
          <div className="flex flex-col gap-4">
            <FilterBar />
            <BeneficiaryTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BeneficiaryPage;
