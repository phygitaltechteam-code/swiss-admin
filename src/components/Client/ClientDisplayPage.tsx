import React, {useState, useEffect} from 'react';
import {MdAdd, MdSearch} from 'react-icons/md';
import {FiDownload} from 'react-icons/fi';
import GenericTable, {Column} from '../Forms/Table/GenericTable';
import {useGetClients} from '@/lib/react-query/client';
import {useNavigate} from '@tanstack/react-router';

// Define the Client interface based on API response
interface Client {
  id: string;
  accountNumber: string;
  name: string;
  mobile: string;
  email: string;
  totalTrans: number;
  transVolume: number;
  privateBalance: number;
  tempBalance: number;
  isActive: boolean;

  // Additional fields from API
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  photo?: string;
  passport?: string | null;
  aadharCard?: string | null;
  panCard?: string | null;
  isVerified?: boolean;
  isRejected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to transform API data to Client type
const transformApiDataToClient = (apiClient: any): Client => {
  // For now, using mock data for transaction fields since they're not in API
  // You can replace these with actual data if your API provides it
  const mockData = {
    totalTrans: Math.floor(Math.random() * 100),
    transVolume: Math.floor(Math.random() * 100000),
    privateBalance: Math.floor(Math.random() * 50000),
    tempBalance: Math.floor(Math.random() * 5000),
  };

  return {
    id: apiClient.id || '',
    accountNumber: apiClient.accountNumber || 'N/A',
    name: apiClient.user?.fullname || 'Unknown',
    mobile: apiClient.user?.phoneNumber || 'N/A',
    email: apiClient.user?.email || 'N/A',
    totalTrans: mockData.totalTrans,
    transVolume: mockData.transVolume,
    privateBalance: mockData.privateBalance,
    tempBalance: mockData.tempBalance,
    isActive: apiClient.user?.isActive || false,
    // Additional fields from API
    address: apiClient.address,
    city: apiClient.city,
    state: apiClient.state,
    country: apiClient.country,
    pincode: apiClient.pincode,
    photo: apiClient.photo,
    passport: apiClient.passport,
    aadharCard: apiClient.aadharCard,
    panCard: apiClient.panCard,
    isVerified: apiClient.user?.isVerified,
    isRejected: apiClient.user?.isRejected,
    createdAt: apiClient.createdAt,
    updatedAt: apiClient.updatedAt,
  };
};

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
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const navigate = useNavigate();

  // Use the hook to get clients data
  const {data: apiResponse, isLoading, isError, error} = useGetClients();

  // Debug: Log the API response
  useEffect(() => {
    console.log('Full API Response:', apiResponse);
  }, [apiResponse]);

  // Transform API data when it loads
  useEffect(() => {
    if (apiResponse) {
      console.log('API Response structure:', apiResponse);

      // Handle different response structures
      let dataArray: any[] = [];

      if (Array.isArray(apiResponse)) {
        // If response is directly an array
        dataArray = apiResponse;
      } else if (apiResponse.data) {
        // If response has data property
        if (Array.isArray(apiResponse.data)) {
          dataArray = apiResponse.data;
        } else {
          // If data is a single object, wrap it in an array
          dataArray = [apiResponse.data];
        }
      } else if (apiResponse.status && apiResponse.data) {
        // If response has status and data properties
        if (Array.isArray(apiResponse.data)) {
          dataArray = apiResponse.data;
        } else {
          // If data is a single object, wrap it in an array
          dataArray = [apiResponse.data];
        }
      }

      console.log('Data array to transform:', dataArray);

      if (dataArray.length > 0) {
        const transformedData = dataArray.map((apiClient: any) =>
          transformApiDataToClient(apiClient),
        );
        console.log('Transformed data:', transformedData);
        setClientsData(transformedData);
      } else {
        console.log('No data found in API response');
        setClientsData([]);
      }
    }
  }, [apiResponse]);

  // Filter data based on search and filters
  const filteredData = clientsData.filter((client) => {
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
        <div
          className="flex cursor-pointer flex-col transition-opacity hover:opacity-80"
          onClick={() => handleView(item)}
        >
          <span className="font-mono text-sm font-bold tracking-tight text-[#0F1535] dark:text-white">
            {item.name}
          </span>
          <span className="text-gray-900 mt-0.5 text-xs">
            {' '}
            {item.accountNumber}{' '}
          </span>
          {/* Show verification status */}
          <div className="mt-1 flex gap-2">
            {item.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Verified
              </span>
            )}
            {item.isRejected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                Rejected
              </span>
            )}
          </div>
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
      header: 'Email',
      accessor: 'email',
      render: (item) => (
        <span className="text-sm font-medium text-[#0F1535] dark:text-white">
          {item.email}
        </span>
      ),
      className: 'min-w-[180px]',
    },
    {
      header: 'City/State',
      accessor: 'city',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#0F1535] dark:text-white">
            {item.city || 'N/A'}
          </span>
          <span className="text-gray-500 text-xs">{item.state || 'N/A'}</span>
        </div>
      ),
      className: 'min-w-[120px]',
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
    console.log('Navigating to client profile with ID:', client.id);

    // Try using search params instead of state
    navigate({
      to: '/client/profile',
      search: {id: client.id},
    });
  };

  const handleEdit = (client: Client) => {
    console.log('Edit client:', client);
    // Navigate to edit page or open modal
  };

  const handleDelete = (client: Client) => {
    console.log('Delete client:', client);
    // Show confirmation dialog
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

        {/* Loading State */}
        {isLoading && (
          <div className="dark:border-gray-700 dark:bg-gray-800 rounded-xl border border-stroke bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Loading client data...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-300">
              Error loading clients: {error?.message || 'Unknown error'}
            </p>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Please check your API connection and try again.
            </p>
          </div>
        )}

        {/* Show when we have data */}
        {!isLoading && clientsData.length > 0 && (
          <>
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
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                      Showing real client data from API
                    </p>
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
          </>
        )}

        {/* Show when no data is available and not loading */}
        {!isLoading && !isError && clientsData.length === 0 && (
          <div className="dark:border-gray-700 dark:bg-gray-800 rounded-xl border border-stroke bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-gray-100 dark:bg-gray-700 mb-4 rounded-full p-4">
                <MdSearch className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-gray-900 text-lg font-semibold dark:text-white">
                No Clients Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {apiResponse
                  ? 'API returned data but it could not be processed. Check console for details.'
                  : 'No client data is available.'}
              </p>
              <button
                onClick={() => {
                  console.log('API Response:', apiResponse);
                  console.log('Clients Data:', clientsData);
                }}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Debug Info in Console
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ClientDisplay;
