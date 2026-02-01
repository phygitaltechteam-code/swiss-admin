import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import React, {useState} from 'react';
import {FaFilePdf, FaFileCsv} from 'react-icons/fa6';
import {
  MdPrint,
  MdPendingActions,
  MdDomain,
  MdGroup,
  MdCheckCircle,
  MdSearch,
  MdFilterList,
  MdDownload,
} from 'react-icons/md';

// Mock Data
const BENEFICIARY_DATA = [
  {
    id: '1',
    name: 'John Doe',
    accountNumber: 'ACC-001234',
    bankName: 'Chase Bank',
    clientName: 'Sarah Smith',
    status: 'Active',
    totalTransactions: 45,
    lastTransaction: '2023-10-15',
    createdAt: '2023-01-10',
  },
  {
    id: '2',
    name: 'Microsoft Corp',
    accountNumber: 'ACC-001235',
    bankName: 'Bank of America',
    clientName: 'Tech Solutions Inc',
    status: 'Active',
    totalTransactions: 120,
    lastTransaction: '2023-10-14',
    createdAt: '2023-02-15',
  },
  {
    id: '3',
    name: 'Amazon Web Services',
    accountNumber: 'ACC-001236',
    bankName: 'Wells Fargo',
    clientName: 'Cloud Services Ltd',
    status: 'Pending',
    totalTransactions: 0,
    lastTransaction: '-',
    createdAt: '2023-10-10',
  },
  {
    id: '4',
    name: 'Apple Inc',
    accountNumber: 'ACC-001237',
    bankName: 'Citibank',
    clientName: 'Innovation Tech',
    status: 'Active',
    totalTransactions: 89,
    lastTransaction: '2023-10-13',
    createdAt: '2023-03-20',
  },
  {
    id: '5',
    name: 'Google LLC',
    accountNumber: 'ACC-001238',
    bankName: 'HSBC',
    clientName: 'Digital Solutions',
    status: 'Inactive',
    totalTransactions: 67,
    lastTransaction: '2023-09-28',
    createdAt: '2023-04-05',
  },
  {
    id: '6',
    name: 'Netflix Inc',
    accountNumber: 'ACC-001239',
    bankName: 'Barclays',
    clientName: 'Media Stream',
    status: 'Active',
    totalTransactions: 34,
    lastTransaction: '2023-10-12',
    createdAt: '2023-05-15',
  },
  {
    id: '7',
    name: 'Tesla Motors',
    accountNumber: 'ACC-001240',
    bankName: 'Deutsche Bank',
    clientName: 'EV Solutions',
    status: 'Pending',
    totalTransactions: 0,
    lastTransaction: '-',
    createdAt: '2023-10-05',
  },
  {
    id: '8',
    name: 'Starbucks Corp',
    accountNumber: 'ACC-001241',
    bankName: 'UBS',
    clientName: 'Beverage Ltd',
    status: 'Active',
    totalTransactions: 156,
    lastTransaction: '2023-10-11',
    createdAt: '2023-06-10',
  },
];

const STATS = [
  {
    title: 'Total Beneficiaries',
    value: '1,248',
    change: '+12%',
    changeLabel: 'vs last month',
    icon: MdGroup,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Active Beneficiaries',
    value: '1,042',
    change: '+8%',
    changeLabel: 'vs last month',
    icon: MdCheckCircle,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Pending Approval',
    value: '156',
    change: '+5',
    changeLabel: 'vs last week',
    icon: MdPendingActions,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    title: 'Linked Clients',
    value: '452',
    change: '+24',
    changeLabel: 'vs last month',
    icon: MdDomain,
    color: 'bg-purple-100 text-purple-600',
  },
];

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
const FilterBar: React.FC = () => {
  return (
    <div className="border-gray-200 flex flex-col items-start justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
        {/* Search */}
        <div className="relative flex-1 lg:w-64 lg:flex-none">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdSearch className="text-gray-400" size={20} />
          </div>
          <input
            className="border-gray-300 text-gray-900 placeholder-gray-500 block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search beneficiaries by name, account..."
            type="text"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select className="border-gray-300 text-gray-900 block appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
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

        {/* Bank Filter */}
        <div className="relative">
          <select className="border-gray-300 text-gray-900 block appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All Banks</option>
            <option value="chase">Chase Bank</option>
            <option value="boa">Bank of America</option>
            <option value="wells">Wells Fargo</option>
            <option value="citi">Citibank</option>
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

      {/* Filter Button */}
      <button className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold transition-colors">
        <MdFilterList className="text-lg" />
        More Filters
      </button>
    </div>
  );
};

