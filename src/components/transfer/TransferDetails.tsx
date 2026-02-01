import {useNavigate} from '@tanstack/react-router';
import React from 'react';
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

export const TransferDetails = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col">
      {/* Detail Header */}
      <div className="shrink-0 border-b border-[#f4ece7] bg-white px-8 py-6 dark:border-[#3a2a20] dark:bg-[#1a120b]">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({to: '/client/transfer-approvals'})}
            className="text-xs font-bold uppercase tracking-wide text-[#9c6949] transition-colors hover:text-primary"
          >
            Transfers
          </button>
          <MdChevronRight className="text-[16px] text-[#9c6949]" />
          <span className="text-xs font-bold uppercase tracking-wide text-[#0F1535] dark:text-white">
            Review #TRX-9942
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F1535] dark:text-white">
              Transfer Request #TRX-9942
            </h1>
            <div className="flex items-center gap-3 text-[#9c6949]">
              <span className="text-sm font-medium">
                Submitted Oct 25, 2023 • 09:15 AM
              </span>
              <span className="h-1 w-1 rounded-full bg-[#f4ece7] dark:bg-[#3a2a20]"></span>
              <span className="flex items-center gap-1.5 rounded border border-[#f4ece7] bg-[#f8f7f5] px-2 py-0.5 text-sm font-medium text-[#0F1535] dark:border-[#3a2a20]/50 dark:bg-[#2c2019] dark:text-white">
                <MdFingerprint className="text-[14px]" /> 99421500
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-white px-3 py-1.5 text-sm font-bold text-primary shadow-sm dark:bg-[#2c2019]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Pending Review
            </span>
            <button className="rounded-lg border border-[#f4ece7] bg-white p-2.5 text-[#9c6949] shadow-sm transition-all hover:border-primary hover:text-primary dark:border-[#3a2a20] dark:bg-[#2c2019]">
              <MdMoreHoriz className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto bg-[#f8f7f5] p-6 dark:bg-[#221710]">
        <div className="mx-auto grid h-full min-h-[600px] max-w-[1600px] grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Left Column: Documentation */}
          <div className="flex flex-col gap-4 xl:col-span-7">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#0F1535] dark:text-white">
                <MdDescription className="text-[#9c6949]" />
                Supporting Documentation
              </h3>
              <div className="flex gap-1 rounded-lg border border-[#f4ece7] bg-white p-1 shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]">
                <button
                  className="rounded p-1.5 text-[#9c6949] transition-colors hover:bg-[#f8f7f5] hover:text-[#0F1535] dark:hover:bg-[#3a2a20] dark:hover:text-white"
                  title="Zoom Out"
                >
                  <MdRemove className="text-[20px]" />
                </button>
                <button
                  className="rounded p-1.5 text-[#9c6949] transition-colors hover:bg-[#f8f7f5] hover:text-[#0F1535] dark:hover:bg-[#3a2a20] dark:hover:text-white"
                  title="Zoom In"
                >
                  <MdAdd className="text-[20px]" />
                </button>
                <div className="my-1 w-[1px] bg-[#f4ece7] dark:bg-[#3a2a20]"></div>
                <button
                  className="rounded p-1.5 text-[#9c6949] transition-colors hover:bg-[#f8f7f5] hover:text-[#0F1535] dark:hover:bg-[#3a2a20] dark:hover:text-white"
                  title="Rotate"
                >
                  <MdRotateRight className="text-[20px]" />
                </button>
                <button
                  className="rounded p-1.5 text-[#9c6949] transition-colors hover:bg-[#f8f7f5] hover:text-[#0F1535] dark:hover:bg-[#3a2a20] dark:hover:text-white"
                  title="Expand"
                >
                  <MdOpenInFull className="text-[20px]" />
                </button>
              </div>
            </div>

            <div className="group relative min-h-[500px] flex-1 overflow-hidden rounded-xl border border-[#f4ece7] bg-white shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]">
              <div className="pattern-grid absolute inset-0 flex items-center justify-center bg-[#f8f7f5] dark:bg-[#221710]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNApYq5n4bf0iRNxLu2oRYrlHQzhkT7tPHBSEJOICKf8wd5LnFEasCtrwwdUxrYlii6kRkUOrF0qhJoPviSsaWyT636Cf5z5vMIolJBw4fLpWsu6uZB3KdGCz0gyHVdNseOqyuyP8tHHQDj4kUqf04jfbNa2nhbZaTDdSLiLSwco3mrsLvmZkZHrMU0vsf9dyL6OY2BiG67IXBEmCG7hMHudqeLx4vKDvN6QGnT8V98Lg2RE7t3rILCo8qqFgz21oCuDjn66WHrfEl"
                  alt="Receipt"
                  className="h-full w-full object-contain p-8 opacity-90 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0F1535]/80 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md dark:bg-black/80">
                <MdPanTool className="text-[14px]" />
                Click and drag to inspect
              </div>
            </div>
          </div>

          {/* Right Column: Data & Actions */}
          <div className="flex flex-col gap-6 xl:col-span-5">
            {/* Transaction Info Card */}
            <div className="overflow-hidden rounded-xl border border-[#f4ece7] bg-white shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]">
              <div className="flex items-center justify-between border-b border-[#f4ece7] bg-white px-6 py-4 dark:border-[#3a2a20] dark:bg-[#2c2019]">
                <h3 className="flex items-center gap-2 font-bold text-[#0F1535] dark:text-white">
                  <MdReceiptLong className="text-[20px] text-primary" />
                  Transaction Data
                </h3>
                <span className="inline-flex items-center gap-1 rounded border border-green-200 bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:border-green-700/30 dark:bg-green-900/30 dark:text-green-300">
                  <MdCheckCircle className="text-[14px]" />
                  System Match
                </span>
              </div>
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#9c6949]">
                      Sender
                    </p>
                    <p className="text-base font-bold text-[#0F1535] dark:text-white">
                      Sarah Jenkins
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#9c6949]">
                      Recipient
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-[#0F1535] dark:text-white">
                        Michael Ross
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#9c6949]">
                      Destination Bank
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
                        B
                      </div>
                      <p className="text-base font-medium text-[#0F1535] dark:text-white">
                        Barclays UK
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#9c6949]">
                      SWIFT / IBAN
                    </p>
                    <p className="font-mono w-fit break-all rounded border border-[#f4ece7] bg-[#f8f7f5] px-2 py-1 text-sm font-medium text-[#0F1535] dark:border-[#3a2a20]/50 dark:bg-[#221710] dark:text-white">
                      BARCGB22
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-[#f4ece7] pt-5 dark:border-[#3a2a20]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#9c6949]">
                      Gross Amount
                    </p>
                    <p className="text-base font-medium text-[#0F1535] dark:text-white">
                      $12,500.00
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#9c6949]">
                      Processing Fee (0.2%)
                    </p>
                    <p className="text-base font-medium text-red-600 dark:text-red-400">
                      -$25.00
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed border-[#f4ece7] pt-3 dark:border-[#3a2a20]">
                    <p className="text-base font-bold text-[#0F1535] dark:text-white">
                      Net Transfer
                    </p>
                    <p className="text-2xl font-extrabold text-[#0F1535] dark:text-white">
                      $12,475.00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="flex items-center gap-4 rounded-xl border border-[#f4ece7] bg-white p-4 shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]">
              <div
                className="size-12 rounded-full border border-[#f4ece7] bg-white bg-cover bg-center shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOlNvSZOqIRrbtFdJYsjwqAuNjIxXGEb6AmAm8Zt0BPQu-2NpqeO_LTyJT4waJFiewy6orVtuXwctoOO3uacE2nJwWfC38uxxYqY_ZuTjBsu1nxZDSnqvjD49fHsz2h-BNzoRnFu0bmbkf2LAeqdFImI-6P3kTCB42FUxGv-x8_SoMwcUnrRzr6d5r1qMJmsyN3twRGnn0qVgfoXa6Ay2LbpvjxPJguS5l4osLL8os9umrTs-53x6bJWzSulm0oC__XsQBvTEaEJoE")',
                }}
              ></div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#0F1535] dark:text-white">
                  Michael Ross
                </h4>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs font-medium text-[#9c6949]">
                    External • Added Oct 2023
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-green-700 dark:border-green-700/30 dark:bg-green-900/30 dark:text-green-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                  <span className="text-xs font-bold">KYC Verified</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex flex-col gap-4 pt-4">
              {/* Hidden checkbox hack for simple toggle interaction demo */}
              <div className="group/reject">
                <div className="animate-in fade-in zoom-in-95 mb-4 hidden rounded-xl border border-red-100 bg-red-50 p-4 duration-200 peer-checked:block dark:border-red-800/30 dark:bg-red-900/20">
                  <label className="mb-2 block text-sm font-bold text-red-900 dark:text-red-300">
                    Rejection Reason <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    className="h-24 w-full resize-none rounded-lg border border-red-200 bg-white p-3 text-sm text-[#0F1535] outline-none transition-all placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-800/50 dark:bg-[#221710] dark:text-white dark:placeholder:text-red-700"
                    placeholder="Please specify why this transfer is being rejected..."
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex h-12 items-center justify-center rounded-lg border border-[#f4ece7] bg-white font-bold text-[#9c6949] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-[#3a2a20] dark:bg-[#2c2019] dark:hover:border-red-800/30 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                  Reject Request
                </button>
                <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-bold text-white shadow-md shadow-orange-500/10 transition-all hover:bg-[#d96d2b] active:scale-[0.98]">
                  <MdCheck className="text-[20px]" />
                  Approve Transfer
                </button>
              </div>
              <p className="px-4 text-center text-xs leading-relaxed text-[#9c6949]">
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
