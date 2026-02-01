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
  <label className="mb-1 block text-[10px] font-extrabold uppercase text-neutral-400">
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
  const docList = [
    {
      key: 'passport',
      label: 'Passport',
      image: customerDetails?.passport,
      number: customerDetails?.passportNumber,
    },
    {
      key: 'panCard',
      label: 'PAN Card',
      image: customerDetails?.panCard,
      number: customerDetails?.panCardNumber,
    },
    {
      key: 'aadharCard',
      label: 'Aadhaar Card',
      image: customerDetails?.aadharCard,
      number: customerDetails?.aadharCardNumber,
    },
  ];

  return (
    <section className="shadow-warm flex h-full max-h-[85vh] flex-col overflow-hidden rounded-xl border border-stroke bg-white">
      <div className="border-b border-stroke bg-white p-4">
        <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-tight text-black">
          <MdBadge className="text-lg text-black" />
          Applicant Details
        </h2>
      </div>

      <div className="custom-scroll space-y-10 overflow-y-auto p-5">
        {/* Account Holder Section */}
        <div>
          <h3 className="mb-4 border-b border-stroke pb-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
            Account Holder Details
          </h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div className="col-span-2 rounded-sm bg-neutral-50 p-2">
              <Label>Full Legal Name</Label>
              <div className="text-xl font-extrabold text-black">
                {customerDetails?.user?.fullname}
              </div>
            </div>

            <div className="rounded-sm bg-neutral-50 p-2">
              <Label>Date of Birth</Label>
              <div className="text-md font-semibold text-black">
                {customerDetails?.user?.dob}
              </div>
            </div>

            <div className="rounded-sm bg-neutral-50 p-2">
              <Label>Nationality</Label>
              <div className="text-md flex items-center gap-2 font-semibold text-black">
                {customerDetails?.nationality}
              </div>
            </div>

            <div className="col-span-2 rounded-sm bg-neutral-50 p-2">
              <Label>Residential Address</Label>
              <div className="text-md font-semibold text-black">
                {customerDetails?.address}
              </div>
            </div>

            <div className="rounded-sm bg-neutral-50 p-2">
              <Label>Mobile Number</Label>
              <div className="text-md font-semibold text-black">
                {customerDetails?.user?.phoneNumber}
              </div>
            </div>
            <div className="rounded-sm bg-neutral-50 p-2">
              <Label>Email Address</Label>
              <Value className="text-md break-words font-semibold text-black">
                {customerDetails?.user?.email}
              </Value>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 rounded-xl border border-stroke p-5">
            <div className="mb-6 flex items-center gap-3">
              <div className="text-gray-600 border-gray-200 flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm">
                <MdAccountBalance className="text-xl" />
              </div>
              <div>
                <div className="text-lg font-bold text-black">Bank Details</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2">
                <Label>Account Number</Label>
                <div className="font-mono inline-block rounded-lg border border-stroke bg-white px-3 py-2 text-sm font-bold tracking-widest text-black shadow-sm">
                  {customerDetails?.accountNumber}
                </div>
              </div>
              <div>
                <Label>SWIFT / BIC</Label>
                <div className="font-mono text-sm font-bold text-black">
                  {customerDetails?.SWIFTBIC}
                </div>
              </div>
            </div>
          </div>
        </div>

        {docList
          .filter((doc) => doc.image)
          .map((doc) => (
            <div key={doc.key}>
              <h3 className="mb-6 flex items-center justify-between border-b border-stroke pb-2 text-[10px] font-bold uppercase tracking-widest text-black">
                Supporting Documents
                <button className="text-gray-500 flex items-center gap-1 text-[10px] font-bold uppercase transition-colors hover:text-black">
                  View Full Res <MdOpenInNew className="text-[12px]" />
                </button>
              </h3>

              <div className="bg-gray-100 group relative aspect-video cursor-pointer overflow-hidden rounded-xl border-2 border-stroke shadow-inner">
                <img
                  alt={doc.label}
                  className="h-full w-full object-contain mix-blend-multiply"
                  src={doc.image}
                />
                <div className="bg-theme-header/10 group-hover:bg-theme-header/20 absolute inset-0 flex items-center justify-center opacity-0 transition-colors group-hover:opacity-100">
                  <button className="text-theme-header rounded-full bg-white p-3 shadow-xl transition-transform hover:scale-105">
                    <MdZoomIn className="text-2xl" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-stroke bg-white/80 p-3">
                  <span className="mb-1 block text-[9px] font-bold uppercase text-black">
                    Doc Type
                  </span>
                  <span className="text-theme-header text-xs font-bold">
                    {doc.label}
                  </span>
                </div>

                {doc.number && (
                  <div className="border-gray-200 rounded-lg border bg-white/80 p-3">
                    <span className="mb-1 block text-[9px] font-bold uppercase text-black">
                      Doc Number
                    </span>
                    <span className="text-theme-header font-mono text-xs font-bold">
                      {doc.number}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default ApplicantDetails;
