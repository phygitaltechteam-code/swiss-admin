import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useGetClients} from '@/lib/react-query/client';
import React, {useState, useEffect, useMemo} from 'react';
import {
  MdDownload,
  MdAdd,
  MdSearch,
  MdFilterList,
  MdOutlineAccountBalance,
  MdPerson,
  MdAttachMoney,
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdTrendingUp,
  MdTrendingDown,
  MdPictureAsPdf,
  MdPrint,
  MdClose,
} from 'react-icons/md';

// Types based on your API response
interface ApiClient {
  id: string;
  userId: string;
  passport: string | null;
  aadharCard: string | null;
  panCard: string | null;
  passportNumber: string | null;
  aadharCardNumber: string | null;
  panCardNumber: string | null;
  accountNumber: string;
  address: string;
  city: string;
  photo: string;
  state: string;
  country: string;
  pincode: string;
  securityPin: string;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    fullname: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    dob: string | null;
    isVerified: boolean;
    isRejected: boolean;
  };
  wallets: Array<{
    eprivateAccount: number;
    temporyAccount: number;
  }>;
  _count: {
    senderTransactions: number;
  };
}

interface ClientRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
  transactions: number;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isRejected: boolean;
}

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
    <div className="dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-1 rounded-xl border border-stroke bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
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
      {/* <div className="mt-2 flex items-center gap-1">
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
      </div> */}
    </div>
  );
};

// Helper function to determine status
const getStatus = (client: ApiClient): string => {
  if (client.user.isRejected) return 'Rejected';
  if (!client.user.isActive) return 'Inactive';
  if (!client.user.isVerified) return 'Pending';
  return 'Active';
};

// Helper function to determine account type based on balance with million limit
const getAccountType = (balance: number): string => {
  // Limit to million (10,00,000)
  if (balance >= 1000000) return 'Premium';
  if (balance >= 500000) return 'Standard';
  if (balance >= 100000) return 'Basic';
  return 'Regular';
};

// Helper function to calculate total balance (in rupees)
const getTotalBalance = (client: ApiClient): number => {
  const balance =
    ((client.wallets?.[0]?.eprivateAccount || 0) +
      (client.wallets?.[0]?.temporyAccount || 0)) /
    100; // Convert from cents/paisa to rupees

  // Cap at 1 million for display purposes
  return Math.min(balance, 1000000);
};

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format compact currency for stats
const formatCompactCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

