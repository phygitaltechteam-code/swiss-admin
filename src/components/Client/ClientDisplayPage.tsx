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
  isVerified: boolean;
  isRejected: boolean;

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
  createdAt?: string;
  updatedAt?: string;
  rejectedReason?: string | null;
}

// Helper function to transform API data to Client type
const transformApiDataToClient = (apiClient: any): Client => {
  // Extract wallet data
  const walletData = apiClient.wallets?.[0] || {};
  const privateBalance = walletData.eprivateAccount || 0;
  const tempBalance = walletData.temporyAccount || 0;

  // Get transaction count
  const totalTrans = apiClient._count?.senderTransactions || 0;

  // For now, transaction volume is not in the API, so we'll calculate based on some logic
  // or leave it as 0. You can adjust this based on your actual data structure
  const transVolume = 0; // This could be calculated from actual transaction data if available

  return {
    id: apiClient.id || '',
    accountNumber: apiClient.accountNumber || 'N/A',
    name: apiClient.user?.fullname || 'Unknown',
    mobile: apiClient.user?.phoneNumber || 'N/A',
    email: apiClient.user?.email || 'N/A',
    totalTrans: totalTrans,
    transVolume: transVolume,
    privateBalance: privateBalance,
    tempBalance: tempBalance,
    isActive: apiClient.user?.isActive || false,
    isVerified: apiClient.user?.isVerified || false,
    isRejected: apiClient.user?.isRejected || false,
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
    createdAt: apiClient.createdAt,
    updatedAt: apiClient.updatedAt,
    rejectedReason: apiClient.rejectedReason,
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatCompactIndian = (num: number): string => {
  const abs = Math.abs(num);

  if (abs >= 10000000) {
    return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
  }
  if (abs >= 100000) {
    return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  }
  if (abs >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

const ClientDisplay: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [privateBalanceFilter, setPrivateBalanceFilter] = useState('');
  const [tempBalanceFilter, setTempBalanceFilter] = useState('');
  const [transVolumeFilter, setTransVolumeFilter] = useState('');
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const navigate = useNavigate();

  // Use the hook to get clients data
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClients();

  // Debug: Log the API response
  useEffect(() => {
    console.log('Full API Response:', apiResponse);
  }, [apiResponse]);

  // Transform API data when it loads and filter only active customers
  useEffect(() => {
    if (apiResponse) {
      console.log('API Response structure:', apiResponse);

      // Handle different response structures
      let dataArray: any[] = [];

      // Based on your API response structure
      if (apiResponse.data && Array.isArray(apiResponse.data)) {
        // This matches your actual API response structure
        dataArray = apiResponse.data;
        console.log(
          'Found data array in apiResponse.data:',
          dataArray.length,
          'items',
        );
      } else if (Array.isArray(apiResponse)) {
        dataArray = apiResponse;
      } else {
        console.log('Unexpected API response structure:', apiResponse);
        dataArray = [];
      }

      console.log('Data array to transform:', dataArray);

      if (dataArray.length > 0) {
        // First transform all data
        const transformedData = dataArray.map((apiClient: any) =>
          transformApiDataToClient(apiClient),
        );

        // Then filter to show ONLY active customers (isActive === true)
        const activeCustomers = transformedData.filter(
          (client) => client.isActive === true && client.isRejected === false,
        );

        console.log('Transformed data (all):', transformedData);
        console.log('Active customers only:', activeCustomers);

        setClientsData(activeCustomers);
      } else {
        console.log('No data found in API response');
        setClientsData([]);
      }
    }
  }, [apiResponse]);

  // Filter data based on search and filters (applied on already filtered active customers)
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

    // Status filter (now applied on already active customers)
    if (transVolumeFilter) {
      if (transVolumeFilter === 'verified' && !client.isVerified) return false;
      if (transVolumeFilter === 'unverified' && client.isVerified) return false;
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
            {item.accountNumber}
          </span>
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
      header: 'Transactions',
      accessor: 'totalTrans',
      render: (item) => (
        <div className="text-right">
          <span className="text-sm font-medium text-[#0F1535] dark:text-white">
            {item.totalTrans}
          </span>
        </div>
      ),
      className: 'min-w-[100px] text-right',
      sortable: true,
    },
    {
      header: 'Private Balance',
      accessor: 'privateBalance',
      render: (item) => (
        <div className="text-right">
          <span className="font-mono text-sm font-bold tracking-tight text-[#0F1535] dark:text-white">
            {formatCurrency(item.privateBalance)}
          </span>
        </div>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
    },
    {
      header: 'Temp Balance',
      accessor: 'tempBalance',
      render: (item) => (
        <div className="text-right">
          <span className="font-mono text-sm font-bold tracking-tight text-[#0F1535] dark:text-white">
            {formatCurrency(item.tempBalance)}
          </span>
        </div>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'isVerified',
      render: (item) => {
        let label = 'Active';
        let style =
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        let dot = 'bg-emerald-500';

        if (item.isVerified) {
          label = 'Verified';
          style =
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
          dot = 'bg-blue-500';
        }

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
          >
            <span className={`size-1.5 rounded-full ${dot}`}></span>
            {label}
          </span>
        );
      },
      className: 'min-w-[120px]',
    },
  ];

  const handleView = (client: Client) => {
    console.log('Navigating to client profile with ID:', client.id);
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

  // Calculate summary statistics (based on active customers only)
  const totalPrivateBalance = clientsData.reduce(
    (sum, client) => sum + client.privateBalance,
    0,
  );
  const totalTempBalance = clientsData.reduce(
    (sum, client) => sum + client.tempBalance,
    0,
  );
  const totalTransactions = clientsData.reduce(
    (sum, client) => sum + client.totalTrans,
    0,
  );
  const verifiedClients = clientsData.filter(
    (client) => client.isVerified,
  ).length;

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
              View and manage active client accounts (inactive clients are
              hidden).
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigate({to: '/addclient'});
              }}
              className="hover:bg-primary-dark flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
            >
              <MdAdd className="text-lg" />
              Add New Client
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {clientsData.length > 0 && !isLoading && (
          <div className="w-full overflow-x-auto pb-2 md:overflow-visible md:pb-0">
            <div className="flex min-w-max gap-4 md:grid md:min-w-0 md:grid-cols-2 md:gap-4 lg:grid-cols-5">
              {/* Total Active Clients */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Total Active Clients
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {clientsData.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <svg
                      className="h-5 w-5 text-orange-600 dark:text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Verified Clients */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Verified Active Clients
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {verifiedClients}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <svg
                      className="h-5 w-5 text-orange-600 dark:text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Private Balance */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium sm:text-sm">
                      Total Private Balance
                    </p>
                    <p className="text-base font-bold text-[#0F1535] dark:text-white sm:text-lg md:text-xl lg:text-2xl">
                      {formatCompactIndian(totalPrivateBalance)}
                    </p>
                  </div>
                  <div className="ml-2 shrink-0 rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <svg
                      className="h-4 w-4 text-orange-600 dark:text-orange-400 sm:h-5 sm:w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Temp Balance */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium sm:text-sm">
                      Total Temp Balance
                    </p>
                    <p className="text-base font-bold text-[#0F1535] dark:text-white sm:text-lg md:text-xl lg:text-2xl">
                      {formatCompactIndian(totalTempBalance)}
                    </p>
                  </div>
                  <div className="ml-2 shrink-0 rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <svg
                      className="h-4 w-4 text-orange-600 dark:text-orange-400 sm:h-5 sm:w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Transactions */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Total Transactions
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {totalTransactions}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <svg
                      className="h-5 w-5 text-orange-600 dark:text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    <option value="high">High (≥ $5,000)</option>
                    <option value="low">Low (&lt; $5,000)</option>
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
                    <option value="high">High (≥ $500)</option>
                    <option value="low">Low (&lt; $500)</option>
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
                    <option value="">Status</option>
                    <option value="verified">Verified Only</option>
                    <option value="unverified">Unverified Only</option>
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
                      Active Client Records ({filteredData.length} total)
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                      Showing real-time active client data from API
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Total Private:{' '}
                      <span className="font-bold text-[#0F1535] dark:text-white">
                        {formatCurrency(totalPrivateBalance)}
                      </span>
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      • Total Temp:{' '}
                      <span className="font-bold text-[#0F1535] dark:text-white">
                        {formatCurrency(totalTempBalance)}
                      </span>
                    </span>
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
                  // onEdit={handleEdit}
                  // onDelete={handleDelete}
                  itemsPerPage={10}
                  viewTooltip="View Client Details"
                  editTooltip="Edit Client"
                  deleteTooltip="Delete Client"
                />
              </div>
            </div>
          </>
        )}

        {/* Show when no active data is available and not loading */}
        {!isLoading && !isError && clientsData.length === 0 && (
          <div className="dark:border-gray-700 dark:bg-gray-800 rounded-xl border border-stroke bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-gray-100 dark:bg-gray-700 mb-4 rounded-full p-4">
                <MdSearch className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-gray-900 text-lg font-semibold dark:text-white">
                No Active Clients Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
                {apiResponse
                  ? 'API returned data but there are no active clients. Inactive or rejected clients are hidden.'
                  : 'No active client data is available. Try refreshing the page.'}
              </p>
              <button
                onClick={() => refetch()}
                className="hover:bg-primary-dark mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-white"
              >
                Refresh Data
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ClientDisplay;
