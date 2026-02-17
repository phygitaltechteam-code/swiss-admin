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
import {MdArrowBack, MdClose} from 'react-icons/md';
import {useNavigate} from '@tanstack/react-router';
import toast from 'react-hot-toast';

const BeneficiaryPage: React.FC = () => {
  const {id} = Route.useParams();
  const navigate = useNavigate();
  const [adminNote, setAdminNote] = useState('');
  const {data: beneficiaries, isLoading} = useGetBeneficiaryByCustomer(id);
  const status = getRequestStatus(beneficiaries?.user);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any | null>(
    null,
  );
  const {mutateAsync: acceptBeneficiary} = useAcceptBeneficiary();
  const {mutateAsync: rejectBeneficiary} = useRejectBeneficiary();

  // State for mobile sidebar
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // State for image modal
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  // Get status of selected beneficiary
  const selectedStatus = selectedBeneficiary
    ? getRequestStatus(selectedBeneficiary)
    : null;

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
    if (beneficiaries?.foreignBeneficiaries?.length) {
      // Sort beneficiaries: PENDING first, then APPROVED, then REJECTED
      const sorted = [...beneficiaries.foreignBeneficiaries].sort((a, b) => {
        const statusA = getRequestStatus(a);
        const statusB = getRequestStatus(b);
        const order = {PENDING: 0, APPROVED: 1, REJECTED: 2};
        return order[statusA] - order[statusB];
      });
      setSelectedBeneficiary(sorted[0]);
    }
  }, [beneficiaries]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-background-light font-sans flex h-screen flex-col overflow-hidden text-slate-800">
        <header className="z-30 flex h-16 shrink-0 items-center justify-between bg-white px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <div className="mr-2 flex items-center gap-2 lg:mr-4">
              <div className="rounded-lg bg-primary/10 p-1.5">
                <MdArrowBack className="text-gray-500 text-lg" />
              </div>
              <h1 className="text-header-text text-sm font-bold tracking-tight lg:text-lg">
                Verification Hub
              </h1>
            </div>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading beneficiary data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state – no beneficiaries found
  if (!beneficiaries?.foreignBeneficiaries?.length) {
    return (
      <div className="bg-background-light font-sans flex h-screen flex-col overflow-hidden text-slate-800">
        <header className="z-30 flex h-16 shrink-0 items-center justify-between bg-white px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <div className="mr-2 flex items-center gap-2 lg:mr-4">
              <div
                className="cursor-pointer rounded-lg bg-primary/10 p-1.5"
                onClick={() => navigate({to: '/client/beneficiary'})}
              >
                <MdArrowBack className="text-gray-500 text-lg" />
              </div>
              <h1 className="text-header-text text-sm font-bold tracking-tight lg:text-lg">
                Verification Hub
              </h1>
            </div>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-md text-center">
            <div className="bg-gray-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full p-4">
              <User className="text-gray-400 h-8 w-8" />
            </div>
            <h2 className="text-gray-800 mb-2 text-xl font-semibold">
              No Beneficiary History
            </h2>
            <p className="text-gray-500 mb-6">
              This client has not added any beneficiaries yet. When they do,
              their requests will appear here.
            </p>
            <button
              onClick={() => navigate({to: '/client/beneficiary'})}
              className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            >
              Back to Clients
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sort beneficiaries for display in sidebar
  const sortedBeneficiaries = [...beneficiaries.foreignBeneficiaries].sort(
    (a, b) => {
      const statusA = getRequestStatus(a);
      const statusB = getRequestStatus(b);
      const order = {PENDING: 0, APPROVED: 1, REJECTED: 2};
      return order[statusA] - order[statusB];
    },
  );

  // Main render with beneficiaries
  return (
    <div className="bg-background-light font-sans flex h-screen flex-col overflow-hidden text-slate-800">
      {/* --- Header --- */}
      <header className="z-30 flex h-16 shrink-0 items-center justify-between bg-white px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <div className="mr-2 flex items-center gap-2 lg:mr-4">
            <div
              className="cursor-pointer rounded-lg bg-primary/10 p-1.5"
              onClick={() => navigate({to: '/client/beneficiary'})}
            >
              <MdArrowBack className="text-gray-500 text-lg" />
            </div>
            <h1 className="text-header-text text-sm font-bold tracking-tight lg:text-lg">
              Verification Hub
            </h1>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="bg-gray-100 rounded-lg p-2"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Sidebar - Hidden on mobile, shown when toggled */}
        <aside
          className={`z-20 flex flex-col overflow-hidden border-r border-stroke bg-white lg:static lg:z-10 lg:flex lg:w-72 ${showMobileSidebar ? 'absolute left-0 top-0 h-full w-72 shadow-2xl' : 'hidden'}`}
        >
          <div className="border-b border-stroke p-4 lg:p-5">
            <div className="mb-4 flex items-center gap-3">
              <button
                onClick={() => openImageModal(beneficiaries?.photo)}
                className="ring-gray-100 h-10 w-10 overflow-hidden rounded-full ring-2 lg:h-12 lg:w-12"
              >
                <img
                  src={beneficiaries?.photo}
                  alt="Client"
                  className="h-full w-full object-cover"
                />
              </button>
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
                <p className="text-label-text mb-0.5 text-[10px]">E-Private</p>
                <p className="text-header-text font-semibold">
                  ${beneficiaries?.wallets?.[0]?.eprivateAccount || 0}
                </p>
              </div>
              <div>
                <p className="text-label-text mb-0.5 text-[10px]">Temporary</p>
                <p className="text-header-text font-semibold">
                  ${beneficiaries?.wallets?.[0]?.temporyAccount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Beneficiaries List */}
          <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
            <h3 className="text-label-text mb-3 px-2 pt-2 text-[10px] font-bold uppercase tracking-wider">
              Recent Beneficiaries
            </h3>
            <div className="space-y-1">
              {sortedBeneficiaries.map((b) => {
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
                    onClick={() => {
                      setSelectedBeneficiary(b);
                      if (window.innerWidth < 1024) {
                        setShowMobileSidebar(false);
                      }
                    }}
                  >
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

          {/* Close button for mobile */}
          {showMobileSidebar && (
            <div className="border-t border-stroke p-4 lg:hidden">
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="bg-gray-100 w-full rounded-lg py-2 text-sm font-medium"
              >
                Close
              </button>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <section className="bg-gray-50/50 relative flex min-w-0 flex-1 flex-col overflow-y-auto">
          {/* Detail Header */}
          <div className="shrink-0 border-b border-stroke bg-white px-4 py-4 lg:px-8 lg:py-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-bold text-primary shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"></span>
                {selectedStatus}
              </div>

              {/* Mobile beneficiary selector */}
              <div className="lg:hidden">
                <select
                  value={selectedBeneficiary?.id || ''}
                  onChange={(e) => {
                    const beneficiary = beneficiaries.foreignBeneficiaries.find(
                      (b) => b.id === e.target.value,
                    );
                    if (beneficiary) setSelectedBeneficiary(beneficiary);
                  }}
                  className="rounded border border-stroke bg-white px-3 py-1.5 text-sm"
                >
                  {sortedBeneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h1 className="text-header-text mb-1 text-lg font-bold lg:text-2xl">
                  New Beneficiary Request
                </h1>
                <p className="text-label-text flex flex-wrap items-center gap-1 text-xs">
                  Submitted on{' '}
                  {selectedBeneficiary?.createdAt
                    ? new Date(selectedBeneficiary.createdAt).toLocaleString(
                        'en-US',
                        {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        },
                      )
                    : 'N/A'}{' '}
                  by
                  <span className="text-gray-700 font-medium">
                    {selectedBeneficiary?.fullName}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 lg:p-8">
            <div className="mx-auto h-full max-w-5xl">
              <div className="flex h-full flex-col rounded-xl border border-stroke bg-white shadow-sm">
                {/* Card Header */}
                <div className="bg-gray-50 flex shrink-0 flex-col items-start justify-between gap-2 border-b border-stroke px-4 py-3 sm:flex-row sm:items-center sm:px-6 sm:py-4">
                  <h3 className="text-header-text flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <User className="text-label-text h-4 w-4" />
                    Beneficiary Information
                  </h3>
                  <span className="text-gray-600 rounded border border-stroke bg-white px-2 py-1 text-[10px] font-medium shadow-sm">
                    International Transfer
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Section 1: Identity */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-3">
                      <h4 className="text-label-text mb-4 flex items-center gap-2 border-b border-stroke pb-2 text-xs font-bold uppercase tracking-wider">
                        <BadgeCheck className="h-4 w-4" /> Identity Details
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Name
                          </label>
                          <div className="text-header-text mb-1.5 block font-semibold">
                            {selectedBeneficiary?.fullName}
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
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
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
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Bank Country
                          </label>
                          <div className="flex items-center gap-2">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Center - Fixed at bottom (hidden for approved/rejected) */}
          {selectedStatus !== 'REJECTED' && selectedStatus !== 'APPROVED' && (
            <div className="border-t border-stroke bg-white p-4 shadow-lg lg:px-6">
              <div className="mx-auto max-w-5xl">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <label
                      htmlFor="admin-note"
                      className="text-label-text mb-2 flex items-center justify-between text-sm font-semibold"
                    >
                      Admin Note
                    </label>
                    <textarea
                      id="admin-note"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Enter rejection reason or approval notes..."
                      className="border-gray-300 text-header-text w-full rounded-lg border p-3 text-sm shadow-sm transition-shadow duration-200 focus:border-primary focus:shadow-md focus:ring-primary"
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="flex flex-col justify-end gap-3 lg:flex-row lg:items-end">
                    <button
                      className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98] lg:w-auto lg:px-6"
                      onClick={() => acceptBeneficiary(selectedBeneficiary?.id)}
                    >
                      <CheckCircle className="h-5 w-5" />
                      Approve Beneficiary
                    </button>
                    <button
                      className="flex w-full transform items-center justify-center gap-2 rounded-lg border border-stroke bg-white px-4 py-3 font-medium text-red-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-[0.98] lg:w-auto lg:px-6"
                      onClick={() => reject()}
                    >
                      <XCircle className="h-5 w-5" />
                      Reject Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Image Modal for Client Photo */}
      {isModalOpen && modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <div
            className="dark:bg-gray-900 relative max-h-[90vh] max-w-[90vw] rounded-lg bg-white p-1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 absolute -right-3 -top-3 rounded-full bg-white p-1 shadow-lg dark:text-white"
            >
              <MdClose className="h-5 w-5" />
            </button>
            <img
              src={modalImage}
              alt="Client"
              className="max-h-[85vh] max-w-full rounded object-contain"
              onError={(e) => {
                e.currentTarget.src = '/fallback-image.png'; // optional fallback
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryPage;
