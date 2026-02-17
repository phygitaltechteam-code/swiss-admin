import React, {useState} from 'react';
import {
  Shield,
  CheckCircle2,
  CreditCard,
  Search,
  Bell,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  FileText,
  CreditCardIcon,
  ArrowLeft,
  Minus,
  Plus,
  RotateCw,
  Maximize2,
  Check,
  X,
} from 'lucide-react';
import GenericButton from '../Forms/Buttons/GenericButton';
import toast from 'react-hot-toast';
import {COUNTRIES} from '@/context/countries';
import {
  useApproveWithdrawTopup,
  useGettransactionWithdrawbyId,
  useRejectWithdrawTopup,
} from '@/lib/react-query/withdrawltopup';

interface TopUpDetailProps {
  transactionId: string;
  onBack: () => void;
  onStatusUpdate: (
    transactionId: string,
    status: string,
    rejectReason?: string,
  ) => void;
}

// Helper function to format date
const formatTransactionDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to format date for display
const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Map account type to display name
const getAccountTypeDisplay = (type: string) => {
  switch (type) {
    case 'E_PRIVATEACCOUNT':
      return 'Private Account';
    case 'E_TEMPORARYACCOUNT':
      return 'Temporary Account';
    case 'E_STANDARDACCOUNT':
      return 'Standard Account';
    default:
      return type.replace('E_', '').replace('ACCOUNT', ' Account');
  }
};

