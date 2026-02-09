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
  MdPanTool,
  MdReceiptLong,
  MdCheckCircle,
  MdCheck,
  MdArrowBack,
  MdPerson,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdAccountBalance,
  MdError,
} from 'react-icons/md';
import GenericButton from '../Forms/Buttons/GenericButton';
import {
  useGetTransferById,
  useApproveTransfer,
  useRejectTransfer,
} from '@/lib/react-query/transfer';
import toast from 'react-hot-toast';

export const TransferDetails = () => {
  const navigate = useNavigate();
  const search = useSearch({strict: false});
  const transactionId = search.transactionId as string;

  const [zoomLevel, setZoomLevel] = useState(1);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectReason, setShowRejectReason] = useState(false);

  // Use the new hook for getting a single transfer
  const {
    data: transaction,
    isLoading,
    error,
    refetch,
  } = useGetTransferById(transactionId);

  const approveTransfer = useApproveTransfer();
  const rejectTransfer = useRejectTransfer();

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleReject = () => {
    setShowRejectReason(true);
  };

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
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="text-gray-600 mt-2">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="flex h-full items-center justify-center">
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
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 border bg-white px-4 py-2 font-bold"
            >
              <MdRotateRight /> Try Again
            </GenericButton>
          </div>
        </div>
      </div>
    );
  }

  const beneficiary = transaction.beneficiaryDetails;
  console.log('Beneficiary Details:', transaction);

  const status = transaction.isRejected
    ? 'Rejected'
    : !transaction.isPending
      ? 'Approved'
      : 'Pending';

  const canTakeAction = transaction.isPending && !transaction.isRejected;

  return (
    <div className="bg-gray-50 flex h-full flex-col">
      {/* Detail Header */}
      <div className="shrink-0 bg-white px-8 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({to: '/client/transfer-approvals'})}
            className="text-gray-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wide transition-colors hover:text-primary"
          >
            <MdArrowBack className="text-[16px]" />
            Back to Transfers
          </button>
          <MdChevronRight className="text-gray-600 text-[16px]" />
          <span className="text-gray-900 text-xs font-bold uppercase tracking-wide">
            Review {transaction.id?.slice(0, 8)}...
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 text-3xl font-extrabold tracking-tight">
              Transfer Request #{transaction.id?.slice(0, 8)}...
            </h1>
            <div className="text-gray-600 flex items-center gap-3">
              <span className="text-sm font-medium">
                {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="bg-gray-300 h-1 w-1 rounded-full"></span>
              <span className="border-gray-200 bg-gray-50 text-gray-900 flex items-center gap-1.5 rounded border px-2 py-0.5 text-sm font-medium">
                <MdFingerprint className="text-[14px]" />
                {transaction.id?.slice(-8)}
              </span>
              <span className="bg-gray-300 h-1 w-1 rounded-full"></span>
              <span className="text-gray-600 text-sm">
                {transaction.particular}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-bold ${
                status === 'Pending'
                  ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                  : status === 'Approved'
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-red-300 bg-red-50 text-red-700'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    status === 'Pending'
                      ? 'bg-yellow-400'
                      : status === 'Approved'
                        ? 'bg-green-400'
                        : 'bg-red-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    status === 'Pending'
                      ? 'bg-yellow-600'
                      : status === 'Approved'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                  }`}
                ></span>
              </span>
              {status}
            </span>
            <button className="border-gray-200 text-gray-600 rounded-lg border bg-white p-2.5 shadow-sm transition-all hover:border-primary hover:text-primary">
              <MdMoreHoriz className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="bg-gray-50 flex-1 overflow-y-auto p-6">
        <div className="mx-auto grid h-full min-h-[600px] max-w-[1600px] grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Left Column: Documentation */}
          <div className="flex flex-col gap-4 xl:col-span-7">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 flex items-center gap-2 text-lg font-bold">
                <MdDescription className="text-primary" />
                Transaction Information
              </h3>
              <div className="border-gray-200 flex gap-1 rounded-lg border bg-white p-1 shadow-sm">
                <button
                  onClick={handleZoomOut}
                  className="text-gray-600 hover:bg-gray-50 rounded p-1.5 transition-colors hover:text-primary"
                  title="Zoom Out"
                >
                  <MdRemove className="text-[20px]" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="text-gray-600 hover:bg-gray-50 rounded p-1.5 transition-colors hover:text-primary"
                  title="Zoom In"
                >
                  <MdAdd className="text-[20px]" />
                </button>
                <div className="bg-gray-200 my-1 w-[1px]"></div>
                <button
                  onClick={handleResetZoom}
                  className="text-gray-600 hover:bg-gray-50 rounded p-1.5 transition-colors hover:text-primary"
                  title="Reset Zoom"
                >
                  <MdRotateRight className="text-[20px]" />
                </button>
                <button
                  className="text-gray-600 hover:bg-gray-50 rounded p-1.5 transition-colors hover:text-primary"
                  title="Full Screen"
                >
                  <MdOpenInFull className="text-[20px]" />
                </button>
              </div>
            </div>

            <div className="border-gray-200 group relative min-h-[500px] flex-1 overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="bg-gray-50 absolute inset-0 flex items-center justify-center p-8">
                <div className="max-w-2xl text-center">
                  <div className="text-gray-400 mb-4 text-6xl">🏦</div>
                  <h4 className="text-gray-700 mb-2 text-lg font-semibold">
                    Transfer Receipt
                  </h4>
                  <p className="text-gray-500 mb-6 text-sm">
                    Supporting documentation will appear here when available
                  </p>
                  <div className="border-gray-200 inline-block rounded-lg border bg-white p-6 text-left shadow-sm">
                    <div className="mb-4">
                      <p className="text-gray-600 text-xs font-medium uppercase">
                        Transaction ID
                      </p>
                      <p className="font-mono text-gray-900 font-bold">
                        {transaction.id}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600 text-xs font-medium uppercase">
                        Amount
                      </p>
                      <p className="text-gray-900 text-2xl font-bold">
                        {transaction.amountType === 'USD' ? '$' : ''}
                        {transaction.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                        <span className="text-gray-600 ml-2 text-sm font-normal">
                          {transaction.amountType}
                        </span>
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600 text-xs font-medium uppercase">
                        Type
                      </p>
                      <p className="text-gray-900 font-medium">
                        {transaction.particular}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600 text-xs font-medium uppercase">
                        Account Type
                      </p>
                      <p className="text-gray-900 font-medium">
                        {transaction.accountType}
                      </p>
                    </div>
                    <div className="border-gray-200 border-t pt-4">
                      <p className="text-gray-600 text-xs font-medium uppercase">
                        Status
                      </p>
                      <div
                        className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          status === 'Pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : status === 'Approved'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            status === 'Pending'
                              ? 'bg-yellow-500'
                              : status === 'Approved'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                          }`}
                        ></span>
                        {status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Data & Actions */}
          <div className="flex flex-col gap-6 xl:col-span-5">
            {/* Transaction Info Card */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between bg-white px-6 py-4">
                <h3 className="text-gray-900 flex items-center gap-2 font-bold">
                  <MdReceiptLong className="text-[20px] text-primary" />
                  Transaction Details
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-bold ${
                    transaction.isVerified
                      ? 'border-green-200 bg-green-100 text-green-700'
                      : 'border-red-200 bg-red-100 text-red-700'
                  }`}
                >
                  <MdCheckCircle className="text-[14px]" />
                  {transaction.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      Sender
                    </p>
                    <p className="text-gray-900 text-base font-bold">
                      {transaction.fullname || 'Unknown'}
                    </p>
                    {transaction.email && (
                      <p className="text-gray-500 text-sm">
                        {transaction.email}
                      </p>
                    )}
                    {transaction.phoneNumber && (
                      <p className="text-gray-500 text-sm">
                        {transaction.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      Beneficiary
                    </p>
                    <p className="text-gray-900 text-base font-bold">
                      {beneficiary?.fullName || 'Unknown'}
                    </p>
                    {beneficiary?.email && (
                      <p className="text-gray-500 text-sm">
                        {beneficiary.email}
                      </p>
                    )}
                    {beneficiary?.phoneNumber && (
                      <p className="text-gray-500 text-sm">
                        {beneficiary.countryCode} {beneficiary.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      Bank
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
                        {beneficiary?.bankName?.charAt(0) || 'B'}
                      </div>
                      <div>
                        <p className="text-gray-900 text-base font-medium">
                          {beneficiary?.bankName || 'Unknown Bank'}
                        </p>
                        {beneficiary?.IFSC && (
                          <p className="text-gray-500 text-xs">
                            IFSC: {beneficiary.IFSC}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      Account Number
                    </p>
                    <p className="font-mono border-gray-200 bg-gray-50 text-gray-900 w-fit break-all rounded border px-2 py-1 text-sm font-medium">
                      {beneficiary?.accountNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      SWIFT/BIC
                    </p>
                    <p className="font-mono border-gray-200 bg-gray-50 text-gray-900 w-fit break-all rounded border px-2 py-1 text-sm font-medium">
                      {beneficiary?.SWIFTBIC || 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      Country
                    </p>
                    <p className="text-gray-900 text-base font-medium">
                      {beneficiary?.bankCountry ||
                        beneficiary?.country ||
                        'N/A'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm font-medium">
                      Gross Amount
                    </p>
                    <p className="text-gray-900 text-base font-medium">
                      {transaction.amountType === 'USD' ? '$' : ''}
                      {(transaction.amount || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm font-medium">
                      Currency
                    </p>
                    <p className="text-gray-900 text-base font-medium">
                      {transaction.amountType}
                    </p>
                  </div>
                  <div className="border-gray-200 flex items-center justify-between border-t border-dashed pt-3">
                    <p className="text-gray-900 text-base font-bold">
                      Total Transfer
                    </p>
                    <p className="text-gray-900 text-2xl font-extrabold">
                      {transaction.amountType === 'USD' ? '$' : ''}
                      {(transaction.amount || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Beneficiary Details Card */}
            {beneficiary && (
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h4 className="text-gray-900 mb-4 flex items-center gap-2 text-sm font-bold">
                  <MdPerson className="text-primary" />
                  Full Beneficiary Information
                </h4>

                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  {/* Personal Info */}
                  <div>
                    <p className="text-gray-500 text-xs">Full Name</p>
                    <p className="font-medium">{beneficiary.fullName}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Relationship</p>
                    <p className="font-medium">
                      {beneficiary.relationship || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="font-medium">{beneficiary.email || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Phone</p>
                    <p className="font-medium">
                      {beneficiary.countryCode} {beneficiary.phoneNumber}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <p className="text-gray-500 text-xs">Address</p>
                    <p className="font-medium">
                      {beneficiary.address || 'N/A'}, {beneficiary.city},{' '}
                      {beneficiary.state}, {beneficiary.pincode}
                    </p>
                  </div>

                  {/* Bank Info */}
                  <div>
                    <p className="text-gray-500 text-xs">Bank Name</p>
                    <p className="font-medium">{beneficiary.bankName}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Branch</p>
                    <p className="font-medium">
                      {beneficiary.branchName || 'N/A'}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-gray-500 text-xs">Account Number</p>
                    <p className="font-mono bg-gray-50 w-fit rounded border px-2 py-1">
                      {beneficiary.accountNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Account Type</p>
                    <p className="font-medium">{beneficiary.accountType}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Currency</p>
                    <p className="font-medium">{beneficiary.currency}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">SWIFT / BIC</p>
                    <p className="font-mono">{beneficiary.SWIFTBIC || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">IFSC</p>
                    <p className="font-mono">{beneficiary.IFSC || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Country</p>
                    <p className="font-medium">
                      {beneficiary.country} / {beneficiary.bankCountry}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-gray-500 text-xs">Verification</p>
                    <p
                      className={`font-bold ${
                        beneficiary.isVerified
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {beneficiary.isVerified ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Reason Display */}
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

            {/* Actions */}
            {canTakeAction ? (
              <div className="mt-auto flex flex-col gap-4 pt-4">
                {showRejectReason && (
                  <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4">
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
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 border bg-white px-4 py-2"
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
                )}

                {!showRejectReason && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <GenericButton
                        onClick={handleReject}
                        className="border-gray-300 text-gray-700 flex h-12 items-center justify-center border bg-white font-bold hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                        disabled={approveTransfer.isPending}
                      >
                        Reject Request
                      </GenericButton>
                      <GenericButton
                        onClick={handleApprove}
                        className="flex h-12 items-center justify-center gap-2 bg-primary font-bold text-white shadow-md shadow-orange-500/10 hover:bg-orange-700"
                        disabled={approveTransfer.isPending}
                      >
                        {approveTransfer.isPending ? (
                          'Processing...'
                        ) : (
                          <>
                            <MdCheck className="text-[20px]" />
                            Approve Transfer
                          </>
                        )}
                      </GenericButton>
                    </div>
                    <p className="text-gray-600 px-4 text-center text-xs leading-relaxed">
                      By approving, funds will be released to the beneficiary
                      immediately. This action is logged and cannot be undone.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="border-gray-200 bg-gray-50 mt-auto rounded-xl border p-4">
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
