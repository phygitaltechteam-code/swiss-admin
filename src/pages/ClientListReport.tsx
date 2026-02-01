import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import React, {useState} from 'react';
import {
  MdDownload,
  MdAdd,
  MdSearch,
  MdFilterList,
  MdOutlineAccountBalance,
  MdPerson,
  MdAttachMoney,
  MdCalendarToday,
} from 'react-icons/md';

// Mock Data
const CLIENT_DATA = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    accountNumber: 'ACC-001234',
    accountType: 'Premium',
    balance: 125000.5,
    status: 'Active',
    lastActivity: '2023-10-15',
    joinDate: '2023-01-10',
    totalTransactions: 145,
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    phone: '+1 (555) 987-6543',
    accountNumber: 'ACC-001235',
    accountType: 'Standard',
    balance: 75000.25,
    status: 'Active',
    lastActivity: '2023-10-14',
    joinDate: '2023-02-15',
    totalTransactions: 89,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '+44 7700 900077',
    accountNumber: 'ACC-001236',
    accountType: 'Business',
    balance: 250000.0,
    status: 'Inactive',
    lastActivity: '2023-09-28',
    joinDate: '2023-03-20',
    totalTransactions: 0,
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    phone: '+1 (415) 555-0199',
    accountNumber: 'ACC-001237',
    accountType: 'Premium',
    balance: 189000.75,
    status: 'Active',
    lastActivity: '2023-10-13',
    joinDate: '2023-04-05',
    totalTransactions: 234,
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '+1 (212) 555-8821',
    accountNumber: 'ACC-001238',
    accountType: 'Standard',
    balance: 45000.0,
    status: 'Active',
    lastActivity: '2023-10-12',
    joinDate: '2023-05-15',
    totalTransactions: 67,
  },
  {
    id: '6',
    name: 'Lisa Johnson',
    email: 'lisa.j@example.com',
    phone: '+1 (310) 555-6677',
    accountNumber: 'ACC-001239',
    accountType: 'Business',
    balance: 375000.5,
    status: 'Pending',
    lastActivity: '2023-10-10',
    joinDate: '2023-06-10',
    totalTransactions: 0,
  },
  {
    id: '7',
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    phone: '+1 (718) 555-9988',
    accountNumber: 'ACC-001240',
    accountType: 'Standard',
    balance: 32000.25,
    status: 'Active',
    lastActivity: '2023-10-11',
    joinDate: '2023-07-05',
    totalTransactions: 45,
  },
  {
    id: '8',
    name: 'Jennifer Martinez',
    email: 'jennifer.m@example.com',
    phone: '+1 (305) 555-1122',
    accountNumber: 'ACC-001241',
    accountType: 'Premium',
    balance: 210000.0,
    status: 'Active',
    lastActivity: '2023-10-09',
    joinDate: '2023-08-20',
    totalTransactions: 189,
  },
];

const STATS_DATA = [
  {
    title: 'Total Clients',
    value: '1,248',
    change: '+12%',
    changeLabel: 'vs last month',
    icon: MdPerson,
    color: 'bg-blue-100 text-blue-600',
    trend: 'up',
  },
  {
    title: 'Active Clients',
    value: '1,042',
    change: '+8%',
    changeLabel: 'vs last month',
    icon: MdOutlineAccountBalance,
    color: 'bg-green-100 text-green-600',
    trend: 'up',
  },
  {
    title: 'Total Balance',
    value: '$2.5M',
    change: '+15%',
    changeLabel: 'vs last quarter',
    icon: MdAttachMoney,
    color: 'bg-purple-100 text-purple-600',
    trend: 'up',
  },
  {
    title: 'Avg. Activity',
    value: '28 days',
    change: '-2 days',
    changeLabel: 'vs last month',
    icon: MdCalendarToday,
    color: 'bg-yellow-100 text-yellow-600',
    trend: 'down',
  },
];

// Stats Card Component
interface StatCardProps {
  stat: {
    title: string;
    value: string;
    change: string;
    changeLabel: string;
    icon: React.ComponentType<{className?: string}>;
    color: string;
    trend: 'up' | 'down';
  };
}

