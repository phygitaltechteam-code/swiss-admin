import React from 'react';
import {MdFactCheck, MdCheckCircle, MdPending, MdInfo} from 'react-icons/md';

type props = {
  SWIFTBIC: string;
  photo: string;
  name: string;
};
const SummaryChecklist: React.FC<props> = ({SWIFTBIC, photo}) => {
  return (
    <section className="bg-theme-card shadow-warm overflow-hidden rounded-xl border border-stroke">
      <div className="flex items-center justify-between border-b border-stroke bg-white p-4">
        <h2 className="text-theme-header flex items-center gap-2 text-sm font-bold uppercase tracking-tight">
          <MdFactCheck className="text-gray-400 text-lg" />
          Summary Checklist
        </h2>
      </div>

      <div className="space-y-5 bg-white p-5">
        {/* Images Row */}
        <div className="flex gap-4">
          <div className="flex -space-x-4">
            <img
              alt="Live Capture"
              className="relative z-10 h-16 w-16 rounded-lg border-2 border-white object-cover shadow-sm"
              src={photo}
            />
          </div>
          {/* <div className="flex-1">
            <div className="mb-1 text-sm font-bold text-neutral-500">
              SWIFTBIC
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="ml-1 font-semibold text-black">
                  {SWIFTBIC}
                </span>
              </div>
            <div>
                <span className="text-gray-400">Exp:</span>{' '}
                <span className="text-gray-700 ml-1 font-semibold">
                  12 Aug 2028
                </span>
              </div> 
            </div>
          </div> */}
        </div>

        {/* Checklist Items */}
        {/* <div className="space-y-2">
          <div className="border-gray-100 bg-gray-50/50 flex items-center gap-3 rounded-lg border p-2.5">
            <MdCheckCircle className="flex-shrink-0 text-lg text-emerald-500" />
            <div className="text-xs">
              <span className="text-theme-header block font-bold">
                Identity Match
              </span>
              <span className="text-theme-body">
                Face matches ID photo &gt; 80%
              </span>
            </div>
          </div>

          <div className="border-gray-100 bg-gray-50/50 flex items-center gap-3 rounded-lg border p-2.5">
            <MdCheckCircle className="flex-shrink-0 text-lg text-emerald-500" />
            <div className="text-xs">
              <span className="text-theme-header block font-bold">
                Document Validity
              </span>
              <span className="text-theme-body">Not expired, clear text</span>
            </div>
          </div>

          <div className="border-gray-200 bg-gray-50 flex items-center gap-3 rounded-lg border p-2.5">
            <div className="relative flex-shrink-0">
              <MdPending className="text-lg text-primary" />
              <span className="absolute -right-1 -top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
            </div>
            <div className="text-xs">
              <span className="text-theme-header block font-bold">
                AML Screening
              </span>
              <span className="text-theme-body">No hits on watchlists</span>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default SummaryChecklist;
