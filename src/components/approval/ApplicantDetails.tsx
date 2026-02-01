import {UserRequest} from '@/types/approval';
import React from 'react';
import {
  MdBadge,
  MdAccountBalance,
  MdStore,
  MdOpenInNew,
  MdZoomIn,
} from 'react-icons/md';

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
  <label className="text-gray-400 mb-1 block text-[10px] font-bold uppercase">
    {children}
  </label>
);

const Value: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className = '',
}) => (
  <div className={`text-theme-header text-sm font-bold ${className}`}>
    {children}
  </div>
);

type props = {
  customerDetails: UserRequest;
};

const ApplicantDetails: React.FC<props> = ({customerDetails}) => {
  return (
    <section className="bg-theme-card shadow-warm border-theme-border flex h-full max-h-[85vh] flex-col overflow-hidden rounded-xl border">
      <div className="border-gray-100 border-b bg-white p-4">
        <h2 className="text-theme-header flex items-center gap-2 text-sm font-bold uppercase tracking-tight">
          <MdBadge className="text-gray-400 text-lg" />
          Applicant Details
        </h2>
      </div>

      <div className="custom-scroll space-y-10 overflow-y-auto p-8">
        {/* Account Holder Section */}
        <div>
          <h3 className="text-gray-400 border-gray-200 mb-6 border-b pb-2 text-[10px] font-bold uppercase tracking-widest">
            Account Holder Details
          </h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div className="col-span-2">
              <Label>Full Legal Name</Label>
              <div className="text-theme-header text-lg font-bold">
                {customerDetails?.user?.fullname}
              </div>
            </div>
            {customerDetails?.user?.dob && (
              <div>
                <Label>Date of Birth</Label>
                <div className="text-theme-header text-sm font-semibold">
                  {customerDetails?.user?.dob}
                </div>
              </div>
            )}
            <div>
              <Label>Nationality</Label>
              <div className="text-theme-header flex items-center gap-2 text-sm font-semibold">
                {customerDetails?.nationality}
              </div>
            </div>
            <div className="col-span-2">
              <Label>Residential Address</Label>
              <div className="text-theme-header text-sm font-semibold">
                {customerDetails?.address}
              </div>
            </div>
            <div>
              <Label>Mobile Number</Label>
              <div className="text-theme-header text-sm font-semibold">
                {customerDetails?.user?.phoneNumber}
              </div>
            </div>
            <div>
              <Label>Email Address</Label>
              <Value className="break-words">
                {customerDetails?.user?.email}
              </Value>
            </div>
          </div>
        </div>

        {/* Bank ID Section */}
        <div>
          {/* <h3 className="text-gray-400 border-gray-200 mb-6 border-b pb-2 text-[10px] font-bold uppercase tracking-widest">
            Bank Identification
          </h3> */}
          <div className="bg-gray-50 border-gray-200 rounded-xl border p-5">
            <div className="mb-6 flex items-center gap-3">
              <div className="text-gray-600 border-gray-200 flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm">
                <MdAccountBalance className="text-xl" />
              </div>
              <div>
                <div className="text-theme-header text-sm font-bold">
                  Bank Details
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2">
                <Label>Account Number</Label>
                <div className="font-mono text-theme-header border-gray-200 inline-block rounded-lg border bg-white px-3 py-2 text-sm font-bold tracking-widest shadow-sm">
                  {customerDetails?.accountNumber}
                </div>
              </div>
              <div>
                <Label>SWIFT / BIC</Label>
                <div className="font-mono text-theme-header text-sm font-bold">
                  {customerDetails?.SWIFTBIC}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Docs */}
        <div>
          <h3 className="text-gray-400 border-gray-200 mb-6 flex items-center justify-between border-b pb-2 text-[10px] font-bold uppercase tracking-widest">
            Supporting Documents
            <button className="text-gray-500 hover:text-theme-header flex items-center gap-1 text-[10px] font-bold uppercase transition-colors">
              View Full Res <MdOpenInNew className="text-[12px]" />
            </button>
          </h3>
          <div className="border-gray-200 bg-gray-100 group relative aspect-video cursor-pointer overflow-hidden rounded-xl border-2 shadow-inner">
            <img
              alt="Passport"
              className="h-full w-full object-contain mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvhLcuPm4S_DEpKGGnbXgTpW-mWY-UhEx2VBMNtxWSyOsI3funhEyrGBQM6d6LN5k39v1zOAN6HNV60rcqd76vxju71Wl6lqZM2yHt9DY9ZYqL4dUEOw2NcMTn3XudIfzp-VS55fzgm-zLYQybn66ODlsDDy0T0p2m29EC31Eu3mM8ae3pwBZGM3VTVpjluDT5kVrTb0tI4Yh323N7jqu6sZ30unhedWCm7pCljHkTnGQwrkCjl5CWnVnKsf7bQdt0HtHLH9SbRT2Y"
            />
            <div className="bg-theme-header/10 group-hover:bg-theme-header/20 absolute inset-0 flex items-center justify-center opacity-0 transition-colors group-hover:opacity-100">
              <button className="text-theme-header rounded-full bg-white p-3 shadow-xl transition-transform hover:scale-105">
                <MdZoomIn className="text-2xl" />
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="border-gray-200 rounded-lg border bg-white/80 p-3">
              <span className="text-gray-400 mb-1 block text-[9px] font-bold uppercase">
                Doc Type
              </span>
              <span className="text-theme-header text-xs font-bold">
                Passport
              </span>
            </div>
            <div className="border-gray-200 rounded-lg border bg-white/80 p-3">
              <span className="text-gray-400 mb-1 block text-[9px] font-bold uppercase">
                Doc Number
              </span>
              <span className="text-theme-header font-mono text-xs font-bold">
                P45892201
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicantDetails;
