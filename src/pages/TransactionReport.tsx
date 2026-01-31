import React, {useState} from 'react';
//import Sidebar from './components/Sidebar';
// import Header from './components/Header';
// import StatsCard from './components/StatsCard';
// import ChartSection from './components/ChartSection';
// import TransactionTable from './components/TransactionTable';
import {MdPictureAsPdf, MdPrint} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';
import Header from '@/components/transactionreport/Header';
import StatsCard from '@/components/transactionreport/StatsCard';
import ChartSection from '@/components/transactionreport/ChartSection';
import TransactionTable from '@/components/transactionreport/TransactionTable';

const TransactionReport: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background-light relative flex min-h-screen w-full flex-row">
      {/* Sidebar Overlay for Mobile
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} /> */}

      <main className="flex min-h-screen flex-1 flex-col transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 p-6 md:p-10">
          {/* Page Title & Actions */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-black">
                Transactions Fee Report
              </h2>
              <p className="text-text-secondary text-base">
                Detailed breakdown of fees collected per transaction type for
                October 2023.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="text-text-primary hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 text-sm font-bold shadow-sm transition-colors">
                <MdPictureAsPdf className="text-xl" />
                <span>Export PDF</span>
              </button>
              <button className="text-text-primary hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 text-sm font-bold shadow-sm transition-colors">
                <FaFileCsv className="text-lg" />
                <span>Export CSV</span>
              </button>
              <button className="hover:bg-primary-hover flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white shadow-sm transition-colors">
                <MdPrint className="text-xl" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatsCard
              title="Total Fees Collected"
              value="$45,280.50"
              trend={8.2}
              trendLabel="vs last month"
              iconType="money"
            />
            <StatsCard
              title="Average Fee per Transaction"
              value="$1.45"
              trend={-0.0}
              trendLabel="stable"
              iconType="analytics"
            />
          </div>

          {/* Chart Section */}
          <ChartSection />

          {/* Transaction Table */}
          <TransactionTable />
        </div>
      </main>
    </div>
  );
};

export default TransactionReport;
