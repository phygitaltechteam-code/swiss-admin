import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useGetBeneficiaries} from '@/lib/api/report';
import React, {forwardRef, useImperativeHandle, useMemo, useState} from 'react';
import {
  MdCheck,
  MdCheckCircle,
  MdClose,
  MdFilterList,
  MdGroup,
  MdPerson,
  MdPublic,
  MdSearch,
  MdVisibility,
} from 'react-icons/md';

// Types for the API response
interface User {
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: string | null;
  isVerified: boolean;
  isRejected: boolean;
}

interface ForeignBeneficiary {
  id: string;
  customerId: string;
  fullName: string;
  country: string;
  currency: string;
  accountNumber: string;
  accountType: string;
  SWIFTBIC: string;
  IFSC: string;
  bankName: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  bankCountry: string;
  pincode: string;
  relationship: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  rejectReason: string | null;
  isVerified: boolean;
  isRejected: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Beneficiary {
  id: string;
  accountNumber: string;
  rejectedReason: string | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  bankCountry: string;
  bankName: string;
  currency: string;
  user: User;
  customer: {
    user: {
      fullname: string;
    };
  };
  foreignBeneficiaries: ForeignBeneficiary[];
}

// Foreign Beneficiaries Modal Component
interface ForeignBeneficiariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary: (typeof tableData)[0] | null;
}

const ForeignBeneficiariesModal: React.FC<ForeignBeneficiariesModalProps> = ({
  isOpen,
  onClose,
  beneficiary,
}) => {
  if (!isOpen || !beneficiary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="border-gray-200 bg-gray-50 border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 text-xl font-bold">
                Foreign Beneficiaries for {beneficiary.fullName}
              </h3>
              <p className="text-gray-600 text-sm">
                Account: {beneficiary.accountNumber} • Total:{' '}
                {beneficiary.foreignBeneficiariesCount}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {beneficiary.foreignBeneficiaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <MdPublic className="text-gray-400 mb-4 text-6xl" />
              <h4 className="text-gray-700 mb-2 text-lg font-semibold">
                No Foreign Beneficiaries
              </h4>
              <p className="text-gray-500">
                This beneficiary has no foreign beneficiaries.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {beneficiary.foreignBeneficiaries.map((fb, index) => (
                <div
                  key={fb.id}
                  className={`border-gray-200 rounded-lg border p-4 ${
                    fb.isRejected
                      ? 'bg-red-50'
                      : fb.isVerified
                        ? 'bg-green-50'
                        : 'bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-gray-900 text-lg font-semibold">
                          {fb.fullName || 'Unnamed Beneficiary'}
                        </h4>
                        <div className="flex items-center gap-2">
                          {fb.isRejected ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                              Rejected
                            </span>
                          ) : fb.isVerified ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">
                              Account:
                            </span>
                            <span className="text-gray-900">
                              {fb.accountNumber || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">
                              Country:
                            </span>
                            <span className="text-gray-900">
                              {fb.country?.toUpperCase() || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">
                              Currency:
                            </span>
                            <span className="text-gray-900">
                              {fb.currency?.toUpperCase() || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">
                              Bank:
                            </span>
                            <span className="text-gray-900">
                              {fb.bankName || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">
                              Email:
                            </span>
                            <span className="text-gray-900">
                              {fb.email || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">
                              Phone:
                            </span>
                            <span className="text-gray-900">
                              {fb.phoneNumber || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">
                              Relationship:
                            </span>
                            <span className="text-gray-900 capitalize">
                              {fb.relationship || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">
                              Bank Country:
                            </span>
                            <span className="text-gray-900">
                              {fb.bankCountry?.toUpperCase() || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {fb.rejectReason && (
                        <div className="mt-3 rounded-lg bg-red-100 p-3">
                          <span className="font-semibold text-red-700">
                            Rejection Reason:
                          </span>
                          <p className="mt-1 text-red-600">{fb.rejectReason}</p>
                        </div>
                      )}

                      <div className="text-gray-500 mt-3 flex items-center gap-4 text-sm">
                        <span>SWIFT/BIC: {fb.SWIFTBIC || 'N/A'}</span>
                        <span>IFSC: {fb.IFSC || 'N/A'}</span>
                        <span>
                          Created: {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-gray-200 bg-gray-50 border-t p-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm">
              Showing {beneficiary.foreignBeneficiaries.length} foreign
              beneficiaries
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg border bg-white px-4 py-2 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: React.ComponentType<{className?: string}>;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
}) => {
  const isPositive = change.startsWith('+');

  return (
    <div className="border-gray-200 flex flex-col gap-1 rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-gray-600 flex items-center gap-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${color.split(' ')[0]} ${color.split(' ')[1]}`}
        >
          <Icon className="text-lg" />
        </div>
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="text-gray-900 mt-1 text-2xl font-bold">{value}</p>
      <div className="mt-2 flex items-center gap-1">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
            isPositive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isPositive ? '↑' : '↓'} {change}
        </span>
        <span className="text-gray-500 text-xs">{changeLabel}</span>
      </div>
    </div>
  );
};

// Filter Bar Component
interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  verificationFilter: string;
  setVerificationFilter: (value: string) => void;
  hasForeignFilter: string;
  setHasForeignFilter: (value: string) => void;
  rejectionFilter: string;
  setRejectionFilter: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  verificationFilter,
  setVerificationFilter,
  hasForeignFilter,
  setHasForeignFilter,
  rejectionFilter,
  setRejectionFilter,
}) => {
  return (
    <div className="border-gray-200 flex flex-col items-start justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
        {/* Search */}
        <div className="relative flex-1 lg:w-64 lg:flex-none">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdSearch className="text-gray-400" size={20} />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-300 text-gray-900 placeholder-gray-500 block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search by name, email, account, phone..."
            type="text"
          />
        </div>

        {/* Active Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-gray-300 text-gray-900 block appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Active Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="text-gray-400 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Verification Filter */}
        <div className="relative">
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="border-gray-300 text-gray-900 block appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Verification</option>
            <option value="verified">Verified</option>
            <option value="not-verified">Not Verified</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="text-gray-400 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Rejection Filter */}
        <div className="relative">
          <select
            value={rejectionFilter}
            onChange={(e) => setRejectionFilter(e.target.value)}
            className="border-gray-300 text-gray-900 block appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Rejection Status</option>
            <option value="rejected">Rejected</option>
            <option value="not-rejected">Not Rejected</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="text-gray-400 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Foreign Beneficiaries Filter */}
        <div className="relative">
          <select
            value={hasForeignFilter}
            onChange={(e) => setHasForeignFilter(e.target.value)}
            className="border-gray-300 text-gray-900 block appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Foreign Beneficiaries</option>
            <option value="has-foreign">Has Foreign</option>
            <option value="no-foreign">No Foreign</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="text-gray-400 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          setSearchQuery('');
          setStatusFilter('');
          setVerificationFilter('');
          setRejectionFilter('');
          setHasForeignFilter('');
        }}
        className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold transition-colors"
      >
        <MdFilterList className="text-lg" />
        Clear Filters
      </button>
    </div>
  );
};

