import ClientTable from '@/components/clientlistreport/ClientTable';
import {CLIENT_DATA, STATS_DATA} from '@/components/clientlistreport/constants';
import Filters from '@/components/clientlistreport/Filters';
import Header from '@/components/clientlistreport/Header';
import StatCard from '@/components/clientlistreport/StatCard';
import React from 'react';

import {MdDownload, MdAdd} from 'react-icons/md';

const ClientListReport: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-row">
      <main className="flex min-h-screen flex-1 flex-col">
        <Header />

        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 p-6 md:p-10">
          {/* Page Title & Actions */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-black dark:text-white">
                Client List Report
              </h2>
              <p className="text-body-text text-base">
                Comprehensive directory of all registered clients, assets, and
                account statuses.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="border-gray-200 text-header-text hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-bold transition-colors">
                <MdDownload className="text-[20px]" />
                <span>Export CSV</span>
              </button>
              <button className="hover:bg-primary-hover flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-colors">
                <MdAdd className="text-[20px]" />
                <span>Add Client</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS_DATA.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>

          {/* Table Section */}
          <div className="flex flex-col gap-4">
            <Filters />
            <ClientTable data={CLIENT_DATA} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientListReport;
