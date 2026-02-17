import {useNavigate, useSearch} from '@tanstack/react-router';
import React, {useState} from 'react';
import {
  MdChevronRight,
  MdFingerprint,
  MdMoreHoriz,
  MdDescription,
  MdRemove,
  MdAdd,
  MdRotateRight,
  MdOpenInFull,
  MdReceiptLong,
  MdCheckCircle,
  MdCheck,
  MdArrowBack,
  MdPerson,
  MdError,
  MdPanTool,
} from 'react-icons/md';
import GenericButton from '../Forms/Buttons/GenericButton';
import {
  useGetTransferById,
  useApproveTransfer,
  useRejectTransfer,
} from '@/lib/react-query/transfer';
import toast from 'react-hot-toast';
import {ArrowLeft} from 'lucide-react';

export const TransferDetails = () => {
  const navigate = useNavigate();
  const search = useSearch({strict: false}) as any;
  const transactionId = search.transactionId as string;

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [proofZoom, setProofZoom] = useState(1);

  const {
    data: transaction,
    isLoading,
    error,
    refetch,
  } = useGetTransferById(transactionId);

  const approveTransfer = useApproveTransfer();
  const rejectTransfer = useRejectTransfer();

  const handleProofZoomIn = () =>
    setProofZoom((prev) => Math.min(prev + 0.25, 3));
  const handleProofZoomOut = () =>
    setProofZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleProofZoomReset = () => setProofZoom(1);
  const handleProofFullScreen = () => {
    const img = document.getElementById('aadharCard');
    if (img && img.requestFullscreen) img.requestFullscreen();
  };

  const handleReject = () => setShowRejectReason(true);
  const handleApprove = () => {
    if (!transaction) return;
    approveTransfer.mutate(transaction.id);
  };
  const handleSubmitRejection = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    if (!transaction) return;
    rejectTransfer.mutate({id: transaction.id, note: rejectReason});
    setShowRejectReason(false);
  };

  if (isLoading) {
    return (
      <div className="bg-background-light flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
          <p className="text-gray-600 mt-2">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="bg-background-light flex h-full items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 text-4xl text-red-500">⚠️</div>
          <h3 className="text-gray-900 mb-2 text-lg font-semibold">
            Transaction not found
          </h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : 'The requested transaction could not be found'}
          </p>
          <div className="flex justify-center gap-3">
            <GenericButton
              onClick={() => navigate({to: '/client/transfer-approvals'})}
              className="flex items-center gap-2 bg-primary px-4 py-2 font-bold text-white"
            >
              <MdArrowBack /> Back to Transfers
            </GenericButton>
            <GenericButton
              onClick={() => refetch()}
              className="border-gray-300 text-gray-700 flex items-center gap-2 border bg-white px-4 py-2 font-bold hover:bg-gray-2"
            >
              <MdRotateRight /> Try Again
            </GenericButton>
          </div>
        </div>
      </div>
    );
  }

  const beneficiary = transaction.beneficiaryDetails;
  const customer = transaction.customer;
  const status = transaction.isRejected
    ? 'Rejected'
    : !transaction.isPending
      ? 'Approved'
      : 'Pending';
  const canTakeAction = transaction.isPending && !transaction.isRejected;

  return (
    <div className="bg-background-light flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-stroke bg-white px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate({to: '/client/transfer-approvals'})}
            className="text-gray-600 flex items-center text-sm font-medium transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} className="mr-1" />
            Transfers
          </button>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-gray-900 truncate text-xl font-bold tracking-tight sm:text-2xl">
              Transfer Request
            </h1>
            <div className="text-secondary-text mt-2 flex items-center gap-3">
              <span className="text-sm font-medium">
                {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-bold ${
                status === 'Pending'
                  ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                  : status === 'Approved'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <MdCheckCircle className="text-[18px]" />
              {status}
            </span>
            <button className="text-secondary-text rounded-lg border border-stroke bg-white p-2.5 shadow-sm transition-all hover:border-primary hover:text-primary">
              <MdMoreHoriz className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Left column: Image */}
          <div className="flex flex-col gap-4 xl:col-span-7">
            <div className="flex items-center justify-between">
              <h3 className="text-header-text flex items-center gap-2 text-lg font-bold">
                <MdDescription className="text-secondary-text" />
                Supporting Documentation
              </h3>
              <div className="flex gap-1 rounded-lg border border-stroke bg-white p-1 shadow-sm">
                <button
                  onClick={handleProofZoomOut}
                  className="hover:bg-gray-100 text-secondary-text hover:text-header-text rounded p-1.5 transition-colors"
                  title="Zoom Out"
                >
                  <MdRemove className="text-[20px]" />
                </button>
                <button
                  onClick={handleProofZoomIn}
                  className="hover:bg-gray-100 text-secondary-text hover:text-header-text rounded p-1.5 transition-colors"
                  title="Zoom In"
                >
                  <MdAdd className="text-[20px]" />
                </button>
                <div className="bg-border-subtle my-1 w-[1px]" />
                <button
                  onClick={handleProofZoomReset}
                  className="hover:bg-gray-100 text-secondary-text hover:text-header-text rounded p-1.5 transition-colors"
                  title="Reset Zoom"
                >
                  <MdRotateRight className="text-[20px]" />
                </button>
                <button
                  onClick={handleProofFullScreen}
                  className="hover:bg-gray-100 text-secondary-text hover:text-header-text rounded p-1.5 transition-colors"
                  title="Full Screen"
                >
                  <MdOpenInFull className="text-[20px]" />
                </button>
              </div>
            </div>
            <div className="shadow-soft group relative min-h-[300px] overflow-hidden rounded-xl border border-stroke bg-white md:min-h-[500px] lg:min-h-[600px]">
              <div className="bg-gray-100 absolute inset-0 flex items-center justify-center">
                {customer?.aadharCard ? (
                  <img
                    id="aadharCard"
                    src={customer.aadharCard}
                    alt="Aadhar Card"
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 md:p-8"
                    style={{transform: `scale(${proofZoom})`}}
                  />
                ) : (
                  <div className="text-gray-400">No Aadhar card uploaded</div>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Details & Actions */}
          <div className="flex flex-col gap-6 xl:col-span-5">
            <div className="shadow-soft overflow-hidden rounded-xl border border-stroke bg-white">
              <div className="flex items-center justify-between border-b border-stroke bg-white px-4 py-3 md:px-6 md:py-4">
                <h3 className="text-header-text flex items-center gap-2 font-bold">
                  <MdReceiptLong className="text-[20px] text-primary" />
                  Transaction Data
                </h3>
                <span className="inline-flex items-center gap-1 rounded border border-green-200 bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                  <MdCheckCircle className="text-[14px]" />
                  System Match
                </span>
              </div>

              <div className="p-4 md:p-6">
                <form className="space-y-6">
                  {/* Identity Details */}
                  <div>
                    <h4 className="text-header-text mb-3 border-b border-stroke pb-1 text-xs font-extrabold uppercase tracking-wider">
                      1. Identity Details
                    </h4>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Full Legal Name
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.fullName || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Relationship
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.relationship || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Email Address
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center truncate rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.email || 'N/A'}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Mobile Number
                        </label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-2 text-sm font-medium sm:w-28">
                            {beneficiary?.countryCode || ''}
                          </div>
                          <div className="text-header-text flex h-9 flex-1 items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                            {beneficiary?.phoneNumber || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div>
                    <h4 className="text-header-text mb-3 border-b border-stroke pb-1 text-xs font-extrabold uppercase tracking-wider">
                      2. Address Details
                    </h4>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Address Line 1
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.address || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          City
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.city || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          State / Prov.
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.state || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          ZIP / Postal
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.pincode || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Country
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.country || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div>
                    <h4 className="text-header-text mb-3 border-b border-stroke pb-1 text-xs font-extrabold uppercase tracking-wider">
                      3. Bank Details
                    </h4>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Bank Country
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.bankCountry || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Currency
                        </label>
                        <div className="bg-gray-100 text-header-text flex h-9 w-full items-center rounded border border-stroke px-3 text-sm font-bold">
                          {transaction.amountType}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Account / IBAN
                        </label>
                        <div className="font-mono text-header-text flex h-9 w-full items-center break-all rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.accountNumber || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Account Type
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.accountType || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          SWIFT / BIC
                        </label>
                        <div className="font-mono text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.SWIFTBIC || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Routing / IFSC
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.IFSC || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Bank Name
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.bankName || 'N/A'}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Branch Name
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {beneficiary?.branchName || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason (if any) */}
                  {transaction.rejectReason && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-900">
                        <MdError className="text-red-600" />
                        Rejection Reason
                      </h4>
                      <p className="text-sm text-red-800">
                        {transaction.rejectReason}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Actions */}
            {canTakeAction ? (
              <div className="mt-auto flex flex-col gap-4 pt-4">
                {showRejectReason ? (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <label className="mb-2 block text-sm font-bold text-red-900">
                      Rejection Reason <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="text-gray-900 h-24 w-full resize-none rounded-lg border border-red-200 bg-white p-3 text-sm outline-none transition-all placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      placeholder="Please specify why this transfer is being rejected..."
                      disabled={rejectTransfer.isPending}
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      <GenericButton
                        onClick={() => setShowRejectReason(false)}
                        className="border-gray-300 text-gray-700 border bg-white px-4 py-2 hover:bg-gray-2"
                        disabled={rejectTransfer.isPending}
                      >
                        Cancel
                      </GenericButton>
                      <GenericButton
                        onClick={handleSubmitRejection}
                        className="bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        disabled={rejectTransfer.isPending}
                      >
                        {rejectTransfer.isPending
                          ? 'Submitting...'
                          : 'Submit Rejection'}
                      </GenericButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={approveTransfer.isPending}
                      className="hover:bg-primary-hover flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-bold text-white shadow-md shadow-orange-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {approveTransfer.isPending ? (
                        'Processing...'
                      ) : (
                        <>
                          <MdCheck className="text-[20px]" />
                          Complete Transfer
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={approveTransfer.isPending}
                      className="text-secondary-text flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <MdError className="text-[16px]" />
                      Reject Transfer
                    </button>
                    <p className="text-secondary-text px-4 text-center text-xs leading-relaxed">
                      By completing, funds will be released to the recipient
                      bank immediately. This action is logged.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="border-gray-200 mt-auto rounded-xl border bg-gray-2 p-4">
                <p className="text-gray-600 text-center text-sm">
                  {status === 'Approved'
                    ? 'This transfer has already been approved.'
                    : status === 'Rejected'
                      ? 'This transfer has been rejected.'
                      : 'No actions available for this transfer.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