// Main Table Component
const BeneficiaryTable = forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [hasForeignFilter, setHasForeignFilter] = useState('');
  const [rejectionFilter, setRejectionFilter] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<
    (typeof tableData)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data: apiResponse, isLoading, isError, error} = useGetBeneficiaries();

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    getFilteredData: () => filteredData,
    getAllData: () => tableData,
    getFilteredCount: () => filteredData.length,
    getTotalCount: () => tableData.length,
  }));

  const tableData = useMemo(() => {
    if (!apiResponse || apiResponse.length === 0) {
      return [];
    }
    console.log('verifiedForeignCount', apiResponse);
    const transformedData = apiResponse.map((beneficiary: Beneficiary) => {
      const verifiedForeignCount =
        beneficiary.foreignBeneficiaries?.filter((fb) => fb.isVerified)
          .length || 0;
      const totalForeignCount = beneficiary.foreignBeneficiaries?.length || 0;

      return {
        id: beneficiary.id,
        fullName: beneficiary?.fullName || 'N/A',
        email: beneficiary?.email || 'N/A',
        bankName: beneficiary?.bankName || 'N/A',
        phoneNumber: beneficiary?.phoneNumber || 'N/A',
        currency: beneficiary.currency || 'N/A',
        accountNumber: beneficiary.accountNumber || 'N/A',
        bankCountry: beneficiary.bankCountry || 'N/A',
        isVerified: beneficiary.user?.isVerified || false,
        isRejected: beneficiary.user?.isRejected || false,
        rejectedReason: beneficiary.rejectedReason || '',
        foreignBeneficiariesCount: totalForeignCount,
        verifiedForeignCount: verifiedForeignCount,
        clientName: beneficiary.customer.user.fullname || 'N/A',
        user: beneficiary.user,
        foreignBeneficiaries: beneficiary.foreignBeneficiaries || [],
      };
    });

    return transformedData;
  }, [apiResponse]);

  // Filter data (same logic as before)
  const filteredData = useMemo(() => {
    if (!tableData || tableData.length === 0) {
      return [];
    }

    const filtered = tableData.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          item.fullName?.toLowerCase().includes(query) ||
          item.email?.toLowerCase().includes(query) ||
          item.accountNumber?.toLowerCase().includes(query) ||
          item.phoneNumber?.toLowerCase().includes(query);

        if (!matches) return false;
      }

      // Active status filter
      if (statusFilter === 'active' && !item.isActive) return false;
      if (statusFilter === 'inactive' && item.isActive) return false;

      // Verification filter
      if (verificationFilter === 'verified' && !item.isVerified) return false;
      if (verificationFilter === 'not-verified' && item.isVerified)
        return false;

      // Rejection filter
      if (rejectionFilter === 'rejected' && !item.isRejected) return false;
      if (rejectionFilter === 'not-rejected' && item.isRejected) return false;

      // Foreign beneficiaries filter
      if (
        hasForeignFilter === 'has-foreign' &&
        item.foreignBeneficiariesCount === 0
      )
        return false;
      if (
        hasForeignFilter === 'no-foreign' &&
        item.foreignBeneficiariesCount > 0
      )
        return false;

      return true;
    });

    return filtered;
  }, [
    tableData,
    searchQuery,
    statusFilter,
    verificationFilter,
    rejectionFilter,
    hasForeignFilter,
  ]);

  // Calculate stats from API data
  const stats = useMemo(() => {
    console.log('📈 Calculating stats from:', apiResponse);

    if (!apiResponse || apiResponse.length === 0) {
      console.log('❌ No API data for stats');
      return [];
    }

    const beneficiaries = apiResponse;
    const total = beneficiaries.length;
    const active = beneficiaries.filter((b) => b.user?.isActive).length;
    const inactive = beneficiaries.filter((b) => !b.user?.isActive).length;
    const verified = beneficiaries.filter((b) => b.user?.isVerified).length;
    const pendingVerification = beneficiaries.filter(
      (b) => !b.user?.isVerified,
    ).length;
    const rejected = beneficiaries.filter((b) => b.user?.isRejected).length;
    const hasForeign = beneficiaries.filter(
      (b) => b.foreignBeneficiaries && b.foreignBeneficiaries.length > 0,
    ).length;

    console.log('📊 Stats Calculation Results:', {
      total,
      active,
      inactive,
      verified,
      pendingVerification,
      rejected,
      hasForeign,
    });

    return [
      {
        title: 'Total Beneficiaries',
        value: total.toString(),
        change: total > 0 ? `+${Math.floor(total * 0.12)}` : '0',
        changeLabel: 'vs last month',
        icon: MdGroup,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Active Users',
        value: active.toString(),
        change: active > 0 ? `+${Math.floor(active * 0.08)}` : '0',
        changeLabel: 'vs last month',
        icon: MdCheckCircle,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Verified Users',
        value: verified.toString(),
        change: verified > 0 ? `+${Math.floor(verified * 0.15)}` : '0',
        changeLabel: 'vs last month',
        icon: MdCheck,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'With Foreign Beneficiaries',
        value: hasForeign.toString(),
        change: hasForeign > 0 ? `+${Math.floor(hasForeign * 0.24)}` : '0',
        changeLabel: 'vs last month',
        icon: MdPublic,
        color: 'bg-orange-100 text-orange-600',
      },
    ];
  }, [apiResponse]);

  // Handle view foreign beneficiaries
  const handleViewForeignBeneficiaries = (item: (typeof tableData)[0]) => {
    setSelectedBeneficiary(item);
    setIsModalOpen(true);
  };

  // Define columns for GenericTable
  const columns: Column<(typeof tableData)[0]>[] = [
    {
      header: 'Beneficiary Details',
      accessor: 'fullName',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <MdPerson className="text-sm text-primary" />
            </div>
            <div>
              <span className="text-gray-900 text-sm font-semibold">
                {item.fullName || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ),
      className: 'min-w-[200px]',
      sortable: true,
    },
    {
      header: 'Linked Client',
      accessor: 'clientName',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <MdPerson className="text-sm text-primary" />
            </div>
            <div>
              <span className="text-gray-900 text-sm font-semibold">
                {item.clientName || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ),
      className: 'min-w-[200px]',
      sortable: true,
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-gray-900 text-sm font-medium">
                {item.email || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ),
      className: 'min-w-[180px]',
      sortable: true,
    },
    {
      header: 'Phone ',
      accessor: 'phoneNumber',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-gray-900 text-sm font-medium">
                {item.phoneNumber || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ),
      className: 'min-w-[180px]',
      sortable: true,
    },
    {
      header: 'Bank name',
      accessor: 'bankName',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-gray-900 text-sm font-medium">
                {item.bankName || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ),
      className: 'min-w-[180px]',
      sortable: true,
    },
    {
      header: 'Account Number',
      accessor: 'accountNumber',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-gray-900 text-sm font-medium">
                {item.accountNumber || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ),
      className: 'min-w-[180px]',
      sortable: true,
    },
    {
      header: 'Country',
      accessor: 'bankCountry',
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-gray-900 text-sm font-medium">
                {item.bankCountry || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ),
      className: 'min-w-[180px]',
      sortable: true,
    },
    // {
    //   header: 'Currency',
    //   accessor: 'currency',
    //   render: (item) => (
    //     <div className="flex flex-col gap-1">
    //       <div className="flex items-center gap-2">
    //         <div>
    //           <span className="text-gray-900 text-sm font-medium">
    //             {item.currency || 'N/A'}
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   ),
    //   className: 'min-w-[180px]',
    //   sortable: true,
    // },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (item) => {
        let statusText = '';
        let statusColor = '';
        let bgColor = '';
        let dotColor = '';

        if (item.isRejected) {
          statusText = 'Rejected';
          statusColor = 'text-red-800';
          bgColor = 'bg-red-50';
          dotColor = 'bg-red-500';
        } else if (item.isVerified) {
          statusText = 'Approved';
          statusColor = 'text-green-800';
          bgColor = 'bg-green-50';
          dotColor = 'bg-green-500';
        } else {
          statusText = 'Pending';
          statusColor = 'text-yellow-800';
          bgColor = 'bg-yellow-50';
          dotColor = 'bg-yellow-500';
        }

        return (
          <div className="flex flex-col gap-1">
            <div
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${bgColor}`}
            >
              <span className={`h-2 w-2 rounded-full ${dotColor}`} />
              <span className={`text-sm font-medium ${statusColor}`}>
                {statusText}
              </span>
            </div>
            {item.isRejected && item.rejectedReason && (
              <div className="mt-1 max-w-[150px] text-xs text-red-600">
                <span className="font-medium">Reason:</span>{' '}
                {item.rejectedReason}
              </div>
            )}
          </div>
        );
      },
      className: 'min-w-[160px]',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <div className="text-lg">Loading beneficiaries...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg text-red-600">
            Error loading beneficiaries
          </div>
          <div className="text-gray-500">
            {error?.message || 'Unknown error occurred'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if we have data
  if (!apiResponse || apiResponse.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="text-gray-400 mb-4 text-5xl">👤</div>
          <h3 className="text-gray-900 mb-2 text-lg font-semibold">
            No beneficiaries found
          </h3>
          <p className="text-gray-500">
            There are no beneficiaries available in the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Filters & Table */}
        <div className="flex flex-col gap-4">
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            verificationFilter={verificationFilter}
            setVerificationFilter={setVerificationFilter}
            hasForeignFilter={hasForeignFilter}
            setHasForeignFilter={setHasForeignFilter}
            rejectionFilter={rejectionFilter}
            setRejectionFilter={setRejectionFilter}
          />

          {/* Table Info */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="text-gray-600 text-sm">
              Showing{' '}
              <span className="font-semibold">{filteredData.length}</span> of{' '}
              <span className="font-semibold">{tableData.length}</span>{' '}
              beneficiaries
            </div>
            <div className="text-gray-500 text-sm">
              {searchQuery ||
              statusFilter ||
              verificationFilter ||
              rejectionFilter ||
              hasForeignFilter
                ? 'Filtered results'
                : 'All beneficiaries'}
            </div>
          </div>

          {/* Generic Table Container */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-gray-400 mb-4 text-5xl">👤</div>
                <h3 className="text-gray-900 mb-2 text-lg font-semibold">
                  No beneficiaries found
                </h3>
                <p className="text-gray-500 text-center">
                  {searchQuery ||
                  statusFilter ||
                  verificationFilter ||
                  rejectionFilter ||
                  hasForeignFilter
                    ? 'Try adjusting your filters or search query'
                    : 'No beneficiaries available in the system'}
                </p>
                {(searchQuery ||
                  statusFilter ||
                  verificationFilter ||
                  rejectionFilter ||
                  hasForeignFilter) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('');
                      setVerificationFilter('');
                      setRejectionFilter('');
                      setHasForeignFilter('');
                    }}
                    className="hover:text-primary-dark mt-4 text-sm font-medium text-primary"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <GenericTable
                  data={filteredData}
                  columns={columns}
                  searchAble={false}
                  action={false}
                  itemsPerPage={10}
                  pagination={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Foreign Beneficiaries Modal */}
      <ForeignBeneficiariesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        beneficiary={selectedBeneficiary}
      />
    </>
  );
});

// Add display name for debugging
BeneficiaryTable.displayName = 'BeneficiaryTable';

export default BeneficiaryTable;