export const WithdrawDetail: React.FC<TopUpDetailProps> = ({
  transactionId,
  onBack,
  onStatusUpdate,
}) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [proofZoom, setProofZoom] = useState(1);

  // Fetch transaction data by ID
  const {data: transaction, isLoading} =
    useGettransactionWithdrawbyId(transactionId);

  // Use the mutation hooks
  const {mutate: approveTopup, isPending: isApproving} =
    useApproveWithdrawTopup();
  const {mutate: rejectTopup, isPending: isRejecting} =
    useRejectWithdrawTopup();

  const handleProofZoomIn = () =>
    setProofZoom((prev) => Math.min(prev + 0.25, 3));
  const handleProofZoomOut = () =>
    setProofZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleProofZoomReset = () => setProofZoom(1);
  const handleProofFullScreen = () => {
    const img = document.getElementById('proofImage');
    if (img && img.requestFullscreen) img.requestFullscreen();
  };

  const handleApprove = () => {
    if (!transaction) return;
    approveTopup(transaction.id, {
      onSuccess: (data) => {
        toast.success(data.message || 'Withdrawal approved successfully!');
        onStatusUpdate(transaction.id, 'Approved');
        setTimeout(onBack, 1500);
      },
      onError: (error) => {
        toast.error('Failed to approve withdrawal. Please try again.');
        console.error('Approval error:', error);
      },
    });
  };

  const handleRejectClick = () => setShowRejectReason(true);
  const handleCancelReject = () => {
    setShowRejectReason(false);
    setRejectReason('');
  };

  const handleSubmitRejection = () => {
    if (!transaction || !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectTopup(
      {id: transaction.id, note: rejectReason},
      {
        onSuccess: (data) => {
          toast.success(data.message || 'Withdrawal rejected successfully!');
          onStatusUpdate(transaction.id, 'Rejected', rejectReason);
          setTimeout(onBack, 1500);
        },
        onError: (error) => {
          toast.error('Failed to reject withdrawal. Please try again.');
          console.error('Rejection error:', error);
        },
      },
    );
  };

  // Get status display
  const getStatusDisplay = () => {
    if (!transaction) return 'Loading...';
    if (transaction.isRejected) return 'Rejected';
    if (transaction.isPending) return 'Pending';
    return 'Approved';
  };

  // Get status color classes
  const getStatusColorClasses = () => {
    const status = getStatusDisplay();
    switch (status) {
      case 'Pending':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      case 'Approved':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'Rejected':
        return 'border-red-200 bg-red-50 text-red-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-600';
    }
  };

  const isActionInProgress = isApproving || isRejecting || isLoading;

  if (isLoading) {
    return (
      <div className="bg-background-light flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="bg-background-light flex h-full flex-col items-center justify-center p-4">
        <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
        <h3 className="text-gray-900 mb-2 text-xl font-bold">
          Transaction not found
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          The requested transaction could not be loaded.
        </p>
        <button
          onClick={onBack}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-orange-600"
        >
          <ArrowLeft className="mr-2 inline-block" size={18} />
          Back to Transactions
        </button>
      </div>
    );
  }

  const customer = transaction.customer;
  const user = customer?.user;
  const status = getStatusDisplay();
  const canTakeAction = transaction.isPending && !transaction.isRejected;
  const proofImageUrl = customer?.aadharCard || customer?.photo;

  return (
    <div className="bg-background-light flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-stroke bg-white px-4 py-4 md:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={onBack}
            className="text-gray-600 flex items-center text-sm font-medium transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} className="mr-1" />
            Withdrawals
          </button>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-gray-900 truncate text-xl font-bold tracking-tight sm:text-2xl">
              Withdrawal Request
            </h1>
            <div className="text-secondary-text mt-2 flex items-center gap-3">
              <span className="text-sm font-medium">
                {formatTransactionDate(transaction.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-bold ${getStatusColorClasses()}`}
            >
              <CheckCircle className="text-[18px]" />
              {status}
            </span>
            <button className="text-secondary-text rounded-lg border border-stroke bg-white p-2.5 shadow-sm transition-all hover:border-primary hover:text-primary">
              <MoreVertical className="text-[20px]" />
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
                <FileText className="text-secondary-text" />
                Supporting Documentation
              </h3>
              <div className="flex gap-1 rounded-lg border border-stroke bg-white p-1 shadow-sm">
                <button
                  onClick={handleProofZoomOut}
                  className="hover:bg-gray-100 text-secondary-text hover:text-header-text rounded p-1.5 transition-colors"
                  title="Zoom Out"
                >
                  <Minus className="text-[20px]" />
                </button>
                <button
                  onClick={handleProofZoomIn}
                  className="hover:bg-gray-100 text-secondary-text hover:text-header-text rounded p-1.5 transition-colors"
                  title="Zoom In"
                >
                  <Plus className="text-[20px]" />
                </button>
                <div className="bg-border-subtle my-1 w-[1px]" />
                <button
                  onClick={handleProofZoomReset}
                  className="hover:bg-gray-100 text-secondary-text hover:text-header-text rounded p-1.5 transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCw className="text-[20px]" />
                </button>
                <button
                  onClick={handleProofFullScreen}
                  className="hover:bg-gray-100 text-secondary-text hover:text-header-text rounded p-1.5 transition-colors"
                  title="Full Screen"
                >
                  <Maximize2 className="text-[20px]" />
                </button>
              </div>
            </div>
            <div className="shadow-soft group relative min-h-[300px] overflow-hidden rounded-xl border border-stroke bg-white md:min-h-[500px] lg:min-h-[600px]">
              <div className="bg-gray-100 absolute inset-0 flex items-center justify-center">
                {proofImageUrl ? (
                  <img
                    id="proofImage"
                    src={proofImageUrl}
                    alt="Proof"
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 md:p-8"
                    style={{transform: `scale(${proofZoom})`}}
                  />
                ) : (
                  <div className="text-gray-400">
                    No proof document uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Details & Actions */}
          <div className="flex flex-col gap-6 xl:col-span-5">
            <div className="shadow-soft overflow-hidden rounded-xl border border-stroke bg-white">
              <div className="flex items-center justify-between border-b border-stroke bg-white px-4 py-3 md:px-6 md:py-4">
                <h3 className="text-header-text flex items-center gap-2 font-bold">
                  <CreditCard className="text-[20px] text-primary" />
                  Withdrawal Data
                </h3>
                <span className="inline-flex items-center gap-1 rounded border border-green-200 bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                  <CheckCircle className="text-[14px]" />
                  Customer Verified
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
                          {user?.fullname || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Email Address
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center truncate rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {user?.email || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Phone Number
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {user?.phoneNumber || 'N/A'}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Date of Birth
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {user?.dob ? formatTransactionDate(user.dob) : 'N/A'}
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
                          Address Line
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {customer?.address || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          City
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {customer?.city || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          State / Province
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {customer?.state || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          ZIP / Postal
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {customer?.pincode || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Country
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {COUNTRIES.find((c) => c.code === customer?.country)
                            ?.name || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Details */}
                  <div>
                    <h4 className="text-header-text mb-3 border-b border-stroke pb-1 text-xs font-extrabold uppercase tracking-wider">
                      3. Withdrawal Details
                    </h4>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Amount
                        </label>
                        <div className="bg-gray-100 text-header-text flex h-9 w-full items-center rounded border border-stroke px-3 text-sm font-bold">
                          ${transaction.amount.toLocaleString('en-US')}{' '}
                          {transaction.amountType}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Particular
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {transaction.particular}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Account Type
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          {getAccountTypeDisplay(transaction.accountType)}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Private Balance
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          $
                          {transaction.eprivateAccount?.toLocaleString(
                            'en-US',
                          ) || '0'}
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-text mb-1 block text-xs font-bold">
                          Temporary Balance
                        </label>
                        <div className="text-header-text flex h-9 w-full items-center rounded border border-stroke bg-gray-2 px-3 text-sm font-medium">
                          $
                          {transaction.temporyAccount?.toLocaleString(
                            'en-US',
                          ) || '0'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason (if any) */}
                  {transaction.rejectReason && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-900">
                        <AlertCircle className="text-red-600" />
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
                      placeholder="Please specify why this withdrawal is being rejected..."
                      disabled={isRejecting}
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      <GenericButton
                        onClick={handleCancelReject}
                        className="border-gray-300 text-gray-700 border bg-white px-4 py-2 hover:bg-gray-2"
                        disabled={isRejecting}
                      >
                        Cancel
                      </GenericButton>
                      <GenericButton
                        onClick={handleSubmitRejection}
                        className="bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        disabled={isRejecting || !rejectReason.trim()}
                      >
                        {isRejecting ? 'Submitting...' : 'Submit Rejection'}
                      </GenericButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="hover:bg-primary-hover flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-bold text-white shadow-md shadow-orange-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isApproving ? (
                        'Processing...'
                      ) : (
                        <>
                          <Check className="text-[20px]" />
                          Complete Withdrawal
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleRejectClick}
                      disabled={isApproving}
                      className="text-secondary-text flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <X className="text-[16px]" />
                      Reject Withdrawal
                    </button>
                    <p className="text-secondary-text px-4 text-center text-xs leading-relaxed">
                      By completing, funds will be deducted from the customer
                      &lsquo;s account. This action is logged.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="border-gray-200 mt-auto rounded-xl border bg-gray-2 p-4">
                <p className="text-gray-600 text-center text-sm">
                  {status === 'Approved'
                    ? 'This withdrawal has already been approved.'
                    : status === 'Rejected'
                      ? 'This withdrawal has been rejected.'
                      : 'No actions available for this withdrawal.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
