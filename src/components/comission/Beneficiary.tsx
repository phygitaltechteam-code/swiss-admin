import {useGetBeneficiary} from '@/lib/react-query/Beneficiary';
import React, {useState, useMemo, useEffect} from 'react';
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
} from 'react-icons/md';
import {getRequestStatus} from '../approval/methods';
import {useNavigate} from '@tanstack/react-router';
import {Beneficiary} from './../../types/transactionhistory';

// --- Types (you can move to a shared file) ---
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

const ITEMS_PER_PAGE = 10;

const BeneficiaryContent: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    new Set(['c1']),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const {data: beneficiaries} = useGetBeneficiary();
  const [beneficiaryStatus, setBeneficiaryStatus] = useState<
    'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'
  >('ALL');

  const navigate = useNavigate();

  // --- Dynamic counts for summary cards ---
  const pendingCount = useMemo(() => {
    if (!beneficiaries) return 0;
    return beneficiaries.reduce((total, client) => {
      return (
        total +
        (client.foreignBeneficiaries?.filter(
          (b) => !b.isVerified && !b.isRejected,
        ).length || 0)
      );
    }, 0);
  }, [beneficiaries]);

  const approvedCount = useMemo(() => {
    if (!beneficiaries) return 0;
    return beneficiaries.reduce((total, client) => {
      return (
        total +
        (client.foreignBeneficiaries?.filter(
          (b) => b.isVerified && !b.isRejected,
        ).length || 0)
      );
    }, 0);
  }, [beneficiaries]);

  const rejectedCount = useMemo(() => {
    if (!beneficiaries) return 0;
    return beneficiaries.reduce((total, client) => {
      return (
        total +
        (client.foreignBeneficiaries?.filter((b) => b.isRejected).length || 0)
      );
    }, 0);
  }, [beneficiaries]);

  // Filtering and pagination (unchanged)
  const filteredBeneficiaries = useMemo(() => {
    if (!beneficiaries) return [];

    return beneficiaries.filter((client) => {
      const matchesSearch =
        searchQuery === '' ||
        (client?.user?.fullname?.toLowerCase() || '').includes(
          searchQuery.toLowerCase(),
        ) ||
        (client.accountNumber?.toLowerCase() || '').includes(
          searchQuery.toLowerCase(),
        );

      const matchesFromDate = fromDate === '' || true;
      const matchesToDate = toDate === '' || true;

      return matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [beneficiaries, searchQuery, fromDate, toDate]);

  const totalPages = Math.ceil(filteredBeneficiaries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBeneficiaries = filteredBeneficiaries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, fromDate, toDate]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white/50 p-4 dark:bg-[#221710] md:p-8">
      {/* Page Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F1535] dark:text-white sm:text-3xl">
            Beneficiary Management
          </h1>
        </div>
      </div>
      <div className="mx-auto mt-4">
        {/* Search and Filter Section (unchanged) */}
        <div className="mb-6 flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
          <div className="relative w-full md:w-96">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdSearch className="text-[20px] text-neutral-500" />
            </span>
            <input
              className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F1535] shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-[#3a2a20] dark:bg-[#2c2019] dark:text-white"
              placeholder="Search by client name..."
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
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
                value={fromDate}
                onChange={handleFromDateChange}
              />
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto">
              <label className="hidden whitespace-nowrap text-sm text-neutral-500 sm:block">
                To:
              </label>
              <input
                className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-[#0F1535] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-[#3a2a20] dark:bg-[#2c2019] dark:text-white"
                type="date"
                value={toDate}
                onChange={handleToDateChange}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards - Dynamic & Responsive */}
        <div className="mb-8 w-full overflow-x-auto pb-2 md:overflow-visible md:pb-0">
          <div className="flex min-w-max gap-6 md:grid md:min-w-0 md:grid-cols-3 md:gap-6">
            {/* Pending Requests */}
            <div className="flex w-[280px] flex-shrink-0 flex-col justify-between rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019] md:w-auto">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">
                    Pending Requests
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-[#0F1535] dark:text-white">
                    {pendingCount}
                  </h3>
                </div>
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                  <MdSchedule className="text-[20px] text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-neutral-500">
                <MdSchedule className="mr-1 text-base" />
                <span>Requires review</span>
              </div>
            </div>

            {/* Approved Requests */}
            <div className="flex w-[280px] flex-shrink-0 flex-col justify-between rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019] md:w-auto">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">
                    Approved Requests
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-[#0F1535] dark:text-white">
                    {approvedCount}
                  </h3>
                </div>
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                  <MdCheckCircle className="text-[20px] text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                <MdArrowUpward className="mr-1 text-base" />
                <span>12% increase this week</span>
              </div>
            </div>

            {/* Rejected Requests */}
            <div className="flex w-[280px] flex-shrink-0 flex-col justify-between rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019] md:w-auto">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">
                    Rejected Requests
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-[#0F1535] dark:text-white">
                    {rejectedCount}
                  </h3>
                </div>
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                  <MdBlock className="text-[20px] text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client List Table (unchanged) */}
        <div className="overflow-hidden rounded-xl border border-[#f4ece7] bg-white shadow-sm dark:border-[#3a2a20] dark:bg-[#2c2019]">
          <div className="flex items-center justify-between border-b border-[#f4ece7] px-6 py-4 dark:border-[#3a2a20]">
            <h2 className="text-lg font-semibold text-[#0F1535] dark:text-white">
              Client List
            </h2>
            {/* <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-md border border-[#f4ece7] px-3 py-1.5 text-sm text-[#0F1535] transition-colors hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:text-white dark:hover:bg-[#3a2a20]">
                <MdFilterList className="text-base" />
                Filter
              </button>
              <button className="flex items-center gap-2 rounded-md border border-[#f4ece7] px-3 py-1.5 text-sm text-[#0F1535] transition-colors hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:text-white dark:hover:bg-[#3a2a20]">
                <MdFileDownload className="text-base" />
                Export
              </button>
            </div> */}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stroke bg-white text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-[#3a2a20] dark:bg-[#3a2a20]/50">
                  <th className="w-12 px-6 py-4"></th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Account Number</th>
                  <th className="px-6 py-4">Total Beneficiaries</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Pending Count</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-[#3a2a20]">
                {paginatedBeneficiaries?.map((client) => {
                  const isExpanded = expandedRows.has(client.id);
                  const rotationClass = isExpanded
                    ? ''
                    : 'transform -rotate-90';
                  const status = getRequestStatus(client);
                  return (
                    <React.Fragment key={client.id}>
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
                          {client?.user?.fullname}
                        </td>
                        <td className="font-mono px-6 py-4 text-sm text-neutral-500">
                          {client.accountNumber}
                        </td>
                        <td className="px-6 py-4 text-[#0F1535] dark:text-white">
                          {client?.foreignBeneficiaries?.length}
                        </td>
                        <td className="px-6 py-4">
                          {status === 'APPROVED' && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
                              Approved
                            </span>
                          )}
                          {status === 'PENDING' && (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                              Pending
                            </span>
                          )}
                          {status === 'REJECTED' && (
                            <div className="flex flex-col items-start">
                              <span className="mb-1 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                Rejected
                              </span>
                              <span className="mt-1 flex items-center text-xs font-medium text-red-600 dark:text-red-400">
                                <MdReport className="mr-1 text-[14px]" />
                                {client?.rejectedReason}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#0F1535] dark:text-white">
                          {client.foreignBeneficiaries?.filter(
                            (b) => !b.isVerified && !b.isRejected,
                          ).length || 0}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#d96d2b]"
                            onClick={() =>
                              navigate({
                                to: `/client/beneficiaryverification/${client?.id}`,
                              })
                            }
                          >
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
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f4ece7] dark:divide-[#3a2a20]">
                                  {client?.foreignBeneficiaries?.length > 0 ? (
                                    client.foreignBeneficiaries.map(
                                      (beneficiary) => {
                                        // Determine status badge
                                        let statusBadge;
                                        if (beneficiary.isRejected) {
                                          statusBadge = (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                              Rejected
                                            </span>
                                          );
                                        } else if (beneficiary.isVerified) {
                                          statusBadge = (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
                                              Approved
                                            </span>
                                          );
                                        } else {
                                          statusBadge = (
                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                                              Pending
                                            </span>
                                          );
                                        }
                                        return (
                                          <tr key={beneficiary.id}>
                                            <td className="px-4 py-3 font-medium text-[#0F1535] dark:text-white">
                                              {beneficiary.fullName}
                                            </td>
                                            <td className="font-mono px-4 py-3 text-xs text-[#0F1535] dark:text-white">
                                              {beneficiary.accountNumber}
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
                                              <div className="flex items-center gap-2">
                                                {/* <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                  {beneficiary.currency}
                                                </span> */}
                                                {statusBadge}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      },
                                    )
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

          {/* Pagination (unchanged) */}
          <div className="flex items-center justify-between border-t border-stroke px-6 py-4 dark:border-[#3a2a20]">
            <div className="text-sm text-neutral-500">
              Showing{' '}
              <span className="font-medium text-[#0F1535] dark:text-white">
                {filteredBeneficiaries.length > 0 ? startIndex + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-medium text-[#0F1535] dark:text-white">
                {Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  filteredBeneficiaries.length,
                )}
              </span>{' '}
              of{' '}
              <span className="font-medium text-[#0F1535] dark:text-white">
                {filteredBeneficiaries.length}
              </span>{' '}
              clients
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="rounded-md border border-stroke px-3 py-1 text-sm text-neutral-500 hover:bg-[#f8f7f5] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3a2a20] dark:hover:bg-[#3a2a20]"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({length: Math.min(3, totalPages)}, (_, i) => {
                let pageNumber;
                if (totalPages <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage === 1) {
                  pageNumber = i + 1;
                } else if (currentPage === totalPages) {
                  pageNumber = totalPages - 2 + i;
                } else {
                  pageNumber = currentPage - 1 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    className={`rounded-md px-3 py-1 text-sm ${
                      currentPage === pageNumber
                        ? 'bg-primary text-white shadow-sm hover:bg-[#d96d2b]'
                        : 'border border-stroke text-neutral-500 hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:hover:bg-[#3a2a20]'
                    }`}
                    onClick={() => handlePageClick(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {totalPages > 3 && currentPage < totalPages - 1 && (
                <>
                  <span className="text-neutral-500">...</span>
                  <button
                    className={`rounded-md border border-stroke px-3 py-1 text-sm text-neutral-500 hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:hover:bg-[#3a2a20] ${
                      currentPage === totalPages ? 'bg-primary text-white' : ''
                    }`}
                    onClick={() => handlePageClick(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                className="rounded-md border border-stroke px-3 py-1 text-sm text-neutral-500 hover:bg-[#f8f7f5] dark:border-[#3a2a20] dark:hover:bg-[#3a2a20]"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
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
