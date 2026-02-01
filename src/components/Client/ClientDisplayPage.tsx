import React, {useState} from 'react';
import {MdAdd, MdSearch, MdVisibility, MdEdit, MdDelete} from 'react-icons/md';
import {FiDownload} from 'react-icons/fi';
import Toggle from './Toggle';
import {Client} from '@/types/client';
import GenericTable, {Column} from '../Forms/Table/GenericTable';

interface ClientTableProps {
  clients: Client[];
}

const MOCK_DATA: Client[] = [
  {
    id: '1',
    accountNumber: '8839201452',
    name: 'John Doe',
    mobile: '+1 (555) 234-8890',
    email: 'john.doe@example.com',
    totalTrans: 142,
    transVolume: 45210.0,
    privateBalance: 12450.0,
    tempBalance: 250.0,
    isActive: true,
  },
  {
    id: '2',
    accountNumber: '1293844992',
    name: 'Sarah Smith',
    mobile: '+1 (555) 900-1234',
    email: 'sarah.smith@example.com',
    totalTrans: 0,
    transVolume: 0.0,
    privateBalance: 0.0,
    tempBalance: 0.0,
    isActive: false,
  },
  {
    id: '3',
    accountNumber: '9928371003',
    name: 'Michael Brown',
    mobile: '+44 7700 900077',
    email: 'michael.brown@example.com',
    totalTrans: 23,
    transVolume: 8900.5,
    privateBalance: 450.5,
    tempBalance: 1200.0,
    isActive: false,
  },
  {
    id: '4',
    accountNumber: '4482910221',
    name: 'Emily Chen',
    mobile: '+1 (415) 555-0199',
    email: 'emily.chen@example.com',
    totalTrans: 892,
    transVolume: 214500.25,
    privateBalance: 8920.25,
    tempBalance: 50.0,
    isActive: true,
  },
  {
    id: '5',
    accountNumber: '7721093884',
    name: 'David Wilson',
    mobile: '+1 (212) 555-8821',
    email: 'david.wilson@example.com',
    totalTrans: 56,
    transVolume: 12100.0,
    privateBalance: 2100.0,
    tempBalance: 0.0,
    isActive: true,
  },
  {
    id: '6',
    accountNumber: '5532109876',
    name: 'Lisa Johnson',
    mobile: '+1 (310) 555-6677',
    email: 'lisa.johnson@example.com',
    totalTrans: 189,
    transVolume: 56780.5,
    privateBalance: 12500.0,
    tempBalance: 500.0,
    isActive: true,
  },
  {
    id: '7',
    accountNumber: '4412987654',
    name: 'Robert Taylor',
    mobile: '+1 (718) 555-9988',
    email: 'robert.taylor@example.com',
    totalTrans: 34,
    transVolume: 8900.0,
    privateBalance: 3200.0,
    tempBalance: 100.0,
    isActive: true,
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const ClientDisplay: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [privateBalanceFilter, setPrivateBalanceFilter] = useState('');
  const [tempBalanceFilter, setTempBalanceFilter] = useState('');
  const [transVolumeFilter, setTransVolumeFilter] = useState('');

  // Filter data based on search and filters
  const filteredData = MOCK_DATA.filter((client) => {
    // Search filter
    if (
      searchQuery &&
      !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !client.accountNumber.includes(searchQuery) &&
      !client.mobile.includes(searchQuery) &&
      !client.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Private Balance filter
    if (privateBalanceFilter) {
      if (privateBalanceFilter === 'high' && client.privateBalance < 5000)
        return false;
      if (privateBalanceFilter === 'low' && client.privateBalance >= 5000)
        return false;
    }

    // Temp Balance filter
    if (tempBalanceFilter) {
      if (tempBalanceFilter === 'high' && client.tempBalance < 500)
        return false;
      if (tempBalanceFilter === 'low' && client.tempBalance >= 500)
        return false;
    }

    // Trans Volume filter
    if (transVolumeFilter) {
      if (transVolumeFilter === 'high' && client.transVolume < 10000)
        return false;
      if (transVolumeFilter === 'low' && client.transVolume >= 10000)
        return false;
    }

    return true;
  });

  // Define columns for GenericTable
  const columns: Column<Client>[] = [
    {
      header: 'Account Details',
      accessor: 'accountNumber',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-bold tracking-tight text-[#0F1535] dark:text-white">
            {item.accountNumber}
          </span>
          <span className="text-gray-900 mt-0.5 text-xs">{item.name}</span>
        </div>
      ),
      className: 'min-w-[200px]',
    },
    {
      header: 'Mobile Number',
      accessor: 'mobile',
      render: (item) => (
        <span className="text-sm font-medium text-[#0F1535] dark:text-white">
          {item.mobile}
        </span>
      ),
      className: 'min-w-[150px]',
    },
    {
      header: 'Total Trans.',
      accessor: 'totalTrans',
      render: (item) => (
        <span className="text-right text-sm font-medium text-[#0F1535] dark:text-white">
          {item.totalTrans}
        </span>
      ),
      className: 'min-w-[100px] text-right',
      sortable: true,
    },
    {
      header: 'Trans. Volume',
      accessor: 'transVolume',
      render: (item) => (
        <span className="text-right text-sm font-medium text-[#0F1535] dark:text-white">
          {formatCurrency(item.transVolume)}
        </span>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
    },
    {
      header: 'Private Balance',
      accessor: 'privateBalance',
      render: (item) => (
        <span className="font-mono text-right text-sm font-bold tracking-tight text-[#0F1535] dark:text-white">
          {formatCurrency(item.privateBalance)}
        </span>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
    },
    {
      header: 'Temp Balance',
      accessor: 'tempBalance',
      render: (item) => (
        <span className="font-mono dark:text-gray-300 text-gray-900 text-right text-sm font-medium tracking-tight">
          {formatCurrency(item.tempBalance)}
        </span>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.isActive
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              item.isActive ? 'bg-emerald-500' : 'bg-gray-500'
            }`}
          ></span>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
      className: 'min-w-[100px]',
    },
  ];

  const handleView = (client: Client) => {
    console.log('View client:', client);
    // Navigate to view page or open modal
    // navigate({ to: `/client/view/${client.id}` });
  };

  const handleEdit = (client: Client) => {
    console.log('Edit client:', client);
    // Navigate to edit page or open modal
    // navigate({ to: `/client/edit/${client.id}` });
  };

  const handleDelete = (client: Client) => {
    console.log('Delete client:', client);
    // Show confirmation dialog
    // if (window.confirm(`Delete client ${client.name}?`)) {
    //   // Delete logic here
    // }
  };

  const handleToggle = (client: Client) => {
    console.log('Toggle client status:', client);
    // Update client status logic here
  };

  const handleSeeHistory = (client: Client) => {
    console.log('See history for client:', client);
    // Navigate to transaction history
    // navigate({ to: `/client/history/${client.id}` });
  };

  return (
    <main className="dark:bg-gray-900 ml-0 min-h-screen flex-1 bg-white p-6 md:p-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F1535] dark:text-white sm:text-3xl">
              Client Management
            </h1>
            <p className="dark:text-gray-400 text-gray-900 mt-1 text-sm">
              View and manage detailed client account records and balances.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm font-semibold text-[#0F1535] transition-colors dark:text-white">
              <FiDownload className="text-lg" />
              Export
            </button>
            <button className="hover:bg-primary-dark flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors">
              <MdAdd className="text-lg" />
              Add New Client
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="dark:border-gray-700 dark:bg-gray-800 flex flex-col items-center gap-4 rounded-xl border border-stroke bg-white p-4 lg:flex-row">
          <div className="relative w-full lg:flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdSearch className="text-gray-900 text-xl" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, account, email, or mobile number"
              className="dark:border-gray-600 dark:bg-gray-700 text-gray-900 block w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-3 text-sm placeholder-[#9c6949] transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
            />
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative">
              <select
                value={privateBalanceFilter}
                onChange={(e) => setPrivateBalanceFilter(e.target.value)}
                className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 text-gray-900 block w-full cursor-pointer appearance-none rounded-lg border border-stroke bg-white px-3 py-2.5 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48"
              >
                <option value="">Private Balance</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="text-gray-500 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={tempBalanceFilter}
                onChange={(e) => setTempBalanceFilter(e.target.value)}
                className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 text-gray-900 block w-full cursor-pointer appearance-none rounded-lg border border-stroke bg-white px-3 py-2.5 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48"
              >
                <option value="">Temp Balance</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="text-gray-500 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={transVolumeFilter}
                onChange={(e) => setTransVolumeFilter(e.target.value)}
                className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 text-gray-900 block w-full cursor-pointer appearance-none rounded-lg border border-stroke bg-white px-3 py-2.5 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48"
              >
                <option value="">Trans. Volume</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="text-gray-500 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Generic Table with Custom Actions */}
        <div className="dark:border-gray-700 dark:bg-gray-800 overflow-hidden rounded-xl border border-stroke bg-white shadow-sm">
          {/* Table Toolbar */}
          <div className="dark:border-gray-700 border-b border-stroke p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-semibold text-[#0F1535] dark:text-white">
                  Client Records ({filteredData.length} total)
                </h3>
              </div>
            </div>
          </div>

          {/* Generic Table Component */}
          <div className="flex-1">
            <GenericTable
              data={filteredData}
              columns={columns}
              searchAble={false} // We have external search
              action={true}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              itemsPerPage={5}
              viewTooltip="View Client Details"
              editTooltip="Edit Client"
              deleteTooltip="Delete Client"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClientDisplay;
