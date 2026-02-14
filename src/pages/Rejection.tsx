import {useNavigate} from '@tanstack/react-router';
import React from 'react';

export const Rejection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-[#fff5f5] to-[#ffffff]">
      {/* Top Header Placeholder */}
      <div className="z-10 flex items-center justify-between p-4">
        <div className="w-10"></div>
        <h2 className="flex-1 truncate text-center text-lg font-bold leading-tight tracking-[-0.015em] text-slate-800"></h2>
        <div className="w-10"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 -mt-16 flex flex-1 flex-col items-center justify-center px-6">
        {/* Animated Rejection Icon Container */}
        <div className="relative mb-12 flex h-64 w-64 items-center justify-center">
          {/* Animated Rings (Red) */}
          <div className="absolute inset-0 m-auto h-32 w-32 animate-[pulse-ring_3s_cubic-bezier(0.215,0.61,0.355,1)_infinite] rounded-full border border-red-200"></div>
          <div className="animate-ring-delay-1 absolute inset-0 m-auto h-32 w-32 animate-[pulse-ring_3s_cubic-bezier(0.215,0.61,0.355,1)_infinite] rounded-full border border-red-200"></div>

          {/* Background Glow */}
          <div className="absolute inset-0 m-auto h-48 w-48 rounded-full bg-red-50 opacity-50 blur-2xl"></div>

          {/* Center Error Icon */}
          <div className="relative z-20 flex h-32 w-32 items-center justify-center rounded-full border border-white bg-white shadow-2xl">
            <div className="relative">
              <span className="material-symbols-outlined relative z-10 select-none text-[64px] text-red-500">
                cancel
              </span>
              {/* Alert accent */}
              <div className="absolute -right-1 -top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-100">
                <span className="material-symbols-outlined text-[14px] font-bold text-red-600">
                  priority_high
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Textual Content */}
        <div className="flex max-w-sm flex-col items-center space-y-4">
          <h2 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#0d131c]">
            Verification Failed
          </h2>
          <p className="px-4 text-center text-base font-medium leading-relaxed text-slate-500">
            We couldn&lsquo;t verify your identity with the documents provided.
            This might be due to blurry photos or expired identification.
          </p>

          {/* Status Badge */}
          <div className="mt-4 flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-5 py-2.5 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-red-600">
              REJECTION REASON: INVALID ID
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative z-20 mx-auto w-full max-w-md bg-transparent p-6 pb-12">
        <div className="flex flex-col gap-3">
          <button
            onClick={() =>
              navigate({
                to: '/dashboard',
              })
            }
            className="flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-red-600 px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-all duration-300 active:scale-[0.98]"
          >
            <span className="truncate">Back to Dashboard</span>
          </button>

          <button className="group mt-2 flex h-10 w-full cursor-pointer items-center justify-center px-5 text-sm font-semibold leading-normal text-slate-500 transition-colors hover:text-red-600">
            <span className="material-symbols-outlined mr-2 text-[18px] opacity-0 transition-opacity group-hover:opacity-100">
              support_agent
            </span>
            Contact Support for Details
          </button>
        </div>
      </div>
    </div>
  );
};
