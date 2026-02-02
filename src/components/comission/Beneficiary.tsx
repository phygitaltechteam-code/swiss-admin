import {ArrowUp} from 'lucide-react';
import React, {useState} from 'react';
import {
  MdSearch,
  MdFilterList,
  MdFileDownload,
  MdExpandMore,
  MdSchedule,
  MdCheckCircle,
  MdBlock,
  MdArrowUpward,
  MdReport,
  MdGavel,
} from 'react-icons/md';

// --- Mock Data ---
export interface Beneficiary {
  id: string;
  name: string;
  accountNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  currency: string;
}

export type ClientStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Client {
  id: string;
  name: string;
  accountNumber: string;
  transactionValue: number;
  totalBeneficiaries: number;
  status: ClientStatus;
  statusDetails?: {
    reason: string;
    icon?: 'alert' | 'gavel';
  };
  beneficiaries: Beneficiary[];
}
const MOCK_BENEFICIARIES = [
  {
    id: 'b1',
    name: 'John Reese',
    accountNo: '987654123',
    address: '123 Po. Box',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    currency: 'USD',
  },
  {
    id: 'b2',
    name: 'Harold Finch',
    accountNo: '876543210',
    address: 'Library Ave, Apt 4B',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    currency: 'USD',
  },
  {
    id: 'b3',
    name: 'Sameen Shaw',
    accountNo: '102938475',
    address: '404 Unknown Ln.',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    currency: 'USD',
  },
];

const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Sarah J. Connor',
    accountNumber: '**** 8829',
    transactionValue: 45200.0,
    totalBeneficiaries: 3,
    status: 'Approved',
    beneficiaries: MOCK_BENEFICIARIES,
  },
  {
    id: 'c2',
    name: 'Kyle Reese',
    accountNumber: '**** 1984',
    transactionValue: 12050.0,
    totalBeneficiaries: 1,
    status: 'Pending',
    beneficiaries: [MOCK_BENEFICIARIES[0]],
  },
  {
    id: 'c3',
    name: 'James Cameron',
    accountNumber: '**** 4421',
    transactionValue: 8900.0,
    totalBeneficiaries: 5,
    status: 'Rejected',
    statusDetails: {
      reason: 'High Risk Score',
      icon: 'alert',
    },
    beneficiaries: [],
  },
  {
    id: 'c4',
    name: 'Ellen Ripley',
    accountNumber: '**** 0023',
    transactionValue: 150000.0,
    totalBeneficiaries: 2,
    status: 'Rejected',
    statusDetails: {
      reason: 'Sanctions Match',
      icon: 'gavel',
    },
    beneficiaries: [MOCK_BENEFICIARIES[1], MOCK_BENEFICIARIES[2]],
  },
];

// --- Utility Components ---

const StatusBadge = ({status}: {status: ClientStatus}) => {
  const styles = {
    Approved: 'bg-green-100 text-green-800 border border-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    Rejected: 'bg-red-100 text-red-800 border border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
  subtext,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  colorClass: string;
  subtext?: string;
  trend?: string;
}) => (
  <div className="border-gray-200 flex h-full flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-transform hover:scale-[1.01]">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-gray-900 mt-2 text-3xl font-bold">{value}</h3>
      </div>
      <div className={`rounded-lg p-2 ${colorClass} bg-opacity-20`}>
        <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    {(subtext || trend) && (
      <div className="mt-4 flex items-center text-sm">
        {trend && (
          <span className="mr-2 flex items-center font-medium text-green-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            {trend}
          </span>
        )}
        {subtext && (
          <span className="text-gray-500 flex items-center">
            {/* If it's the pending card, we might want an icon here, but text is fine */}
            {subtext}
          </span>
        )}
      </div>
    )}
  </div>
);