// Main Page Component
const ClientListReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Use the React Query hook to fetch clients
  const {data: apiResponse, isLoading, isError, error} = useGetClients();

  // Get the actual client data from API response
  const rawClientData: ApiClient[] = useMemo(() => {
    if (!apiResponse) {
      console.log('No API response yet');
      return [];
    }

    // Check different possible response structures
    if (Array.isArray(apiResponse)) {
      console.log('API response is already an array');
      return apiResponse;
    }

    if (apiResponse.data && Array.isArray(apiResponse.data)) {
      console.log('Found data array in apiResponse.data');
      return apiResponse.data;
    }

    console.log('Unexpected API response structure:', apiResponse);
    return [];
  }, [apiResponse]);

  // Calculate dynamic stats from the data
  const dynamicStats = useMemo(() => {
    const totalClients = rawClientData.length;

    // Calculate active clients (based on status)
    const activeClients = rawClientData.filter((client) => {
      const status = getStatus(client);
      return status === 'Active';
    }).length;

    // Calculate total balance (capped at 1 million per client for stats)
    const totalBalance = rawClientData.reduce((sum, client) => {
      return sum + getTotalBalance(client);
    }, 0);

    // Calculate average transactions per client
    const totalTransactions = rawClientData.reduce((sum, client) => {
      return sum + (client._count?.senderTransactions || 0);
    }, 0);

    const avgTransactions =
      totalClients > 0 ? totalTransactions / totalClients : 0;

    // Calculate verified clients
    const verifiedClients = rawClientData.filter(
      (client) => client.user?.isVerified,
    ).length;

    // Calculate premium clients (balance >= 1 million)
    const premiumClients = rawClientData.filter((client) => {
      const balance = getTotalBalance(client);
      return balance >= 1000000;
    }).length;

    // Calculate percentage changes (for demo)
    const clientGrowth = totalClients > 0 ? '+12%' : '+0%';
    const activeGrowth = activeClients > 0 ? '+8%' : '+0%';
    const balanceGrowth = totalBalance > 0 ? '+15%' : '+0%';
    const activityGrowth = avgTransactions > 0 ? '-2 days' : '0 days';

    return [
      {
        title: 'Total Clients',
        value: totalClients.toLocaleString('en-IN'),
        change: clientGrowth,
        changeLabel: 'vs last month',
        icon: MdPerson,
        color: 'bg-orange-100 text-orange-600',
        trend: 'up' as const,
      },
      {
        title: 'Active Clients',
        value: activeClients.toLocaleString('en-IN'),
        change: activeGrowth,
        changeLabel: 'vs last month',
        icon: MdOutlineAccountBalance,
        color: 'bg-orange-100 text-orange-600',
        trend: 'up' as const,
      },
      {
        title: 'Premium Clients',
        value: premiumClients.toLocaleString('en-IN'),
        change: '+5%',
        changeLabel: 'vs last month',
        icon: MdAttachMoney,
        color: 'bg-orange-100 text-orange-600',
        trend: 'up' as const,
      },
      {
        title: 'Avg. Transactions',
        value: avgTransactions.toFixed(1),
        change: activityGrowth,
        changeLabel: 'per client',
        icon: MdCalendarToday,
        color: 'bg-orange-100 text-orange-600',
        trend: activityGrowth.startsWith('-')
          ? ('down' as const)
          : ('up' as const),
      },
      {
        title: 'Verified Clients',
        value: verifiedClients.toLocaleString('en-IN'),
        change: '+5%',
        changeLabel: 'vs last month',
        icon: MdCheckCircle,
        color: 'bg-orange-100 text-orange-600',
        trend: 'up' as const,
      },
    ];
  }, [rawClientData]);

  // Transform API data to ClientRow format with million limit
  const clientData: ClientRow[] = useMemo(() => {
    console.log('Transforming', rawClientData.length, 'clients');

    return rawClientData.map((client) => {
      const balance = getTotalBalance(client);

      return {
        id: client.id,
        name: client.user?.fullname || 'N/A',
        email: client.user?.email || 'N/A',
        phone: client.user?.phoneNumber || 'N/A',
        city: client.city || 'N/A',
        state: client.state || 'N/A',
        accountNumber: client.accountNumber || 'N/A',
        accountType: getAccountType(balance),
        balance: balance, // Already capped at 1 million
        status: getStatus(client),
        transactions: client._count?.senderTransactions || 0,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        isVerified: client.user?.isVerified || false,
        isRejected: client.user?.isRejected || false,
      };
    });
  }, [rawClientData]);

  // Filter data
  const filteredData = useMemo(() => {
    return clientData.filter((item) => {
      // Search filter
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.phone.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Account type filter
      if (accountTypeFilter && accountTypeFilter !== '') {
        if (accountTypeFilter === 'premium' && item.accountType !== 'Premium')
          return false;
        if (accountTypeFilter === 'standard' && item.accountType !== 'Standard')
          return false;
        if (accountTypeFilter === 'basic' && item.accountType !== 'Basic')
          return false;
        if (accountTypeFilter === 'regular' && item.accountType !== 'Regular')
          return false;
      }

      // Status filter
      if (statusFilter && statusFilter !== '') {
        if (statusFilter === 'active' && item.status !== 'Active') return false;
        if (statusFilter === 'inactive' && item.status !== 'Inactive')
          return false;
        if (statusFilter === 'pending' && item.status !== 'Pending')
          return false;
        if (statusFilter === 'rejected' && item.status !== 'Rejected')
          return false;
      }

      return true;
    });
  }, [clientData, searchQuery, accountTypeFilter, statusFilter]);

  // Handle print
  const handlePrint = () => {
    if (filteredData.length === 0) {
      alert('No data to print. Adjust your filters and try again.');
      return;
    }

    // Compute stats from the filtered data
    const totalClients = filteredData.length;
    const activeClients = filteredData.filter(
      (c) => c.status === 'Active',
    ).length;
    const totalBalance = filteredData.reduce((sum, c) => sum + c.balance, 0);
    const avgTransactions =
      totalClients > 0
        ? filteredData.reduce((sum, c) => sum + c.transactions, 0) /
          totalClients
        : 0;
    const verifiedClients = filteredData.filter((c) => c.isVerified).length;
    const premiumClients = filteredData.filter(
      (c) => c.accountType === 'Premium',
    ).length;

    // Current date/time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Build filter summary
    const filterParts = [];
    if (searchQuery) filterParts.push(`Search: "${searchQuery}"`);
    if (accountTypeFilter && accountTypeFilter !== '')
      filterParts.push(
        `Account Type: ${accountTypeFilter.charAt(0).toUpperCase() + accountTypeFilter.slice(1)}`,
      );
    if (statusFilter && statusFilter !== '')
      filterParts.push(
        `Status: ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`,
      );
    const filterSummary = filterParts.length
      ? filterParts.join(' • ')
      : 'No filters applied';

    // Build table rows
    const tableRows = filteredData
      .map(
        (client, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <div><strong>${client.name}</strong></div>
          <div style="color: #6B7280; font-size: 11px;">${client.email}</div>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${client.phone}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${client.accountNumber}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${client.accountType}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">
          ${formatCurrency(client.balance)}
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 50px; font-size: 11px; font-weight: 600; background: ${
            client.status === 'Active'
              ? '#d1fae5'
              : client.status === 'Pending'
                ? '#fef3c7'
                : client.status === 'Rejected'
                  ? '#fee2e2'
                  : '#e5e7eb'
          }; color: ${
            client.status === 'Active'
              ? '#065f46'
              : client.status === 'Pending'
                ? '#92400e'
                : client.status === 'Rejected'
                  ? '#991b1b'
                  : '#374151'
          };">
            ${client.status}
          </span>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${client.transactions}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${new Date(client.createdAt).toLocaleDateString()}</td>
      </tr>
    `,
      )
      .join('');

    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Client List Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #111827; }
          h1 { color: #1e3a8a; font-size: 24px; margin-bottom: 4px; }
          .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 16px; }
          .header-row { display: flex; justify-content: space-between; align-items: center; }
          .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
          .stat-card { background: #f3f4f6; border-radius: 8px; padding: 12px 16px; flex: 1 0 180px; }
          .stat-title { font-size: 14px; color: #4b5563; }
          .stat-value { font-size: 24px; font-weight: bold; color: #1e3a8a; }
          .filter-summary { background: #eff6ff; padding: 10px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #ff7207; color: white; padding: 8px; text-align: left; }
          td { padding: 6px; border: 1px solid #e5e7eb; }
          .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: right; }
          @media print {
            body { margin: 0.5in; }
          }
          @media (max-width: 768px) {
            .stats { flex-direction: column; }
            .stat-card { width: 100%; }
            table { font-size: 10px; }
            td, th { padding: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Client List Report</h1>
          <div class="header-row">
            <span>Generated: ${dateStr} ${timeStr}</span>
            <span>Total clients: ${totalClients}</span>
          </div>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-title">Total Clients</div>
            <div class="stat-value">${totalClients}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Active Clients</div>
            <div class="stat-value">${activeClients}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Premium Clients</div>
            <div class="stat-value">${premiumClients}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Balance</div>
            <div class="stat-value">${formatCurrency(totalBalance)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Verified Clients</div>
            <div class="stat-value">${verifiedClients}</div>
          </div>
        </div>

        <div class="filter-summary">
          <strong>Applied filters:</strong> ${filterSummary}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Phone</th>
              <th>Account Number</th>
              <th>Account Type</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Transactions</th>
              <th>Join Date</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          Printed from Client Management System
        </div>
      </body>
    </html>
  `;

    const printWindow = window.open(
      '',
      '_blank',
      'width=1000,height=800,scrollbars=yes',
    );
    if (!printWindow) {
      alert('Popup blocked. Please allow popups to print.');
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 250);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setAccountTypeFilter('');
    setStatusFilter('');
  };

  // Define columns for GenericTable
  const columns: Column<ClientRow>[] = [
    {
      header: 'Client Name',
      accessor: 'name',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-semibold dark:text-white">
            {item.name}
          </span>
          <span className="text-gray-500 dark:text-gray-400 max-w-[150px] truncate text-xs sm:max-w-[200px]">
            {item.email}
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {item.isVerified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <MdCheckCircle className="h-2.5 w-2.5" />
                Verified
              </span>
            )}
            {item.isRejected && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <MdCancel className="h-2.5 w-2.5" />
                Rejected
              </span>
            )}
          </div>
        </div>
      ),
      className: 'min-w-[180px] sm:min-w-[220px]',
      sortable: true,
    },
    {
      header: 'Contact',
      accessor: 'phone',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm dark:text-white">
            {item.phone}
          </span>
          <span className="text-gray-500 dark:text-gray-400 max-w-[100px] truncate text-xs">
            {item.city}, {item.state}
          </span>
        </div>
      ),
      className: 'min-w-[120px] sm:min-w-[150px]',
    },
    {
      header: 'Account Details',
      accessor: 'accountNumber',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 max-w-[120px] truncate text-sm font-medium dark:text-white">
            {item.accountNumber}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {item.accountType}
          </span>
        </div>
      ),
      className: 'min-w-[120px] sm:min-w-[150px]',
    },
    {
      header: 'Balance',
      accessor: 'balance',
      render: (item) => (
        <span className="text-gray-900 text-sm font-bold dark:text-white">
          {formatCurrency(item.balance)}
        </span>
      ),
      className: 'min-w-[100px] sm:min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => {
        const statusColors = {
          Active:
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          Inactive:
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
          Pending:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          Rejected:
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };

        const colorClass =
          statusColors[item.status as keyof typeof statusColors] ||
          statusColors.Pending;

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}
          >
            {item.status}
          </span>
        );
      },
      className: 'min-w-[100px]',
    },
    {
      header: 'Transactions',
      accessor: 'transactions',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-medium dark:text-white">
            {item.transactions}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {item.transactions > 0 ? 'Completed' : 'No txns'}
          </span>
        </div>
      ),
      className: 'min-w-[100px] sm:min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Join Date',
      accessor: 'createdAt',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm dark:text-white">
            {new Date(item.createdAt).toLocaleDateString('en-IN')}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            Updated: {new Date(item.updatedAt).toLocaleDateString('en-IN')}
          </span>
        </div>
      ),
      className: 'min-w-[120px] sm:min-w-[150px]',
      sortable: true,
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading clients...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Error Loading Clients</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error?.message || 'Failed to load client data'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="hover:bg-primary-dark mt-4 rounded-lg bg-primary px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen w-full">
      <main className="flex min-h-screen flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:p-8">
          {/* Page Title & Actions */}
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl">
                Client List Report
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Comprehensive directory of all registered clients
              </p>
              {clientData.length > 0 && (
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs sm:text-sm">
                  Showing {filteredData.length} of {clientData.length} clients
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handlePrint}
                className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-orange-500 px-3 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
                title="Print"
              >
                <MdPrint className="text-base sm:text-lg" />
                <span className="xs:inline hidden">Print</span>
              </button>
            </div>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="xs:grid-cols-2 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-5">
            {dynamicStats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>

          {/* Table Section */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Filter Bar - Responsive */}
            <div className="dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-3 bg-white p-3 shadow-sm sm:p-4">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3">
                  {/* Search - Full width on mobile */}
                  <div className="relative w-full sm:w-auto sm:min-w-[250px] lg:min-w-[300px]">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MdSearch className="text-gray-400" size={18} />
                    </div>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2 pl-9 pr-3 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white sm:text-sm"
                      placeholder="Search by name, email, account..."
                      type="text"
                    />
                  </div>

                  {/* Account Type Filter */}
                  <div className="relative w-full sm:w-auto">
                    <select
                      value={accountTypeFilter}
                      onChange={(e) => setAccountTypeFilter(e.target.value)}
                      className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2 pl-3 pr-8 text-xs focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="premium">Premium (₹1M+)</option>
                      <option value="standard">Standard (₹5L-₹1M)</option>
                      <option value="basic">Basic (₹1L-₹5L)</option>
                      <option value="regular">Regular (Below ₹1L)</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="relative w-full sm:w-auto">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2 pl-3 pr-8 text-xs focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(searchQuery || accountTypeFilter || statusFilter) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-gray-600 flex items-center gap-1 whitespace-nowrap text-xs hover:text-primary sm:text-sm"
                  >
                    <MdClose className="text-base" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Generic Table Container - Responsive */}
            <div className="dark:border-gray-700 dark:bg-gray-800 overflow-hidden bg-white shadow-sm">
              <div className="flex-1 overflow-x-auto">
                {clientData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center sm:p-8">
                    <svg
                      className="text-gray-400 mb-3 h-10 w-10 sm:mb-4 sm:h-12 sm:w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-gray-900 mb-1 text-base font-medium sm:mb-2 sm:text-lg">
                      No clients found
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      No data loaded from API. Check console for details.
                    </p>
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center sm:p-8">
                    <svg
                      className="text-gray-400 mb-3 h-10 w-10 sm:mb-4 sm:h-12 sm:w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-gray-900 mb-1 text-base font-medium sm:mb-2 sm:text-lg">
                      No matching clients
                    </h3>
                    <p className="text-gray-500 mb-3 text-xs sm:mb-4 sm:text-sm">
                      Try adjusting your search or filters
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <GenericTable
                    data={filteredData}
                    columns={columns}
                    searchAble={false}
                    itemsPerPage={10}
                    viewTooltip="View Client Details"
                    editTooltip="Edit Client"
                    deleteTooltip="Delete Client"
                    variant="default"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientListReport;