// Main Page Component
const BeneficiaryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bankFilter, setBankFilter] = useState('');

  // Filter data
  const filteredData = BENEFICIARY_DATA.filter((item) => {
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      statusFilter &&
      statusFilter !== 'All Status' &&
      item.status.toLowerCase() !== statusFilter.toLowerCase()
    ) {
      return false;
    }
    if (
      bankFilter &&
      bankFilter !== 'All Banks' &&
      item.bankName.toLowerCase() !== bankFilter.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  // Define columns for GenericTable
  const columns: Column<(typeof BENEFICIARY_DATA)[0]>[] = [
    {
      header: 'Beneficiary Name',
      accessor: 'name',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-semibold">
            {item.name}
          </span>
          <span className="text-gray-500 text-xs">
            Account: {item.accountNumber}
          </span>
        </div>
      ),
      className: 'min-w-[200px]',
      sortable: true,
    },
    {
      header: 'Bank Details',
      accessor: 'bankName',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm">{item.bankName}</span>
          <span className="text-gray-500 text-xs">SWIFT: CHASUS33</span>
        </div>
      ),
      className: 'min-w-[150px]',
    },
    {
      header: 'Linked Client',
      accessor: 'clientName',
      render: (item) => (
        <span className="text-gray-900 text-sm">{item.clientName}</span>
      ),
      className: 'min-w-[150px]',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.status === 'Active'
              ? 'bg-green-100 text-green-800'
              : item.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
              item.status === 'Active'
                ? 'bg-green-500'
                : item.status === 'Pending'
                  ? 'bg-yellow-500'
                  : 'bg-gray-500'
            }`}
          />
          {item.status}
        </span>
      ),
      className: 'min-w-[100px]',
    },
    {
      header: 'Transactions',
      accessor: 'totalTransactions',
      render: (item) => (
        <span className="text-gray-900 text-sm font-medium">
          {item.totalTransactions}
        </span>
      ),
      className: 'min-w-[100px]',
      sortable: true,
    },
    {
      header: 'Last Transaction',
      accessor: 'lastTransaction',
      render: (item) => (
        <span className="text-gray-900 text-sm">
          {item.lastTransaction === '-'
            ? '-'
            : new Date(item.lastTransaction).toLocaleDateString()}
        </span>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
  ];

  const handleView = (item: (typeof BENEFICIARY_DATA)[0]) => {
    console.log('View beneficiary:', item);
    // Navigate to view page or open modal
  };

  const handleEdit = (item: (typeof BENEFICIARY_DATA)[0]) => {
    console.log('Edit beneficiary:', item);
    // Open edit modal
  };

  const handleDelete = (item: (typeof BENEFICIARY_DATA)[0]) => {
    console.log('Delete beneficiary:', item);
    // Show confirmation dialog
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
    // PDF export logic
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // CSV export logic
  };

  const handlePrint = () => {
    console.log('Printing...');
    window.print();
  };

  const handleExportAll = () => {
    console.log('Exporting all beneficiaries...');
    // Bulk export logic
  };

  return (
    <div className="bg-gray-50 relative flex min-h-screen w-full flex-row">
      <div className="flex min-h-screen flex-1 flex-col transition-all duration-300">
        <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-8 p-6 md:p-10">
          {/* Page Title & Actions */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                All Beneficiary List Report
              </h2>
              <p className="text-gray-600 max-w-2xl text-sm">
                A master list of all beneficiaries across all clients, including
                linking details and status.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportPDF}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold transition-colors"
              >
                <FaFilePdf className="text-gray-500 text-lg" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold transition-colors"
              >
                <FaFileCsv className="text-gray-500 text-lg" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportAll}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold transition-colors"
              >
                <MdDownload className="text-gray-500 text-lg" />
                <span>Export All</span>
              </button>
              <button
                onClick={handlePrint}
                className="hover:bg-primary-dark flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors"
              >
                <MdPrint className="text-lg" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Filters & Table */}
          <div className="flex flex-col gap-4">
            {/* Custom Filter Bar */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:items-center">
              <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 lg:w-64 lg:flex-none">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdSearch className="text-gray-400" size={20} />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                    placeholder="Search beneficiaries by name, account..."
                    type="text"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Bank Filter */}
                <div className="relative">
                  <select
                    value={bankFilter}
                    onChange={(e) => setBankFilter(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                  >
                    <option value="">All Banks</option>
                    <option value="chase bank">Chase Bank</option>
                    <option value="bank of america">Bank of America</option>
                    <option value="wells fargo">Wells Fargo</option>
                    <option value="citibank">Citibank</option>
                  </select>
                </div>
              </div>

              <button className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold transition-colors">
                <MdFilterList className="text-lg" />
                More Filters
              </button>
            </div>

            {/* Generic Table Container */}
            <div className="overflow-hidden bg-white">
              {/* Generic Table Component */}
              <div className="flex-1">
                <GenericTable
                  data={filteredData}
                  columns={columns}
                  searchAble={false} // Using external search
                  action={true}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  itemsPerPage={6}
                  viewTooltip="View Beneficiary Details"
                  editTooltip="Edit Beneficiary"
                  deleteTooltip="Delete Beneficiary"
                  variant="default"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BeneficiaryPage;
