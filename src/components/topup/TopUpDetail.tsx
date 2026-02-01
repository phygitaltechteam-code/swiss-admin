import React from 'react';
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
import {TransactionTopup} from '../../types/transactionhistory';

interface TopUpDetailProps {
  transaction: TransactionTopup;
  onBack: () => void;
}

export const TopUpDetail: React.FC<TopUpDetailProps> = ({
  transaction,
  onBack,
}) => {
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

      {/* Header */}
      <header className="border-gray-200 relative z-20 flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div
          className="flex w-64 shrink-0 cursor-pointer items-center gap-4"
          onClick={onBack}
        >
          <div className="size-8 text-primary">
            <svg
              className="h-full w-full"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2 className="text-header text-lg font-bold leading-tight">
            Admin Panel
          </h2>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 justify-between gap-8 pl-4">
          <div className="border-gray-200 bg-gray-50 flex h-10 w-full max-w-md items-center rounded-lg border px-3 transition-all focus-within:border-primary focus-within:bg-white">
            <Search size={18} className="mr-2 text-secondary" />
            <input
              className="text-header w-full border-none bg-transparent text-sm outline-none placeholder:text-secondary"
              placeholder="Search transactions, clients, or IDs..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-header relative text-secondary transition-colors">
              <Bell size={20} />
              <span className="absolute right-0 top-0 size-2 rounded-full border-2 border-white bg-red-500"></span>
            </button>
            <div
              className="ring-gray-100 size-9 cursor-pointer rounded-full bg-cover bg-center bg-no-repeat shadow-sm ring-2"
              style={{backgroundImage: `url('https://picsum.photos/100/100')`}}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        {/* Sub Header */}
        <div className="border-gray-200 shrink-0 border-b bg-white px-8 py-6">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              onClick={onBack}
              className="text-sm font-medium text-secondary transition-colors hover:text-primary"
            >
              Top-Up Approvals
            </button>
            <span className="text-sm font-medium text-secondary">/</span>
            <span className="text-header text-sm font-medium">
              Request {transaction.transactionId}
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-header text-2xl font-bold tracking-tight">
                Top-Up Request {transaction.transactionId}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm font-normal text-secondary">
                  Submitted on {transaction.date}
                </span>
                <span className="h-1 w-1 rounded-full bg-secondary"></span>
                <span className="text-sm font-normal text-secondary">
                  ID: {transaction.id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${
                  transaction.status === 'Pending'
                    ? 'border-orange-100/50 bg-orange-50 text-primary'
                    : transaction.status === 'Approved'
                      ? 'border-green-100 bg-green-50 text-green-600'
                      : 'border-red-100 bg-red-50 text-red-600'
                }`}
              >
                {transaction.status === 'Pending' && (
                  <div className="mr-1 size-2 animate-pulse rounded-full bg-primary"></div>
                )}
                {transaction.status} Review
              </span>
              <div className="bg-gray-200 mx-1 h-6 w-px"></div>
              <button className="hover:bg-gray-100 hover:text-header rounded-lg p-2 text-secondary transition-colors">
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
                <h3 className="text-header text-lg font-bold">
                  Proof of Payment
                </h3>
                <div className="border-gray-200 flex gap-1 rounded-lg border bg-white p-1 shadow-sm">
                  <button className="hover:bg-gray-50 rounded p-1.5 text-secondary transition-colors hover:text-primary">
                    <ZoomOut size={18} />
                  </button>
                  <button className="hover:bg-gray-50 rounded p-1.5 text-secondary transition-colors hover:text-primary">
                    <ZoomIn size={18} />
                  </button>
                  <button className="hover:bg-gray-50 rounded p-1.5 text-secondary transition-colors hover:text-primary">
                    <RotateCw size={18} />
                  </button>
                  <div className="bg-gray-200 my-1 w-px"></div>
                  <button className="hover:bg-gray-50 rounded p-1.5 text-secondary transition-colors hover:text-primary">
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
                  />
                </div>
                <div className="bg-header/90 pointer-events-none absolute bottom-4 left-4 rounded-md px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm">
                  Click and drag to pan
                </div>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="flex flex-col gap-6 xl:col-span-5">
              {/* User Card */}
              <div className="border-gray-200 flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm">
                <div
                  className="bg-gray-100 ring-gray-50 size-12 rounded-full bg-cover bg-center ring-2"
                  style={{backgroundImage: `url(${transaction.avatarUrl})`}}
                ></div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-header truncate text-base font-bold">
                    {transaction.clientName}
                  </h4>
                  <p className="text-xs text-secondary">
                    Tier 2 Verified • Customer since 2021
                  </p>
                </div>
                <div className="border-gray-100 border-l pl-4 text-right">
                  <p className="mb-0.5 text-xs text-secondary">Trust Score</p>
                  <div className="flex items-center justify-end gap-1 text-emerald-600">
                    <Shield size={16} className="fill-emerald-600" />
                    <p className="text-sm font-bold">
                      {transaction.trustScore}/100
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Data Card */}
              <div className="border-gray-200 flex flex-1 flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="border-gray-200 flex items-center justify-between border-b bg-white px-6 py-4">
                  <h3 className="text-header font-bold">Transaction Details</h3>
                  <span className="flex items-center gap-1 rounded border border-emerald-100 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    <ShieldCheck size={14} />
                    Verified Data
                  </span>
                </div>
                <div className="flex-1 space-y-8 p-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                        Account No.
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-header text-base font-medium">
                          **** {transaction.accountNo}
                        </p>
                        <CheckCircle size={18} className="text-emerald-500" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                        Reference No.
                      </p>
                      <p className="font-mono text-header text-base font-medium">
                        {transaction.referenceNo}
                      </p>
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                        Payment Method
                      </p>
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-secondary" />
                        <p className="text-header text-base font-medium">
                          {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-gray-100 space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-secondary">Requested Amount</p>
                      <p className="text-header text-base font-medium">
                        $
                        {transaction.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-secondary">
                        Processing Fee (0.1%)
                      </p>
                      <p className="text-base font-medium text-red-500">
                        -${(transaction.amount * 0.001).toFixed(2)}
                      </p>
                    </div>
                    <div className="border-gray-200 flex items-center justify-between border-t border-dashed pt-4">
                      <p className="text-header text-base font-bold">
                        Net Top-Up Amount
                      </p>
                      <p className="text-header text-2xl font-extrabold">
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
                {/* Reject Reason input would appear if rejected is clicked in a real app, simplified here */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => alert('Rejection logic here')}
                    className="border-gray-300 flex h-12 items-center justify-center rounded-lg border bg-white font-bold text-secondary shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => alert('Approval logic here')}
                    className="hover:bg-primary-hover flex h-12 items-center justify-center rounded-lg bg-primary font-bold text-white shadow-md shadow-orange-500/10 transition-all"
                  >
                    Approve Top-Up
                  </button>
                </div>
                <p className="text-center text-xs text-secondary/70">
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
