import {useNavigate} from '@tanstack/react-router';
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
} from 'react-icons/md';
import GenericButton from '../Forms/Buttons/GenericButton';

export const TransferDetails = () => {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectReason, setShowRejectReason] = useState(false);

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
    alert('Approval logic here');
  };

  const handleSubmitRejection = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    alert(`Rejecting transfer: ${rejectReason}`);
  };

  return (
    <div className="bg-gray-50 flex h-full flex-col">
      {/* Detail Header */}
      <div className="shrink-0 bg-white px-8 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({to: '/client/transfer-approvals'})}
            className="text-gray-600 text-xs font-bold uppercase tracking-wide transition-colors hover:text-primary"
          >
            Transfers
          </button>
          <MdChevronRight className="text-gray-600 text-[16px]" />
          <span className="text-gray-900 text-xs font-bold uppercase tracking-wide">
            Review #TRX-9942
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 text-3xl font-extrabold tracking-tight">
              Transfer Request #TRX-9942
            </h1>
            <div className="text-gray-600 flex items-center gap-3">
              <span className="text-sm font-medium">
                Submitted Oct 25, 2023 • 09:15 AM
              </span>
              <span className="bg-gray-300 h-1 w-1 rounded-full"></span>
              <span className="border-gray-200 bg-gray-50 text-gray-900 flex items-center gap-1.5 rounded border px-2 py-0.5 text-sm font-medium">
                <MdFingerprint className="text-[14px]" /> 99421500
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-orange-50 px-3 py-1.5 text-sm font-bold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Pending Review
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
                Supporting Documentation
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
                  title="Rotate"
                >
                  <MdRotateRight className="text-[20px]" />
                </button>
                <button
                  className="text-gray-600 hover:bg-gray-50 rounded p-1.5 transition-colors hover:text-primary"
                  title="Expand"
                >
                  <MdOpenInFull className="text-[20px]" />
                </button>
              </div>
            </div>

            <div className="border-gray-200 group relative min-h-[500px] flex-1 overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="bg-gray-50 absolute inset-0 flex items-center justify-center p-8">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNApYq5n4bf0iRNxLu2oRYrlHQzhkT7tPHBSEJOICKf8wd5LnFEasCtrwwdUxrYlii6kRkUOrF0qhJoPviSsaWyT636Cf5z5vMIolJBw4fLpWsu6uZB3KdGCz0gyHVdNseOqyuyP8tHHQDj4kUqf04jfbNa2nhbZaTDdSLiLSwco3mrsLvmZkZHrMU0vsf9dyL6OY2BiG67IXBEmCG7hMHudqeLx4vKDvN6QGnT8V98Lg2RE7t3rILCo8qqFgz21oCuDjn66WHrfEl"
                  alt="Receipt"
                  className="h-full w-full object-contain p-8 opacity-90 transition-transform duration-300 group-hover:scale-105"
                  style={{transform: `scale(${zoomLevel})`}}
                />
              </div>
              <div className="bg-gray-900/80 pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md">
                <MdPanTool className="text-[14px]" />
                Click and drag to inspect
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
                  Transaction Data
                </h3>
                <span className="inline-flex items-center gap-1 rounded border border-green-200 bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                  <MdCheckCircle className="text-[14px]" />
                  System Match
                </span>
              </div>
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      Sender
                    </p>
                    <p className="text-gray-900 text-base font-bold">
                      Sarah Jenkins
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      Recipient
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 text-base font-bold">
                        Michael Ross
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      Destination Bank
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
                        B
                      </div>
                      <p className="text-gray-900 text-base font-medium">
                        Barclays UK
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                      SWIFT / IBAN
                    </p>
                    <p className="font-mono border-gray-200 bg-gray-50 text-gray-900 w-fit break-all rounded border px-2 py-1 text-sm font-medium">
                      BARCGB22
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm font-medium">
                      Gross Amount
                    </p>
                    <p className="text-gray-900 text-base font-medium">
                      $12,500.00
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm font-medium">
                      Processing Fee (0.2%)
                    </p>
                    <p className="text-base font-medium text-red-600">
                      -$25.00
                    </p>
                  </div>
                  <div className="border-gray-200 flex items-center justify-between border-t border-dashed pt-3">
                    <p className="text-gray-900 text-base font-bold">
                      Net Transfer
                    </p>
                    <p className="text-gray-900 text-2xl font-extrabold">
                      $12,475.00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
              <div
                className="border-gray-200 size-12 rounded-full border bg-white bg-cover bg-center shadow-sm"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOlNvSZOqIRrbtFdJYsjwqAuNjIxXGEb6AmAm8Zt0BPQu-2NpqeO_LTyJT4waJFiewy6orVtuXwctoOO3uacE2nJwWfC38uxxYqY_ZuTjBsu1nxZDSnqvjD49fHsz2h-BNzoRnFu0bmbkf2LAeqdFImI-6P3kTCB42FUxGv-x8_SoMwcUnrRzr6d5r1qMJmsyN3twRGnn0qVgfoXa6Ay2LbpvjxPJguS5l4osLL8os9umrTs-53x6bJWzSulm0oC__XsQBvTEaEJoE")',
                }}
              ></div>
              <div className="flex-1">
                <h4 className="text-gray-900 text-sm font-bold">
                  Michael Ross
                </h4>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-gray-600 text-xs font-medium">
                    External • Added Oct 2023
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                  <span className="text-xs font-bold">KYC Verified</span>
                </div>
              </div>
            </div>

            {/* Actions */}
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
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <GenericButton
                      onClick={() => setShowRejectReason(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 border bg-white px-4 py-2"
                    >
                      Cancel
                    </GenericButton>
                    <GenericButton
                      onClick={handleSubmitRejection}
                      className="bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Submit Rejection
                    </GenericButton>
                  </div>
                </div>
              )}

              {!showRejectReason && (
                <div className="grid grid-cols-2 gap-4">
                  <GenericButton
                    onClick={handleReject}
                    className="border-gray-300 text-gray-700 flex h-12 items-center justify-center border bg-white font-bold hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    Reject Request
                  </GenericButton>
                  <GenericButton
                    onClick={handleApprove}
                    className="flex h-12 items-center justify-center gap-2 bg-primary font-bold text-white shadow-md shadow-orange-500/10 hover:bg-orange-700"
                  >
                    <MdCheck className="text-[20px]" />
                    Approve Transfer
                  </GenericButton>
                </div>
              )}

              <p className="text-gray-600 px-4 text-center text-xs leading-relaxed">
                By approving, funds will be released to the recipient bank
                immediately. This action is logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