const BeneficiaryContent: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    new Set(['c1']),
  );

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white/50 p-4 dark:bg-[#221710] md:p-8">
      <div className="mx-auto">
        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
          <div className="relative w-full md:w-96">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdSearch className="text-[20px] text-neutral-500" />
            </span>
            <input
              className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F1535] shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-[#3a2a20] dark:bg-[#2c2019] dark:text-white"
              placeholder="Search by client name..."
              type="text"
            />
          </div>

          <div className="flex w-full gap-4 md:w-auto">
            <div className="flex w-full items-center gap-2 md:w-auto">
              <label className="hidden whitespace-nowrap text-sm text-neutral-500 sm:block">
                From:
              </label>
              <input
                className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-[#0F1535] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-[#3a2a20] dark:bg-[#2c2019] dark:text-white"
                type="date"
              />
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto">
              <label className="hidden whitespace-nowrap text-sm text-neutral-500 sm:block">
                To:
              </label>
              <input
                className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-[#0F1535] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-[#3a2a20] dark:bg-[#2c2019] dark:text-white"
                type="date"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Pending Card */}
          <div className="flex flex-col justify-between rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Pending Requests
                </p>
                <h3 className="mt-2 text-3xl font-bold text-[#0F1535] dark:text-white">
                  24
                </h3>
              </div>
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                <MdSchedule className="text-[20px] text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-neutral-500">
              <MdSchedule className="mr-1 text-base" />
              <span>Requires review</span>
            </div>
          </div>

          {/* Approved Card */}
          <div className="flex flex-col justify-between rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Approved Requests
                </p>
                <h3 className="mt-2 text-3xl font-bold text-[#0F1535] dark:text-white">
                  142
                </h3>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <MdCheckCircle className="text-[20px] text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <MdArrowUpward className="mr-1 text-base" />
              <span>12% increase this week</span>
            </div>
          </div>

          {/* Rejected Card */}
          <div className="flex flex-col justify-between rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Rejected Requests
                </p>
                <h3 className="mt-2 text-3xl font-bold text-[#0F1535] dark:text-white">
                  18
                </h3>
              </div>
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                <MdBlock className="text-[20px] text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Client List Table */}
        <div className="overflow-hidden rounded-xl border border-[#f4ece7] bg-white shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]">
          {/* Table Header */}
          <div className="flex items-center justify-between border-b border-[#f4ece7] px-6 py-4 dark:border-[#3a2a20]">
            <h2 className="text-lg font-semibold text-[#0F1535] dark:text-white">
              Client List
            </h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-md border border-[#f4ece7] px-3 py-1.5 text-sm text-[#0F1535] transition-colors hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:text-white dark:hover:bg-[#3a2a20]">
                <MdFilterList className="text-base" />
                Filter
              </button>
              <button className="flex items-center gap-2 rounded-md border border-[#f4ece7] px-3 py-1.5 text-sm text-[#0F1535] transition-colors hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:text-white dark:hover:bg-[#3a2a20]">
                <MdFileDownload className="text-base" />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stroke bg-white text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-[#3a2a20] dark:bg-[#3a2a20]/50">
                  <th className="w-12 px-6 py-4"></th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Account Number</th>
                  <th className="px-6 py-4">Transaction Value</th>
                  <th className="px-6 py-4">Total Beneficiaries</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-[#3a2a20]">
                {MOCK_CLIENTS.map((client) => {
                  const isExpanded = expandedRows.has(client.id);
                  const rotationClass = isExpanded
                    ? ''
                    : 'transform -rotate-90';

                  return (
                    <React.Fragment key={client.id}>
                      {/* Main Row */}
                      <tr
                        className="group cursor-pointer transition-colors dark:hover:bg-[#3a2a20]/30"
                        onClick={() => toggleRow(client.id)}
                      >
                        <td className="px-6 py-4 text-center">
                          <button className="text-neutral-500 transition-colors focus:outline-none">
                            <MdExpandMore
                              className={`text-[20px] ${rotationClass}`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 font-medium text-[#0F1535] dark:text-white">
                          {client.name}
                        </td>
                        <td className="font-mono px-6 py-4 text-sm text-neutral-500">
                          {client.accountNumber}
                        </td>
                        <td className="font-mono px-6 py-4 text-sm text-[#0F1535] dark:text-white">
                          {formatCurrency(client.transactionValue)}
                        </td>
                        <td className="px-6 py-4 text-[#0F1535] dark:text-white">
                          {client.totalBeneficiaries}
                        </td>
                        <td className="px-6 py-4">
                          {client.status === 'Approved' && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
                              Approved
                            </span>
                          )}
                          {client.status === 'Pending' && (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                              Pending
                            </span>
                          )}
                          {client.status === 'Rejected' && (
                            <div className="flex flex-col items-start">
                              <span className="mb-1 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                Rejected
                              </span>
                              {client.statusDetails && (
                                <span className="mt-1 flex items-center text-xs font-medium text-red-600 dark:text-red-400">
                                  {client.statusDetails.icon === 'gavel' ? (
                                    <MdGavel className="mr-1 text-[14px]" />
                                  ) : (
                                    <MdReport className="mr-1 text-[14px]" />
                                  )}
                                  {client.statusDetails.reason}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#d96d2b]">
                            Review
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row Content */}
                      {isExpanded && (
                        <tr className="bg-white dark:bg-[#221710]">
                          <td className="px-6 py-4" colSpan={7}>
                            <div className="overflow-hidden rounded-lg border border-stroke bg-white dark:border-[#3a2a20] dark:bg-[#2c2019]">
                              <div className="flex items-center justify-between border-b border-stroke bg-[#f8f7f5] px-4 py-3 dark:border-[#3a2a20] dark:bg-[#3a2a20]">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                                  Beneficiaries List
                                </h4>
                              </div>
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-stroke bg-white text-xs text-neutral-500 dark:border-[#3a2a20] dark:bg-[#3a2a20]/50">
                                    <th className="px-4 py-3 font-medium">
                                      Name
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                      Account No.
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                      Address
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                      City
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                      State
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                      Country
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                      Currency
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f4ece7] dark:divide-[#3a2a20]">
                                  {client.beneficiaries.length > 0 ? (
                                    client.beneficiaries.map((beneficiary) => (
                                      <tr key={beneficiary.id}>
                                        <td className="px-4 py-3 font-medium text-[#0F1535] dark:text-white">
                                          {beneficiary.name}
                                        </td>
                                        <td className="font-mono px-4 py-3 text-xs text-[#0F1535] dark:text-white">
                                          {beneficiary.accountNo}
                                        </td>
                                        <td className="max-w-[150px] truncate px-4 py-3 text-neutral-500">
                                          {beneficiary.address}
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                          {beneficiary.city}
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                          {beneficiary.state}
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                          {beneficiary.country}
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                            {beneficiary.currency}
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-sm italic text-neutral-500"
                                      >
                                        No beneficiaries found for this client.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-stroke px-6 py-4 dark:border-[#3a2a20]">
            <div className="text-sm text-neutral-500">
              Showing{' '}
              <span className="font-medium text-[#0F1535] dark:text-white">
                1
              </span>{' '}
              to{' '}
              <span className="font-medium text-[#0F1535] dark:text-white">
                4
              </span>{' '}
              of{' '}
              <span className="font-medium text-[#0F1535] dark:text-white">
                24
              </span>{' '}
              clients
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="rounded-md border border-stroke px-3 py-1 text-sm text-neutral-500 hover:bg-[#f8f7f5] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3a2a20] dark:hover:bg-[#3a2a20]"
                disabled
              >
                Previous
              </button>
              <button className="rounded-md bg-primary px-3 py-1 text-sm text-white shadow-sm hover:bg-[#d96d2b]">
                1
              </button>
              <button className="rounded-md border border-stroke px-3 py-1 text-sm text-neutral-500 hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:hover:bg-[#3a2a20]">
                2
              </button>
              <button className="rounded-md border border-stroke px-3 py-1 text-sm text-neutral-500 hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:hover:bg-[#3a2a20]">
                3
              </button>
              <span className="text-neutral-500">...</span>
              <button className="rounded-md border border-stroke px-3 py-1 text-sm text-neutral-500 hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:hover:bg-[#3a2a20]">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryContent;
