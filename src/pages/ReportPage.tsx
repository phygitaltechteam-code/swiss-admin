import React from 'react';

import Header from '@/components/reports/Header';
import ReportCard from '@/components/reports/ReportCard';
import {reports} from '@/components/reports/constants';

// import ReportCard from './components/ReportCard';
// import { reports } from './constants';

const ReportPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full">
      <main className="bg-bg-main relative flex h-full flex-1 flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mx-auto max-w-[1600px] pb-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {reports && reports.length > 0 ? (
                reports.map((report) => (
                  <ReportCard key={report.id} item={report} />
                ))
              ) : (
                <div className="text-slate-custom col-span-full flex flex-col items-center justify-center py-20">
                  <div className="mb-4 text-6xl font-bold text-slate-200">
                    404
                  </div>
                  <p className="text-lg font-medium">No reports found.</p>
                </div>
              )}
            </div>

            <div className="text-slate-custom mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 sm:flex-row">
              <p className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                System Status: <span className="text-green-500">●</span> Online
              </p>
              <div className="flex items-center gap-6">
                <span className="cursor-pointer text-xs font-bold transition-colors hover:text-primary">
                  Help Center
                </span>
                <span className="cursor-pointer text-xs font-bold transition-colors hover:text-primary">
                  Privacy
                </span>
                <span className="cursor-pointer text-xs font-bold transition-colors hover:text-primary">
                  Terms
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;
