import React from 'react';
import {
  UserPlus,
  AlertTriangle,
  BadgeDollarSign,
  DatabaseBackup,
} from 'lucide-react';

const RightPanel: React.FC = () => {
  return (
    <aside className="border-gray-200 bg-card hidden w-80 shrink-0 flex-col border-l 2xl:flex">
      <div className="border-gray-200 flex items-center justify-between border-b p-6">
        <h3 className="text-header font-display font-bold">Recent Activity</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
        {/* Item 1 */}
        <div className="group relative flex gap-3">
          <div className="bg-gray-200 absolute bottom-[-24px] left-[19px] top-8 w-px group-last:hidden"></div>
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 ring-4 ring-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <p className="text-header text-sm font-bold">
              New Client Registration
            </p>
            <p className="text-xs leading-relaxed text-secondary">
              Client{' '}
              <span className="text-gray-900 font-semibold">Sarah Jenkins</span>{' '}
              joined the Standard Plan.
            </p>
            <span className="text-gray-400 mt-1 text-[10px] font-medium">
              2 mins ago
            </span>
          </div>
        </div>

        {/* Item 2 */}
        <div className="group relative flex gap-3">
          <div className="bg-gray-200 absolute bottom-[-24px] left-[19px] top-8 w-px group-last:hidden"></div>
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 p-2 text-orange-600 ring-4 ring-white">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <p className="text-header text-sm font-bold">System Alert</p>
            <p className="text-xs leading-relaxed text-secondary">
              High volume of failed transactions detected in region EU-West.
            </p>
            <span className="text-gray-400 mt-1 text-[10px] font-medium">
              15 mins ago
            </span>
          </div>
        </div>

        {/* Item 3 */}
        <div className="group relative flex gap-3">
          <div className="bg-gray-200 absolute bottom-[-24px] left-[19px] top-8 w-px group-last:hidden"></div>
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 p-2 text-emerald-600 ring-4 ring-white">
            <BadgeDollarSign className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <p className="text-header text-sm font-bold">Large Transfer</p>
            <p className="text-xs leading-relaxed text-secondary">
              Transfer of{' '}
              <span className="font-mono font-bold text-emerald-600">
                $45,000.00
              </span>{' '}
              approved by System.
            </p>
            <span className="text-gray-400 mt-1 text-[10px] font-medium">
              45 mins ago
            </span>
          </div>
        </div>

        {/* Item 4 */}
        <div className="group relative flex gap-3">
          <div className="bg-gray-200 absolute bottom-[-24px] left-[19px] top-8 hidden w-px"></div>
          <div className="bg-gray-100 text-gray-600 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full p-2 ring-4 ring-white">
            <DatabaseBackup className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <p className="text-header text-sm font-bold">Database Backup</p>
            <p className="text-xs leading-relaxed text-secondary">
              Daily automated backup completed successfully.
            </p>
            <span className="text-gray-400 mt-1 text-[10px] font-medium">
              1 hour ago
            </span>
          </div>
        </div>
      </div>

      <div className="border-gray-200 bg-gray-50/50 border-t p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Monthly Goal
          </span>
          <span className="text-xs font-bold text-primary">85%</span>
        </div>
        <div className="bg-gray-200 h-2 w-full rounded-full">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-1000"
            style={{width: '85%'}}
          ></div>
        </div>
        <p className="mt-2 text-xs font-medium text-secondary">
          Target: $2.5M Revenue
        </p>
      </div>
    </aside>
  );
};

export default RightPanel;
