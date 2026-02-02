import React, {useEffect, useState} from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  BadgeCheck,
  MapPin,
  Building2,
  Copy,
  User,
  ShieldAlert,
} from 'lucide-react';
import {
  useAcceptBeneficiary,
  useGetBeneficiaryByCustomer,
  useRejectBeneficiary,
} from '@/lib/react-query/Beneficiary';
import {Route} from '@/routes/_app/client/beneficiaryverification.$id';
import {getRequestStatus} from '../approval/methods';

import {MdArrowBack} from 'react-icons/md';
import {useNavigate} from '@tanstack/react-router';
import toast from 'react-hot-toast';

// --- Types ---

interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  accountLast4: string;
  status: 'verified' | 'pending' | 'rejected';
}

const BeneficiaryPage: React.FC = () => {
  const {id} = Route.useParams();
  const navigate = useNavigate();
  const [adminNote, setAdminNote] = useState('');
  const {data: beneficiaries} = useGetBeneficiaryByCustomer(id);
  const status = getRequestStatus(beneficiaries?.user);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any | null>(
    null,
  );
  const {mutateAsync: acceptBeneficiary} = useAcceptBeneficiary();
  const {mutateAsync: rejectBeneficiary} = useRejectBeneficiary();

  const reject = () => {
    if (!selectedBeneficiary?.id) {
      toast.error('Please select a beneficiary');
      return;
    }

    if (!adminNote?.trim()) {
      toast.error('Please enter a rejection note');
      return;
    }

    rejectBeneficiary({
      id: selectedBeneficiary.id,
      note: adminNote,
    });
  };

  useEffect(() => {
    setSelectedBeneficiary(beneficiaries?.foreignBeneficiaries[0]);
  }, [beneficiaries]);
  console.log('beneficiary', beneficiaries);

  return (
    <div className="bg-background-light font-sans flex h-screen flex-col overflow-hidden text-slate-800">
      {/* --- Header --- */}
      <header className="z-20 flex h-16 shrink-0 items-center justify-between bg-white px-6">
        <div className="flex items-center gap-4">
          <div className="mr-4 flex items-center gap-2">
            <div
              className="rounded-lg bg-primary/10 p-1.5"
              onClick={() => navigate({to: '/client/beneficiary'})}
            >
              <MdArrowBack className="text-gray-500 text-lg" />
            </div>

            <h1 className="text-header-text text-lg font-bold tracking-tight">
              Verification Hub
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="z-10 flex hidden w-72 shrink-0 flex-col overflow-hidden border-r border-stroke bg-white lg:flex">
          <div className="border-b border-stroke p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="ring-gray-100 h-12 w-12 overflow-hidden rounded-full ring-2">
                <img
                  src={beneficiaries?.photo}
                  alt="Client"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-header-text text-sm font-bold">
                  {beneficiaries?.user?.fullname}
                </h2>
              </div>
            </div>

            <div className="mb-4 inline-flex items-center rounded border border-green-100 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
              {status}
            </div>

            <div className="bg-gray-50 grid grid-cols-2 gap-3 rounded-lg border border-stroke p-3 text-xs">
              <div>
                <p className="text-label-text mb-0.5 text-[10px]">
                  Total Assets
                </p>
                <p className="text-header-text font-semibold">$142,500.00</p>
              </div>
            </div>
          </div>

          {/* Recent Beneficiaries List */}
          <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
            <h3 className="text-label-text mb-3 px-2 pt-2 text-[10px] font-bold uppercase tracking-wider">
              Recent Beneficiaries
            </h3>
            <div className="space-y-1">
              {beneficiaries?.foreignBeneficiaries.map((b) => {
                const benestatus = getRequestStatus(b);

                return (
                  <div
                    key={b.id}
                    className={`flex cursor-pointer items-center rounded-lg border p-2.5 transition-all ${
                      benestatus === 'PENDING'
                        ? 'relative overflow-hidden border-primary/10 bg-orange-50'
                        : 'hover:bg-gray-50 border-transparent'
                    } ${
                      selectedBeneficiary?.id === b.id
                        ? 'bg-gray-100 border-2 border-black'
                        : ''
                    } ${benestatus === 'REJECTED' ? 'opacity-60' : ''} `}
                    onClick={() => setSelectedBeneficiary(b)}
                  >
                    {/* {benestatus === 'PENDING' && (
                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary"></div>
                    )} */}

                    <div
                      className={`mr-3 flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-bold shadow-sm ${
                        benestatus === 'PENDING'
                          ? 'bg-primary text-white'
                          : benestatus === 'REJECTED'
                            ? 'bg-red-100 text-red-600'
                            : benestatus === 'APPROVED'
                              ? 'bg-green-100 text-green-600'
                              : 'text-gray-600 border border-stroke bg-white'
                      }`}
                    >
                      {b.fullName?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-xs font-semibold ${benestatus === 'PENDING' ? 'text-gray-900' : 'text-header-text'}`}
                      >
                        {b.fullName}
                      </p>
                      <p
                        className={`truncate text-[10px] ${benestatus === 'PENDING' ? 'text-gray-600' : 'text-label-text'}`}
                      >
                        {b.accountNumber}
                      </p>
                    </div>

                    <div className="ml-2">
                      {benestatus === 'APPROVED' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {benestatus === 'PENDING' && (
                        <Clock className="h-4 w-4 animate-pulse text-primary" />
                      )}
                      {benestatus === 'REJECTED' && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="bg-gray-50/50 relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="shrink-0 border-b border-stroke bg-white px-8 py-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-bold text-primary shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"></span>
                {getRequestStatus(selectedBeneficiary)}
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h1 className="text-header-text mb-1 text-2xl font-bold">
                  New Beneficiary Request
                </h1>
                <p className="text-label-text flex items-center gap-1 text-xs">
                  Submitted on{' '}
                  {new Date(selectedBeneficiary?.createdAt).toLocaleString(
                    'en-US',
                    {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    },
                  )}{' '}
                  by
                  <span className="text-gray-700 font-medium">
                    {selectedBeneficiary?.fullName}
                  </span>
                </p>
              </div>

              {/* Alert Box */}
              <div className="flex max-w-md items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-3 shadow-sm">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <h3 className="mb-0.5 text-xs font-bold text-red-800">
                    Potential KYC Flag
                  </h3>
                  <p className="text-[11px] leading-snug text-red-600">
                    Match on watch list database. Manual verification required
                    before processing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="mx-auto h-full max-w-5xl">
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-stroke bg-white shadow-sm">
                {/* Card Header */}
                <div className="bg-gray-50 flex shrink-0 items-center justify-between border-b border-stroke px-6 py-4">
                  <h3 className="text-header-text flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <User className="text-label-text h-4 w-4" />
                    Beneficiary Information
                  </h3>
                  <span className="text-gray-600 rounded border border-stroke bg-white px-2 py-1 text-[10px] font-medium shadow-sm">
                    International Transfer
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Section 1: Identity */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-3">
                      <h4 className="text-label-text mb-4 flex items-center gap-2 border-b border-stroke pb-2 text-xs font-bold uppercase tracking-wider">
                        <BadgeCheck className="h-4 w-4" /> Identity Details
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            {selectedBeneficiary?.fullName}
                          </label>
                          <div className="text-header-text text-sm font-semibold">
                            Sarah Miller
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Relationship
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            {selectedBeneficiary?.relationship}
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Email
                          </label>
                          <div className="text-header-text cursor-pointer truncate text-sm font-medium text-primary hover:underline">
                            {selectedBeneficiary?.email}
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Mobile Number
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            {selectedBeneficiary?.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Address */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-3">
                      <h4 className="text-label-text mb-4 flex items-center gap-2 border-b border-stroke pb-2 text-xs font-bold uppercase tracking-wider">
                        <MapPin className="h-4 w-4" /> Address Details
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        <div className="md:col-span-2">
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Address Line 1
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            {selectedBeneficiary?.address}
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            City
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            {selectedBeneficiary?.city}
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            State / Province
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            {selectedBeneficiary?.state}
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            ZIP / Postal Code
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            {selectedBeneficiary?.pincode}
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Country
                          </label>
                          <div className="flex items-center gap-2">
                            {/* <span className="overflow-hidden rounded-sm text-xl shadow-sm">
                              🇬🇧
                            </span> */}
                            <span className="text-header-text text-sm font-medium">
                              {selectedBeneficiary?.country}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Bank Details */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-3">
                      <h4 className="text-label-text mb-4 flex items-center gap-2 border-b border-stroke pb-2 text-xs font-bold uppercase tracking-wider">
                        <Building2 className="h-4 w-4" /> Bank Details
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Bank Country
                          </label>
                          <div className="flex items-center gap-2">
                            {/* <span className="overflow-hidden rounded-sm text-xl shadow-sm">
                              🇬🇧
                            </span> */}
                            <span className="text-header-text text-sm font-medium">
                              {selectedBeneficiary?.bankCountry}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Currency
                          </label>
                          <div className="text-header-text flex items-center gap-2 text-sm font-medium">
                            {/* <span className="bg-gray-100 text-gray-600 border-stroke rounded border px-1.5 py-0.5 text-[10px] font-bold">
                              GBP
                            </span> */}
                            {selectedBeneficiary?.currency}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Account / IBAN
                          </label>
                          <div className="text-header-text font-mono bg-gray-50 hover:border-gray-300 group flex cursor-pointer items-center justify-between rounded border border-stroke p-2 text-sm font-medium tracking-wide transition-colors">
                            {selectedBeneficiary?.accountNumber}
                            <Copy className="text-gray-400 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Account Type
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            {selectedBeneficiary?.accountType}
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            SWIFT / BIC
                          </label>
                          <div className="text-header-text font-mono text-sm font-medium">
                            {selectedBeneficiary?.SWIFTBIC}
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Routing / IFSC
                          </label>
                          <div className="text-header-text font-mono text-sm font-medium">
                            {selectedBeneficiary?.IFSC}
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Bank Name
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            {selectedBeneficiary?.bankName}
                          </div>
                        </div>
                        {/* <div className="md:col-span-4">
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Branch Name
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            London Main Branch (Old Broad St)
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Action Center */}
        <aside className="z-20 flex w-80 shrink-0 flex-col border-l border-stroke bg-white shadow-xl">
          <div className="border-b border-stroke bg-white p-6">
            <h2 className="text-header-text text-lg font-bold">
              Action Center
            </h2>
            <p className="text-label-text mt-1 text-xs">
              Review carefully before processing.
            </p>
          </div>

          <div className="bg-gray-50/30 flex flex-1 flex-col overflow-hidden p-6">
            <div className="mb-6 flex flex-1 flex-col">
              <label
                htmlFor="admin-note"
                className="text-label-text mb-2 block flex items-center justify-between text-sm font-semibold"
              >
                Admin Note
                <span className="rounded border border-red-100 bg-red-50 px-1.5 py-0.5 text-[10px] font-normal text-red-500">
                  * Required for rejection
                </span>
              </label>
              <textarea
                id="admin-note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Enter rejection reason or approval notes..."
                className="border-gray-300 text-header-text w-full flex-1 resize-none rounded-lg p-4 text-sm shadow-sm transition-shadow duration-200 focus:border-primary focus:shadow-md focus:ring-primary"
              ></textarea>
            </div>

            <div className="mt-auto shrink-0 space-y-3">
              <button
                className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]"
                onClick={() => acceptBeneficiary(selectedBeneficiary?.id)}
              >
                <CheckCircle className="h-5 w-5" />
                Approve Beneficiary
              </button>
              <button
                className="flex w-full transform items-center justify-center gap-2 rounded-lg border border-stroke bg-white px-4 py-3.5 font-medium text-red-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-[0.98]"
                onClick={() => reject()}
              >
                <XCircle className="h-5 w-5" />
                Reject Request
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BeneficiaryPage;
