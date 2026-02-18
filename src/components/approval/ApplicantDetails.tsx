import {UserRequest} from '@/types/approval';
import React from 'react';
import {
  MdBadge,
  MdAccountBalance,
  MdOpenInNew,
  MdZoomIn,
  MdCheckCircle,
  MdCancel,
  MdInfo,
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
  <div className={`text-sm font-bold text-black ${className}`}>{children}</div>
);

type Props = {
  customerDetails: UserRequest;
};

const ApplicantDetails: React.FC<Props> = ({customerDetails}) => {
  // -------------------- STATUS --------------------
  const user = customerDetails?.user;

  const getStatus = () => {
    if (user?.isRejected) return 'Rejected';
    if (user?.isActive && user?.isVerified) return 'Active';
    return 'Inactive';
  };

  const statusColor =
    getStatus() === 'Active'
      ? 'bg-green-100 text-green-800'
      : getStatus() === 'Rejected'
        ? 'bg-red-100 text-red-800'
        : 'bg-gray-100 text-gray-800';

  // -------------------- DOCUMENTS --------------------
  const docList = [
    {
      key: 'photo ',
      label: 'Profile',
      image: customerDetails?.photo,
      // number: customerDetails?.panCardNumber,
    },
    {
      key: 'passport',
      label: 'Passport',
      image: customerDetails?.passport,
      number: customerDetails?.passportNumber,
    },

    {
      key: 'aadharCard',
      label: 'Aadhaar Card',
      image: customerDetails?.aadharCard,
      number: customerDetails?.aadharCardNumber,
    },
  ];

  // -------------------- HELPERS --------------------
  const EXCLUDE_FIELDS = [
    'id',
    'userId',
    'securityPin',
    'passport',
    'panCard',
    'aadharCard',
    // 'passportNumber',
    'panCardNumber',
    'aadharCardNumber',
    'photo',
    'wallets',
    'user',
    'rejectedReason',
    '',
  ];

  const formatLabel = (key: string) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (
      typeof value === 'string' &&
      value.includes('T') &&
      value.includes('Z')
    ) {
      return new Date(value).toLocaleString();
    }
    return String(value);
  };

  const renderObjectDetails = (data: any) => {
    return Object.entries(data || {})
      .filter(([key, value]) => {
        // Remove excluded fields
        if (EXCLUDE_FIELDS.includes(key)) return false;

        // Remove objects/arrays
        if (typeof value === 'object' && value !== null) return false;

        // ❗ Remove boolean fields
        if (typeof value === 'boolean') return false;

        return true;
      })
      .map(([key, value]) => (
        <div key={key} className="rounded-sm bg-neutral-50 p-2">
          <Label>{formatLabel(key)}</Label>
          <Value>{formatValue(value)}</Value>
        </div>
      ));
  };

  // -------------------- UI --------------------
  return (
    <section className="shadow-warm flex h-full max-h-[85vh] flex-col overflow-hidden rounded-xl border border-stroke bg-white">
      {/* Header */}
      <div className="border-b border-stroke p-4">
        <h2 className="flex items-center justify-between text-sm font-extrabold uppercase tracking-tight">
          <span className="flex items-center gap-2">
            <MdBadge className="text-lg" />
            Applicant Details
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}
          >
            {getStatus()}
          </span>
        </h2>
      </div>

      <div className="custom-scroll space-y-10 overflow-y-auto p-5">
        {/* USER BASIC */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
            User Information
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {renderObjectDetails(customerDetails?.user)}
          </div>

          {customerDetails?.rejectedReason && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
              <MdInfo />
              {customerDetails.rejectedReason}
            </div>
          )}
        </div>

        {/* CUSTOMER DETAILS */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
            Customer Details
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {renderObjectDetails(customerDetails)}
          </div>
        </div>

        {/* BANK */}
        <div className="bg-gray-50 rounded-xl border border-stroke p-5">
          <div className="mb-4 flex items-center gap-2 font-bold">
            <MdAccountBalance />
            Bank Details
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Account Number</Label>
              <Value className="font-mono">
                {customerDetails?.accountNumber || '-'}
              </Value>
            </div>

            {/* <div>
              <Label>SWIFT / BIC</Label>
              <Value className="font-mono">
                {customerDetails?.SWIFTBIC || '-'}
              </Value>
            </div> */}
          </div>
        </div>

        {/* WALLETS */}
        {/* {customerDetails?.wallets?.length > 0 && (
          <div>
            <h3 className="mb-4 border-b pb-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              Wallet Details
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {customerDetails.wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-stroke bg-neutral-50 p-3"
                >
                  <Label>E-Private Account</Label>
                  <Value>{wallet.eprivateAccount}</Value>

                  <Label className="mt-2">Temporary Account</Label>
                  <Value>{wallet.temporyAccount}</Value>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* DOCUMENTS */}
        {docList
          .filter((doc) => doc.image)
          .map((doc) => (
            <div key={doc.key}>
              <h3 className="mb-4 flex justify-between border-b pb-2 text-[10px] font-bold uppercase tracking-widest">
                {doc.label}
                {/* <button className="text-gray-500 flex items-center gap-1 text-[10px] hover:text-black">
                  View Full Res <MdOpenInNew />
                </button> */}
              </h3>

              {/* Document Number ABOVE image */}
              {doc.number && (
                <div className="mb-3 rounded-lg border border-stroke bg-neutral-50 p-3">
                  <Label>{doc.label} Number</Label>
                  <Value className="font-mono">{doc.number}</Value>
                </div>
              )}

              {/* Image */}
              <div className="bg-gray-100 relative aspect-video overflow-hidden rounded-xl border">
                <img
                  src={doc.image}
                  alt={doc.label}
                  className="h-full w-full object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                  <button className="rounded-full bg-white p-3 shadow">
                    <MdZoomIn className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default ApplicantDetails;
