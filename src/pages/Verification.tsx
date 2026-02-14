import {useNavigate} from '@tanstack/react-router';
import React, {useEffect, useState} from 'react';

export const Verification: React.FC = () => {
  const [statusText, setStatusText] = useState('SCANNING DOCUMENTS');
  const navigate = useNavigate();
  const statuses = [
    'SCANNING DOCUMENTS',
    'VERIFYING BIOMETRICS',
    'EXTRACTING DATA',
    'FINALIZING REVIEW',
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      setStatusText(statuses[currentIndex]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-[#f0f5ff] to-[#ffffff]">
      {/* Top Header Placeholder */}
      <div className="z-10 flex items-center justify-between p-4">
        <div className="w-10"></div>
        <h2 className="flex-1 truncate text-center text-lg font-bold leading-tight tracking-[-0.015em] text-slate-800"></h2>
        <div className="w-10"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 -mt-16 flex flex-1 flex-col items-center justify-center px-6">
        {/* Animated Verification Icon Container */}
        <div className="relative mb-12 flex h-64 w-64 items-center justify-center">
          {/* Animated Rings */}
          <div className="absolute inset-0 m-auto h-32 w-32 animate-[pulse-ring_3s_cubic-bezier(0.215,0.61,0.355,1)_infinite] rounded-full border border-primary/30"></div>
          <div className="animate-ring-delay-1 absolute inset-0 m-auto h-32 w-32 animate-[pulse-ring_3s_cubic-bezier(0.215,0.61,0.355,1)_infinite] rounded-full border border-primary/30"></div>
          <div className="animate-ring-delay-2 absolute inset-0 m-auto h-32 w-32 animate-[pulse-ring_3s_cubic-bezier(0.215,0.61,0.355,1)_infinite] rounded-full border border-primary/30"></div>

          {/* Background Glow */}
          <div className="absolute inset-0 m-auto h-48 w-48 rounded-full bg-blue-50 opacity-50 blur-2xl"></div>

          {/* Center Shield Icon */}
          <div className="relative z-20 flex h-32 w-32 animate-[scan-glow_2s_ease-in-out_infinite] items-center justify-center rounded-full border border-white bg-white shadow-2xl">
            <div className="relative">
              <span className="material-symbols-outlined relative z-10 select-none text-[64px] text-primary">
                verified_user
              </span>
              {/* Small accent dot */}
              <div className="absolute bottom-2 right-1 z-20 h-4 w-4 rounded-full border-2 border-white bg-amber-400"></div>
            </div>
          </div>
        </div>

        {/* Textual Content */}
        <div className="flex max-w-sm flex-col items-center space-y-4">
          <h2 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#0d131c]">
            Verification in Progress
          </h2>
          <p className="px-4 text-center text-base font-medium leading-relaxed text-slate-500">
            We are reviewing your documents. This usually takes less than 24
            hours. We will notify you once your account is fully verified.
          </p>

          {/* Status Badge */}
          <div className="mt-4 flex items-center gap-2 rounded-full border border-blue-100/50 bg-blue-50/80 px-5 py-2.5 backdrop-blur-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_rgba(245,127,61,0.6)]"></div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-primary">
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative z-20 mx-auto w-full max-w-md bg-transparent p-6 pb-12">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              navigate({to: '/signin'});
            }}
            className="hover:bg-primary-dark flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white shadow-lg shadow-primary/25 transition-all duration-300 active:scale-[0.98]"
          >
            <span className="truncate">Back to Dashboard</span>
          </button>

          <button className="group flex h-10 w-full cursor-pointer items-center justify-center px-5 text-sm font-semibold leading-normal text-slate-500 transition-colors hover:text-primary">
            <span className="material-symbols-outlined mr-2 text-[18px] opacity-0 transition-opacity group-hover:opacity-100">
              support_agent
            </span>
            Need help? Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