const StatCard: React.FC<StatCardProps> = ({stat}) => {
  const Icon = stat.icon;

  return (
    <div className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-1 rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]}`}
        >
          <Icon className="text-lg" />
        </div>
        <p className="text-sm font-medium">{stat.title}</p>
      </div>
      <p className="text-gray-900 mt-1 text-2xl font-bold dark:text-white">
        {stat.value}
      </p>
      <div className="mt-2 flex items-center gap-1">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
            stat.trend === 'up'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-xs">
          {stat.changeLabel}
        </span>
      </div>
    </div>
  );
};

// Filters Component
const Filters: React.FC = () => {
  return (
    <div className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex flex-col items-start justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
        {/* Search */}
        <div className="relative flex-1 lg:w-64 lg:flex-none">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdSearch className="text-gray-400" size={20} />
          </div>
          <input
            className="border-gray-300 text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-700 block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
            placeholder="Search clients by name, email, account..."
            type="text"
          />
        </div>

        {/* Account Type Filter */}
        <div className="relative">
          <select className="border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-700 block appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white">
            <option value="">All Types</option>
            <option value="premium">Premium</option>
            <option value="standard">Standard</option>
            <option value="business">Business</option>
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

        {/* Status Filter */}
        <div className="relative">
          <select className="border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-700 block appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
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
      <button className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold transition-colors">
        <MdFilterList className="text-lg" />
        More Filters
      </button>
    </div>
  );
};

// Main Page Component
const ClientListReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter data
  const filteredData = CLIENT_DATA.filter((item) => {
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      accountTypeFilter &&
      accountTypeFilter !== 'All Types' &&
      item.accountType.toLowerCase() !== accountTypeFilter.toLowerCase()
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
    return true;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Define columns for GenericTable
  const columns: Column<(typeof CLIENT_DATA)[0]>[] = [
    {
      header: 'Client Name',
      accessor: 'name',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-semibold dark:text-white">
            {item.name}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {item.email}
          </span>
        </div>
      ),
      className: 'min-w-[180px]',
      sortable: true,
    },
    {
      header: 'Contact',
      accessor: 'phone',
      render: (item) => (
        <span className="text-gray-900 text-sm dark:text-white">
          {item.phone}
        </span>
      ),
      className: 'min-w-[140px]',
    },
    {
      header: 'Account Details',
      accessor: 'accountNumber',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-medium dark:text-white">
            {item.accountNumber}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {item.accountType}
          </span>
        </div>
      ),
      className: 'min-w-[140px]',
    },
    {
      header: 'Balance',
      accessor: 'balance',
      render: (item) => (
        <span className="text-gray-900 text-sm font-bold dark:text-white">
          {formatCurrency(item.balance)}
        </span>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.status === 'Active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : item.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
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
        <span className="text-gray-900 text-sm font-medium dark:text-white">
          {item.totalTransactions}
        </span>
      ),
      className: 'min-w-[100px]',
      sortable: true,
    },
    {
      header: 'Last Activity',
      accessor: 'lastActivity',
      render: (item) => (
        <span className="text-gray-900 text-sm dark:text-white">
          {new Date(item.lastActivity).toLocaleDateString()}
        </span>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
  ];

  const handleView = (item: (typeof CLIENT_DATA)[0]) => {
    console.log('View client:', item);
    // Navigate to client details or open modal
  };

  const handleEdit = (item: (typeof CLIENT_DATA)[0]) => {
    console.log('Edit client:', item);
    // Open edit modal
  };

  const handleDelete = (item: (typeof CLIENT_DATA)[0]) => {
    console.log('Delete client:', item);
    // Show confirmation dialog
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // CSV export logic
  };

  const handleAddClient = () => {
    console.log('Adding new client...');
    // Navigate to add client form
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen w-full">
      <main className="flex min-h-screen flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 p-6 md:p-10">
          {/* Page Title & Actions */}
          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Client List Report
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                Comprehensive directory of all registered clients, assets, and
                account statuses.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold transition-colors"
              >
                <MdDownload className="text-lg" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleAddClient}
                className="hover:bg-primary-dark flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors"
              >
                <MdAdd className="text-lg" />
                <span>Add Client</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS_DATA.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>

          {/* Table Section */}
          <div className="flex flex-col gap-4">
            {/* Custom Filter Bar */}
            <div className="dark:border-gray-700 dark:bg-gray-800 flex flex-col items-start justify-between gap-4 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
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
                    placeholder="Search clients by name, email, account..."
                    type="text"
                  />
                </div>

                {/* Account Type Filter */}
                <div className="relative">
                  <select
                    value={accountTypeFilter}
                    onChange={(e) => setAccountTypeFilter(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option value="">All Types</option>
                    <option value="premium">Premium</option>
                    <option value="standard">Standard</option>
                    <option value="business">Business</option>
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

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
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

              <button className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold transition-colors">
                <MdFilterList className="text-lg" />
                More Filters
              </button>
            </div>

            {/* Generic Table Container */}
            <div className="dark:border-gray-700 dark:bg-gray-800 overflow-hidden bg-white shadow-sm">
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
                  viewTooltip="View Client Details"
                  editTooltip="Edit Client"
                  deleteTooltip="Delete Client"
                  variant="default"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientListReport;
