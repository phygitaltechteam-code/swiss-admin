import React, {useState, useEffect} from 'react';
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
} from 'lucide-react';
// import {TransactionTopup} from '@/types/transactionhistory';
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
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isApproveConfirming, setIsApproveConfirming] = useState(false);

  // Fetch transaction data by ID
  const {data: transactionData, isLoading: isTransactionLoading} =
    useGettransactionWithdrawbyId(transactionId);
  const transaction = transactionData;

  // Use the mutation hooks
  const {mutate: approveTopup, isPending: isApproving} =
    useApproveWithdrawTopup();
  const {mutate: rejectTopup, isPending: isRejecting} =
    useRejectWithdrawTopup();

  const handleApprove = () => {
    if (!transaction) return;

    if (!isApproveConfirming) {
      // First click - ask for confirmation
      setIsApproveConfirming(true);
      // Reset confirmation after 3 seconds if not clicked again
      setTimeout(() => setIsApproveConfirming(false), 3000);
      return;
    }

    // Second click - execute approval
    setIsApproveConfirming(false);

    // Show loading toast
    const loadingToast = toast.loading('Approving top-up request...');

    // Call the approve mutation
    approveTopup(transaction.id, {
      onSuccess: (data) => {
        // Dismiss loading toast
        toast.dismiss(loadingToast);

        // Show success message
        toast.success(data.message || 'Top-up approved successfully!', {
          duration: 3000,
        });

        // Update parent component with new status
        onStatusUpdate(transaction.id, 'Approved');

        // Navigate back to list after successful approval
        setTimeout(() => {
          onBack();
        }, 1500);
      },
      onError: (error) => {
        // Dismiss loading toast
        toast.dismiss(loadingToast);

        // Show error message
        toast.error('Failed to approve top-up. Please try again.', {
          duration: 4000,
        });
        console.error('Approval error:', error);
        // Reset confirmation state
        setIsApproveConfirming(false);
      },
    });
  };

  const handleOpenRejectDialog = () => {
    setShowRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setShowRejectDialog(false);
    setRejectReason('');
  };

  const handleConfirmReject = () => {
    if (!transaction || !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Rejecting top-up request...');

    // Call the reject mutation with proper payload
    rejectTopup(
      {
        id: transaction.id,
        note: rejectReason,
      },
      {
        onSuccess: (data) => {
          // Dismiss loading toast
          toast.dismiss(loadingToast);

          // Show success message
          toast.success(data.message || 'Top-up rejected successfully!', {
            duration: 3000,
          });

          // Update parent component with new status and rejection reason
          onStatusUpdate(transaction.id, 'Rejected', rejectReason);

          // Navigate back to list after successful rejection
          setTimeout(() => {
            onBack();
          }, 1500);
        },
        onError: (error) => {
          // Dismiss loading toast
          toast.dismiss(loadingToast);

          // Show error message
          toast.error('Failed to reject top-up. Please try again.', {
            duration: 4000,
          });
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
        return 'border-orange-100 bg-orange-50 text-orange-600';
      case 'Approved':
        return 'border-green-100 bg-green-50 text-green-600';
      case 'Rejected':
        return 'border-red-100 bg-red-50 text-red-600';
      default:
        return 'border-gray-100 bg-gray-50 text-gray-600';
    }
  };

  // Check if any action is in progress
  const isActionInProgress = isApproving || isRejecting || isTransactionLoading;

  // Loading state
  if (isTransactionLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin rounded-full border-4 border-solid border-primary border-t-transparent p-4"></div>
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  // Error state - no transaction data
  if (!transaction) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#F9FAFB] p-4">
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

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#F9FAFB]">
      {/* Rejection Dialog Modal */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 text-lg font-bold">
                    Reject Top-Up Request
                  </h3>
                  <p className="text-gray-600 text-sm">
                    ID: {transaction.id.substring(0, 8)}...
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseRejectDialog}
                className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg p-1"
                disabled={isRejecting}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejecting this request..."
                className="border-gray-300 w-full rounded-lg border p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                rows={4}
                disabled={isRejecting}
                autoFocus
              />
              <p className="text-gray-500 mt-2 text-xs">
                This reason will be shared with the customer.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseRejectDialog}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 rounded-lg border bg-white px-4 py-3 font-medium disabled:opacity-50"
                disabled={isRejecting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isRejecting || !rejectReason.trim()}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isRejecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Rejecting...
                  </span>
                ) : (
                  'Confirm Rejection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        {/* Sub Header */}
        <div className="shrink-0 bg-white px-4 py-4 lg:px-8 lg:py-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              onClick={onBack}
              className="text-gray-600 flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Transactions
            </button>
            <span className="text-gray-600 hidden text-sm font-medium sm:inline">
              /
            </span>
            <span className="text-gray-900 truncate text-sm font-medium">
              Request {transaction.id.substring(0, 8)}...
            </span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-gray-900 truncate text-xl font-bold tracking-tight sm:text-2xl">
                Withdrawal Request Details
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-600 whitespace-nowrap">
                  Submitted on {formatDateForDisplay(transaction.createdAt)}
                </span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                {/* <span className="text-gray-600 font-mono truncate">
                  ID: {transaction.id}
                </span> */}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-sm font-bold ${getStatusColorClasses()}`}
              >
                {getStatusDisplay() === 'Pending' && (
                  <div className="mr-1 size-2 animate-pulse rounded-full bg-orange-600"></div>
                )}
                {getStatusDisplay()}
              </span>
            </div>
          </div>
        </div>

        {/* Detail Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="grid h-full gap-6 lg:grid-cols-12">
            {/* Customer Information - Left Column */}
            <div className="flex flex-col gap-6 lg:col-span-6 xl:col-span-5">
              {/* Customer Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                    <div className="bg-gray-100 flex h-16 w-16 items-center justify-center rounded-full">
                      {transaction.customer?.photo ? (
                        <img
                          src={transaction.customer.photo}
                          alt={transaction.customer.user?.fullname}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={24} className="text-gray-400" />
                      )}
                    </div>
                    {transaction.customer?.user?.isVerified && (
                      <div className="absolute -right-1 -top-1 rounded-full bg-green-500 p-1">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-gray-900 truncate text-lg font-bold">
                      {transaction.customer?.user?.fullname || 'N/A'}
                    </h3>
                    <p className="text-gray-600 truncate text-sm">
                      {transaction.customer?.user?.email || 'No email'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Personal Info */}
                  <div className="border-gray-200 border-t pt-4">
                    <h4 className="text-gray-700 mb-3 text-sm font-semibold">
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Phone size={18} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-900 text-sm font-medium">
                            Phone
                          </p>
                          <p className="text-gray-600 text-sm">
                            {transaction.customer?.user?.phoneNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail size={18} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-900 text-sm font-medium">
                            Email
                          </p>
                          <p className="text-gray-600 break-all text-sm">
                            {transaction.customer?.user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar size={18} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-900 text-sm font-medium">
                            Date of Birth
                          </p>
                          <p className="text-gray-600 text-sm">
                            {transaction.customer?.user?.dob
                              ? formatTransactionDate(
                                  transaction.customer.user.dob,
                                )
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="border-gray-200 border-t pt-4">
                    <h4 className="text-gray-700 mb-3 text-sm font-semibold">
                      Address Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-gray-900 text-sm font-medium">
                            Address
                          </p>
                          <p className="text-gray-600 text-sm">
                            {transaction.customer?.address || 'N/A'}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {transaction.customer?.city && (
                              <span className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs">
                                {transaction.customer.city}
                              </span>
                            )}
                            {transaction.customer?.state && (
                              <span className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs">
                                {transaction.customer.state}
                              </span>
                            )}
                            {transaction.customer?.pincode && (
                              <span className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs">
                                {transaction.customer.pincode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe size={18} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-900 text-sm font-medium">
                            Country
                          </p>
                          <p className="text-gray-600 text-sm">
                            {COUNTRIES.find(
                              (c) => c.code === transaction.customer?.country,
                            )?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="border-gray-200 border-t pt-4">
                    <h4 className="text-gray-700 mb-3 text-sm font-semibold">
                      Account Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CreditCardIcon
                          size={18}
                          className="text-gray-400 mt-0.5"
                        />
                        <div>
                          <p className="text-gray-900 text-sm font-medium">
                            Account Number
                          </p>
                          <p className="text-gray-900 font-mono text-sm font-semibold">
                            {transaction.customer?.accountNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText size={18} className="text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-gray-900 text-sm font-medium">
                            Account Type
                          </p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                              {getAccountTypeDisplay(transaction.accountType)}
                            </span>
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                              {transaction.amountType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details & Actions - Right Column */}
            <div className="flex flex-col gap-6 lg:col-span-6 xl:col-span-7">
              {/* Transaction Details Card */}
              <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="flex items-center justify-between bg-white px-6 py-4">
                  <h3 className="text-gray-900 text-lg font-bold">
                    Transaction Details
                  </h3>
                  <span className="flex items-center gap-1 rounded border border-green-100 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                    <ShieldCheck size={14} />
                    Verified Transaction
                  </span>
                </div>
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Transaction Info */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-gray-700 mb-4 text-sm font-semibold">
                          Transaction Information
                        </h4>
                        <div className="space-y-4">
                          {/* <div>
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">
                              Transaction ID
                            </p>
                            <p className="text-gray-900 font-mono text-sm font-medium break-all">
                              {transaction.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">
                              Wallet ID
                            </p>
                            <p className="text-gray-900 font-mono text-sm font-medium break-all">
                              {transaction.walletId}
                            </p>
                          </div> */}
                          <div>
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">
                              Particular
                            </p>
                            <p className="text-gray-900 text-sm font-medium">
                              {transaction.particular}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Account Balances */}
                      <div>
                        <h4 className="text-gray-700 mb-4 text-sm font-semibold">
                          Account Balances
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">
                              Private Account
                            </span>
                            <span className="text-gray-900 text-sm font-semibold">
                              $
                              {transaction.eprivateAccount?.toLocaleString(
                                'en-US',
                              ) || '0'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">
                              Temporary Account
                            </span>
                            <span className="text-gray-900 text-sm font-semibold">
                              $
                              {transaction.temporyAccount?.toLocaleString(
                                'en-US',
                              ) || '0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Timestamps */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-gray-700 mb-4 text-sm font-semibold">
                          Amount Details
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="mb-4">
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">
                              Withdrawal Amount
                            </p>
                            <p className="text-gray-900 text-2xl font-bold">
                              ${transaction.amount.toLocaleString('en-US')}
                              <span className="text-gray-500 ml-2 text-sm">
                                {transaction.amountType}
                              </span>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Transaction Type
                              </span>
                              <span
                                className={`font-medium ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}
                              >
                                {transaction.type}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Account Type
                              </span>
                              <span className="font-medium">
                                {getAccountTypeDisplay(transaction.accountType)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rejection Reason (if rejected) */}
                      {transaction.isRejected && transaction.rejectReason && (
                        <div className="mt-6">
                          <div className="rounded-lg bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle
                                size={20}
                                className="mt-0.5 text-red-500"
                              />
                              <div>
                                <p className="text-sm font-semibold text-red-800">
                                  Rejection Reason
                                </p>
                                <p className="mt-1 text-sm text-red-700">
                                  {transaction.rejectReason}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Only show for pending transactions */}
              {transaction.isPending && !transaction.isRejected && (
                <div className="mt-4">
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h4 className="text-gray-900 mb-4 text-lg font-bold">
                      Review Actions
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <button
                        onClick={handleOpenRejectDialog}
                        disabled={isActionInProgress}
                        className="border-gray-300 text-gray-700 flex h-12 items-center justify-center rounded-lg border bg-white font-bold shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={isActionInProgress}
                        className={`flex h-12 items-center justify-center rounded-lg font-bold text-white shadow-md transition-all ${
                          isApproveConfirming
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } disabled:opacity-50`}
                      >
                        {isApproving ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Approving...
                          </>
                        ) : isApproveConfirming ? (
                          'Click again to confirm'
                        ) : (
                          'Approve Withdrawal'
                        )}
                      </button>
                    </div>
                    <p className="text-gray-500 mt-4 text-center text-sm">
                      Review all information before taking action
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
