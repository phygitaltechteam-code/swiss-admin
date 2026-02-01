import React, {useState} from 'react';
import {
  Shield,
  CheckCircle2,
  CreditCard,
  Search,
  Bell,
  MoreVertical,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import {TransactionTopup} from '@/types/transactionhistory';
import GenericButton from '../Forms/Buttons/GenericButton';

interface TopUpDetailProps {
  transaction: TransactionTopup;
  onBack: () => void;
}

export const TopUpDetail: React.FC<TopUpDetailProps> = ({
  transaction,
  onBack,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#F9FAFB]">
      {/* Background Pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#0F1535 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        {/* Sub Header */}
        <div className="shrink-0 bg-white px-8 py-6">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              onClick={onBack}
              className="text-gray-600 text-sm font-medium transition-colors hover:text-primary"
            >
              Top-Up Approvals
            </button>
            <span className="text-gray-600 text-sm font-medium">/</span>
            <span className="text-gray-900 text-sm font-medium">
              Request {transaction.transactionId}
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 text-2xl font-bold tracking-tight">
                Top-Up Request {transaction.transactionId}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm font-normal">
                  Submitted on {transaction.date}
                </span>
                <span className="bg-gray-600 h-1 w-1 rounded-full"></span>
                <span className="text-gray-600 text-sm font-normal">
                  ID: {transaction.id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${
                  transaction.status === 'Pending'
                    ? 'border-orange-100/50 bg-orange-50 text-orange-600'
                    : transaction.status === 'Approved'
                      ? 'border-green-100 bg-green-50 text-green-600'
                      : 'border-red-100 bg-red-50 text-red-600'
                }`}
              >
                {transaction.status === 'Pending' && (
                  <div className="mr-1 size-2 animate-pulse rounded-full bg-orange-600"></div>
                )}
                {transaction.status} Review
              </span>
              <div className="bg-gray-200 mx-1 h-6 w-px"></div>
              <button className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg p-2 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Detail Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid h-full min-h-[600px] grid-cols-1 gap-8 xl:grid-cols-12">
            {/* Left Column: Proof of Payment */}
            <div className="flex flex-col gap-4 xl:col-span-7">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 text-lg font-bold">
                  Proof of Payment
                </h3>
                <div className="border-gray-200 flex gap-1 rounded-lg border bg-white p-1 shadow-sm">
                  <button
                    onClick={handleZoomOut}
                    className="text-gray-600 hover:bg-gray-50 rounded p-1.5 transition-colors hover:text-primary"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="text-gray-600 hover:bg-gray-50 rounded p-1.5 transition-colors hover:text-primary"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="text-gray-600 hover:bg-gray-50 rounded p-1.5 transition-colors hover:text-primary"
                  >
                    <RotateCw size={18} />
                  </button>
                  <div className="bg-gray-200 my-1 w-px"></div>
                  <button className="text-gray-600 hover:bg-gray-50 rounded p-1.5 transition-colors hover:text-primary">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
              <div className="border-gray-200 group relative min-h-[500px] flex-1 overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="bg-gray-50/30 absolute inset-0 flex items-center justify-center p-8">
                  <img
                    src={transaction.receiptUrl}
                    alt="Receipt"
                    className="h-full w-full origin-top object-contain shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{transform: `scale(${zoomLevel})`}}
                  />
                </div>
                <div className="bg-gray-900/90 pointer-events-none absolute bottom-4 left-4 rounded-md px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm">
                  Click and drag to pan
                </div>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="flex flex-col gap-6 xl:col-span-5">
              {/* User Card */}
              <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
                <div
                  className="bg-gray-100 ring-gray-50 size-12 rounded-full bg-cover bg-center ring-2"
                  style={{backgroundImage: `url(${transaction.avatarUrl})`}}
                ></div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-gray-900 truncate text-base font-bold">
                    {transaction.clientName}
                  </h4>
                  <p className="text-gray-600 text-xs">
                    Tier 2 Verified • Customer since 2021
                  </p>
                </div>
                <div className="border-gray-100 border-l pl-4 text-right">
                  <p className="text-gray-600 mb-0.5 text-xs">Trust Score</p>
                  <div className="flex items-center justify-end gap-1 text-emerald-600">
                    <Shield size={16} className="fill-emerald-600" />
                    <p className="text-sm font-bold">
                      {transaction.trustScore}/100
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Data Card */}
              <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="flex items-center justify-between bg-white px-6 py-4">
                  <h3 className="text-gray-900 font-bold">
                    Transaction Details
                  </h3>
                  <span className="flex items-center gap-1 rounded border border-emerald-100 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    <ShieldCheck size={14} />
                    Verified Data
                  </span>
                </div>
                <div className="flex-1 space-y-8 p-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
                        Account No.
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-gray-900 text-base font-medium">
                          **** {transaction.accountNo}
                        </p>
                        <CheckCircle size={18} className="text-emerald-500" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
                        Reference No.
                      </p>
                      <p className="font-mono text-gray-900 text-base font-medium">
                        {transaction.referenceNo}
                      </p>
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                      <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
                        Payment Method
                      </p>
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-gray-600" />
                        <p className="text-gray-900 text-base font-medium">
                          {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 text-sm">Requested Amount</p>
                      <p className="text-gray-900 text-base font-medium">
                        $
                        {transaction.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 text-sm">
                        Processing Fee (0.1%)
                      </p>
                      <p className="text-base font-medium text-red-500">
                        -${(transaction.amount * 0.001).toFixed(2)}
                      </p>
                    </div>
                    <div className="border-gray-200 flex items-center justify-between border-t border-dashed pt-4">
                      <p className="text-gray-900 text-base font-bold">
                        Net Top-Up Amount
                      </p>
                      <p className="text-gray-900 text-2xl font-extrabold">
                        $
                        {(transaction.amount * 0.999).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <GenericButton
                    onClick={() => alert('Rejection logic here')}
                    className="border-gray-300 text-gray-700 flex h-12 items-center justify-center rounded-lg border bg-white font-bold shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    Reject Request
                  </GenericButton>
                  <GenericButton
                    onClick={() => alert('Approval logic here')}
                    className="flex h-12 items-center justify-center rounded-lg bg-orange-600 font-bold text-white shadow-md shadow-orange-500/10 transition-all hover:bg-orange-700"
                  >
                    Approve Top-Up
                  </GenericButton>
                </div>
                <p className="text-gray-500/70 text-center text-xs">
                  Action will be logged by Admin ID: 8492
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
