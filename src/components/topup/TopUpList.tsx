import React, {useState} from 'react';
import {
  DollarSign,
  Bell,
  Hourglass,
  CheckCircle2,
  XCircle,
  Calendar,
  Search,
  Briefcase,
  ShieldCheck,
  BadgeCheck,
  FileText,
  TrendingUp,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import {SummaryStats, TransactionTopup} from '@/types/transactionhistory';

interface TopUpListProps {
  transactions: TransactionTopup[];
  stats: SummaryStats;
  onSelectTransaction: (transaction: TransactionTopup) => void;
}

export const TopUpList: React.FC<TopUpListProps> = ({
  transactions,
  stats,
  onSelectTransaction,
}) => {
  const [filter, setFilter] = useState<
    'All' | 'Pending' | 'Approved' | 'Rejected'
  >('All');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'Approved':
        return 'bg-green-500';
      case 'Rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'E Private':
        return (
          <div className="flex size-8 items-center justify-center rounded bg-orange-50 text-primary">
            <BadgeCheck size={18} />
          </div>
        );
      case 'Temporarily':
        return (
          <div className="flex size-8 items-center justify-center rounded bg-purple-50 text-purple-600">
            <Briefcase size={18} />
          </div>
        );
      case 'Standard':
        return (
          <div className="flex size-8 items-center justify-center rounded bg-green-50 text-green-600">
            <ShieldCheck size={18} />
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 text-gray-600 flex size-8 items-center justify-center rounded">
            <Briefcase size={18} />
          </div>
        );
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#F9FAFB]">
      {/* Header */}
      <header className="border-gray-200 shrink-0 border-b bg-white px-8 py-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-header text-2xl font-bold leading-tight tracking-tight">
            Top-Up Approvals
          </h1>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span>Dashboard</span>
            <ChevronRight size={16} />
            <span>Finance</span>
            <ChevronRight size={16} />
            <span className="font-medium text-primary">Top-Ups</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {/* Total Pending */}
            <div className="border-gray-100 col-span-1 flex flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-secondary">
                  Total Pending Amount
                </p>
                <div className="flex size-8 items-center justify-center rounded-full bg-orange-50 text-primary">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-header text-3xl font-bold leading-none">
                  $
                  {stats.totalPendingAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="flex items-center rounded bg-green-50 px-1.5 py-0.5 text-xs font-bold text-[#078838]">
                  <TrendingUp size={14} className="mr-0.5" />
                  {stats.totalPendingGrowth}%
                </div>
              </div>
            </div>

            {/* Requests Today */}
            <div className="border-gray-100 flex flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-secondary">
                  Requests Today
                </p>
                <div className="flex size-8 items-center justify-center rounded-full bg-orange-50 text-primary">
                  <Bell size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-header text-2xl font-bold leading-none">
                  {stats.requestsToday}
                </p>
              </div>
            </div>

            {/* Pending */}
            <div className="border-gray-100 flex flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-secondary">Pending</p>
                <div className="flex size-8 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
                  <Hourglass size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-header text-2xl font-bold leading-none">
                  {stats.pendingCount}
                </p>
              </div>
            </div>

            {/* Approved */}
            <div className="border-gray-100 flex flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-secondary">Approved</p>
                <div className="flex size-8 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-header text-2xl font-bold leading-none">
                  {stats.approvedCount}
                </p>
              </div>
            </div>

            {/* Rejected (Hidden on smaller screens typically, but keeping for design match) */}
            <div className="border-gray-100 hidden flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm lg:flex">
              {/* Note: The image shows 5 cards in a row on large screens, filtering rejected is implied but design shows it */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-secondary">Rejected</p>
                <div className="flex size-8 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <XCircle size={20} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-header text-2xl font-bold leading-none">
                  {stats.rejectedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="bg-gray-100 inline-flex rounded-lg p-1">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-md px-4 py-1.5 text-sm font-semibold shadow-sm transition-all ${
                      filter === f
                        ? 'text-header bg-white shadow-sm'
                        : 'hover:text-header bg-transparent text-secondary shadow-none'
                    }`}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              <div className="border-gray-200 flex h-10 items-center rounded-lg border bg-white px-3 shadow-sm">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Start Date"
                  className="text-header placeholder:text-gray-400 w-24 border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
                />
                <span className="text-gray-400 mx-2">-</span>
                <input
                  type="text"
                  placeholder="End Date"
                  className="text-header placeholder:text-gray-400 w-24 border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
                />
              </div>
              <div className="relative h-10 min-w-[240px] flex-1 lg:flex-none">
                <Search
                  size={18}
                  className="text-gray-400 absolute left-3 top-2.5"
                />
                <input
                  type="text"
                  placeholder="Search Transaction ID..."
                  className="border-gray-200 text-header placeholder:text-gray-400 h-full w-full rounded-lg border bg-white pl-10 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border-gray-200 overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="border-gray-200 border-b bg-[#f8fafc]">
                  <tr>
                    {[
                      'Transaction',
                      'Client',
                      'Account Type',
                      'Amount',
                      'Date & Time',
                      'Status',
                      'Actions',
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-secondary ${i === 6 ? 'text-right' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-gray-200 divide-y">
                  {filteredTransactions.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => onSelectTransaction(t)}
                      className="hover:bg-gray-50 group cursor-pointer transition-colors"
                    >
                      <td className="text-header px-6 py-4 text-sm font-medium">
                        {t.transactionId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-header text-sm font-semibold">
                            {t.clientName}
                          </span>
                          <span className="text-xs text-secondary">
                            ID: {t.clientId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getAccountIcon(t.accountType)}
                          <span className="text-header text-sm">
                            {t.accountType} Account
                          </span>
                        </div>
                      </td>
                      <td className="text-header px-6 py-4 text-sm font-bold">
                        $
                        {t.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        {t.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(t.status)}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${getStatusDot(t.status)}`}
                          ></span>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="border-gray-200 text-gray-500 flex size-9 items-center justify-center rounded-lg border transition-colors hover:border-primary/50 hover:bg-white hover:text-primary"
                            title="View Receipt"
                            onClick={() => onSelectTransaction(t)}
                          >
                            <FileText size={18} />
                          </button>
                          {t.status === 'Rejected' && (
                            <button className="ml-2 text-xs font-medium text-primary hover:underline">
                              View Reason
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="border-gray-200 bg-gray-50 flex items-center justify-between border-t px-6 py-4">
              <p className="text-xs text-secondary">
                Showing <span className="text-header font-medium">1</span> to{' '}
                <span className="text-header font-medium">
                  {filteredTransactions.length}
                </span>{' '}
                of <span className="text-header font-medium">128</span> results
              </p>
              <div className="flex gap-2">
                <button className="border-gray-200 hover:bg-gray-50 rounded border bg-white px-3 py-1.5 text-xs font-medium text-secondary disabled:opacity-50">
                  Previous
                </button>
                <button className="border-gray-200 hover:bg-gray-50 rounded border bg-white px-3 py-1.5 text-xs font-medium text-secondary">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
