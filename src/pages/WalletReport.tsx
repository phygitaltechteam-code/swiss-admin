// WalletReport.tsx
import React, {useState, useMemo} from 'react';
import {
  MdPictureAsPdf,
  MdPrint,
  MdCalendarToday,
  MdExpandMore,
  MdSearch,
} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';
import StatsCard from '@/components/wallettopupreport/StatsCard';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {Transaction} from '@/components/wallettopupreport/types';

// Mock data - you can move this to a constants file
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'REQ-89021',
    requestId: '#REQ-89021',
    clientName: 'John Doe',
    clientInitials: 'JD',
    clientColor:
      'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
    accountType: 'E-Private',
    amount: 5000.0,
    date: 'Oct 24, 2023',
    paymentProof: {type: 'View', label: 'View'},
    status: 'Completed',
  },
  {
    id: 'REQ-89020',
    requestId: '#REQ-89020',
    clientName: 'Alice Smith',
    clientInitials: 'AS',
    clientColor:
      'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300',
    accountType: 'Temp',
    amount: 1200.0,
    date: 'Oct 24, 2023',
    paymentProof: {type: 'Image', label: 'Proof.jpg'},
    status: 'Pending',
  },
  {
    id: 'REQ-89019',
    requestId: '#REQ-89019',
    clientName: 'Robert Johnson',
    clientInitials: 'RJ',
    clientColor:
      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300',
    accountType: 'E-Private',
    amount: 15000.0,
    date: 'Oct 23, 2023',
    paymentProof: {type: 'PDF', label: 'Receipt.pdf'},
    status: 'Completed',
  },
  {
    id: 'REQ-89018',
    requestId: '#REQ-89018',
    clientName: 'Maria Williams',
    clientInitials: 'MW',
    clientColor:
      'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300',
    accountType: 'Temp',
    amount: 350.0,
    date: 'Oct 22, 2023',
    paymentProof: {type: 'Missing', label: 'Missing'},
    status: 'Rejected',
  },
  {
    id: 'REQ-89017',
    requestId: '#REQ-89017',
    clientName: 'David Brown',
    clientInitials: 'DB',
    clientColor:
      'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300',
    accountType: 'E-Private',
    amount: 2500.0,
    date: 'Oct 21, 2023',
    paymentProof: {type: 'View', label: 'Slip.png'},
    status: 'Completed',
  },
  {
    id: 'REQ-89016',
    requestId: '#REQ-89016',
    clientName: 'Sarah Miller',
    clientInitials: 'SM',
    clientColor:
      'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300',
    accountType: 'Corporate',
    amount: 75000.0,
    date: 'Oct 20, 2023',
    paymentProof: {type: 'PDF', label: 'Receipt.pdf'},
    status: 'Completed',
  },
  {
    id: 'REQ-89015',
    requestId: '#REQ-89015',
    clientName: 'Michael Wilson',
    clientInitials: 'MW',
    clientColor: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300',
    accountType: 'E-Private',
    amount: 3200.0,
    date: 'Oct 20, 2023',
    paymentProof: {type: 'Image', label: 'Proof.jpg'},
    status: 'Pending',
  },
  {
    id: 'REQ-89014',
    requestId: '#REQ-89014',
    clientName: 'Emma Davis',
    clientInitials: 'ED',
    clientColor:
      'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300',
    accountType: 'Temp',
    amount: 850.0,
    date: 'Oct 19, 2023',
    paymentProof: {type: 'Missing', label: 'Missing'},
    status: 'Rejected',
  },
  {
    id: 'REQ-89013',
    requestId: '#REQ-89013',
    clientName: 'James Taylor',
    clientInitials: 'JT',
    clientColor:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300',
    accountType: 'Corporate',
    amount: 45000.0,
    date: 'Oct 18, 2023',
    paymentProof: {type: 'View', label: 'View'},
    status: 'Completed',
  },
  {
    id: 'REQ-89012',
    requestId: '#REQ-89012',
    clientName: 'Olivia Anderson',
    clientInitials: 'OA',
    clientColor:
      'bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-300',
    accountType: 'E-Private',
    amount: 1800.0,
    date: 'Oct 17, 2023',
    paymentProof: {type: 'Image', label: 'Proof.jpg'},
    status: 'Pending',
  },
];

const WalletReport: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: '',
    accountType: 'All Account Types',
    status: 'All Statuses',
    search: '',
  });

  // Filter data
  const filteredData = useMemo(() => {
    let data = [...MOCK_TRANSACTIONS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (transaction) =>
          transaction.requestId.toLowerCase().includes(searchLower) ||
          transaction.clientName.toLowerCase().includes(searchLower) ||
          transaction.id.toLowerCase().includes(searchLower),
      );
    }

    // Apply status filter
    if (filters.status !== 'All Statuses') {
      data = data.filter(
        (transaction) => transaction.status === filters.status,
      );
    }

    // Apply account type filter
    if (filters.accountType !== 'All Account Types') {
      data = data.filter(
        (transaction) => transaction.accountType === filters.accountType,
      );
    }

    return data;
  }, [filters]);

  // Handle export to PDF
  const handleExportPDF = () => {
    console.log('Exporting to PDF:', filteredData);
    alert('PDF export functionality would be implemented here');
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Request ID',
      'Client Name',
      'Account Type',
      'Amount',
      'Payment Proof',
      'Status',
    ];
    const csvData = filteredData.map((transaction) => [
      transaction.date,
      transaction.requestId,
      transaction.clientName,
      transaction.accountType,
      `$${transaction.amount.toLocaleString()}`,
      transaction.paymentProof.label,
      transaction.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-topup-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle print
  const handlePrint = () => {
    const printContent = document.getElementById('wallet-report-content');
    const printWindow = window.open('', '_blank');
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Wallet Top-Up Report</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              body { font-family: 'Inter', sans-serif; margin: 20px; background: #fff; color: #000; }
              .print-header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0; }
              .print-header h1 { color: #0F1535; margin: 0; font-size: 28px; font-weight: 700; }
              .print-header p { color: #6B7280; margin: 5px 0 0; font-size: 14px; }
              .print-meta { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 13px; }
              .print-stats { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
              .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
              .stat-item { background: #fff; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
              th { background-color: #f8fafc; color: #6B7280; font-weight: 600; text-transform: uppercase; padding: 12px 15px; text-align: left; border-bottom: 2px solid #e5e7eb; }
              td { padding: 12px 15px; border-bottom: 1px solid #e5e7eb; }
              .client-avatar { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; margin-right: 8px; font-weight: bold; font-size: 12px; }
              .account-badge { display: inline-block; padding: 3px 10px; border-radius: 50px; background: #fff3e0; color: #f57c00; font-size: 11px; font-weight: 600; }
              .status { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; }
              .status-completed { background: #d1fae5; color: #065f46; }
              .status-pending { background: #fef3c7; color: #92400e; }
              .status-rejected { background: #fee2e2; color: #991b1b; }
              .proof-link { color: #f5813d; text-decoration: none; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6B7280; font-size: 12px; }
              @media print {
                body { margin: 0; padding: 20px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>Wallet Top-Up Report</h1>
              <p>Detailed log of all wallet funding requests, payment proofs, and verification status</p>
              <p>Generated on ${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
            </div>
            
            <div class="print-meta">
              <div>
                <strong>Date Range:</strong> ${filters.dateRange || 'Oct 1 - Oct 31, 2023'}<br>
                <strong>Account Type:</strong> ${filters.accountType}<br>
                <strong>Status:</strong> ${filters.status}
              </div>
              <div>
                <strong>Total Records:</strong> ${filteredData.length}<br>
                <strong>Total Amount:</strong> $${filteredData.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-US', {minimumFractionDigits: 2})}<br>
                <strong>Pending Approvals:</strong> ${filteredData.filter((t) => t.status === 'Pending').length}
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Request ID</th>
                  <th>Client Name</th>
                  <th>Account Type</th>
                  <th>Amount</th>
                  <th>Payment Proof</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData
                  .map((transaction) => {
                    // Extract color classes
                    const bgColor = transaction.clientColor.split(' ')[0];
                    const textColor =
                      transaction.clientColor.split(' ')[1] || '#000';

                    return `
                    <tr>
                      <td><strong>${transaction.date}</strong></td>
                      <td style="font-family: monospace; color: #f5813d;">${transaction.requestId}</td>
                      <td>
                        <div style="display: flex; align-items: center;">
                          <div class="client-avatar" style="background: ${bgColor}; color: ${textColor};">${transaction.clientInitials}</div>
                          ${transaction.clientName}
                        </div>
                      </td>
                      <td><span class="account-badge">${transaction.accountType}</span></td>
                      <td><strong>$${transaction.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
                      <td>
                        <a href="#" class="proof-link" onclick="return false;">
                          ${transaction.paymentProof.label}
                        </a>
                      </td>
                      <td>
                        <span class="status status-${transaction.status.toLowerCase()}">
                          ${transaction.status}
                        </span>
                      </td>
                    </tr>
                  `;
                  })
                  .join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Report generated by Admin Panel • Confidential Financial Data</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({...prev, [key]: value}));
  };

  // Define table columns for GenericTable
  const columns: Column<Transaction>[] = [
    {
      header: 'Date',
      accessor: 'date',
      render: (item: Transaction) => (
        <div className="text-header-text text-sm font-medium dark:text-white">
          {item.date}
        </div>
      ),
      className: 'min-w-[100px]',
      sortable: true,
    },
    {
      header: 'Request ID',
      accessor: 'requestId',
      render: (item: Transaction) => (
        <span className="font-mono text-sm text-primary dark:text-orange-400">
          {item.requestId}
        </span>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Client Name',
      accessor: 'clientName',
      render: (item: Transaction) => (
        <div className="flex items-center">
          <div
            className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${item.clientColor}`}
          >
            {item.clientInitials}
          </div>
          <div className="text-header-text text-sm font-medium dark:text-white">
            {item.clientName}
          </div>
        </div>
      ),
      className: 'min-w-[150px]',
      sortable: true,
    },
    {
      header: 'Account Type',
      accessor: 'accountType',
      render: (item: Transaction) => (
        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
          {item.accountType}
        </span>
      ),
      className: 'min-w-[100px]',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item: Transaction) => (
        <div className="text-header-text text-right text-sm font-bold dark:text-white">
          ${item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
        </div>
      ),
      className: 'min-w-[100px] text-right',
      sortable: true,
    },
    {
      header: 'Payment Proof',
      accessor: 'paymentProof',
      render: (item: Transaction) => {
        const getProofIcon = (type: string) => {
          switch (type) {
            case 'View':
              return <span className="mr-1">📎</span>;
            case 'Image':
              return <span className="mr-1">🖼️</span>;
            case 'PDF':
              return <span className="mr-1">📄</span>;
            case 'Missing':
              return <span className="mr-1">❌</span>;
            default:
              return null;
          }
        };

        return (
          <span
            className={`inline-flex items-center gap-1 text-sm font-medium ${
              item.paymentProof.type === 'Missing'
                ? 'text-gray-400 dark:text-gray-500'
                : 'cursor-pointer text-primary hover:text-blue-600 dark:text-orange-400'
            }`}
          >
            {getProofIcon(item.paymentProof.type)}
            {item.paymentProof.label}
          </span>
        );
      },
      className: 'min-w-[120px]',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item: Transaction) => {
        const statusStyles = {
          Completed:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
          Pending:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          Rejected:
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}
          >
            <span
              className={`size-1.5 rounded-full ${
                item.status === 'Completed'
                  ? 'bg-emerald-500'
                  : item.status === 'Pending'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            ></span>
            {item.status}
          </span>
        );
      },
      className: 'min-w-[100px]',
    },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen w-full">
      <div className="flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Wallet Top-Up Report
              </h2>
              <p className="text-secondary-text dark:text-gray-400 mt-1 text-sm">
                Detailed log of all wallet funding requests, payment proofs, and
                verification status
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportPDF}
                className="dark:bg-gray-800 dark:border-gray-700 text-header-text hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dce0e5] bg-white px-3 text-sm font-medium transition-colors dark:text-white"
              >
                <MdPictureAsPdf className="text-lg" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="dark:bg-gray-800 dark:border-gray-700 text-header-text hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dce0e5] bg-white px-3 text-sm font-medium transition-colors dark:text-white"
              >
                <FaFileCsv className="text-lg" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-orange-500 px-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <MdPrint className="text-lg" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Top-Ups Value"
              value="$4,850,240.00"
              trend="8.2%"
              trendDirection="up"
              subtext="vs last month"
              icon={<span className="text-xl">💰</span>}
            />
            <StatsCard
              title="Total Requests"
              value="1,245"
              trend="12.5%"
              trendDirection="up"
              subtext="volume increase"
              icon={<span className="text-xl">📋</span>}
            />
            <StatsCard
              title="Most Used Method"
              value="Bank Transfer"
              subtext="65% of total volume"
              icon={<span className="text-xl">🏦</span>}
              highlightValue
            />
            <StatsCard
              title="Pending Approval"
              value="24"
              icon={<span className="text-xl">⏳</span>}
              alert
            />
          </div>
        </div>

        {/* Filters and Table */}
        <div id="wallet-report-content" className="space-y-6">
          {/* Filters */}
          <div className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:bg-[#111a22]">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                {/* Date Picker */}
                <div className="relative min-w-[200px] flex-1 lg:flex-none">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdCalendarToday className="text-secondary-text text-lg" />
                  </div>
                  <input
                    type="text"
                    value={filters.dateRange}
                    onChange={(e) =>
                      handleFilterChange('dateRange', e.target.value)
                    }
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                    placeholder="Oct 1 - Oct 31, 2023"
                  />
                </div>

                {/* Account Type Dropdown */}
                <div className="relative min-w-[160px] flex-1 lg:flex-none">
                  <select
                    value={filters.accountType}
                    onChange={(e) =>
                      handleFilterChange('accountType', e.target.value)
                    }
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option>All Account Types</option>
                    <option>E-Private</option>
                    <option>Temp</option>
                    <option>Corporate</option>
                  </select>
                  <div className="text-secondary-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <MdExpandMore className="text-xl" />
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="relative min-w-[160px] flex-1 lg:flex-none">
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange('status', e.target.value)
                    }
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option>All Statuses</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                  <div className="text-secondary-text pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <MdExpandMore className="text-xl" />
                  </div>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdSearch className="text-secondary-text text-lg" />
                </div>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                  placeholder="Search client, ID..."
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <GenericTable
            data={filteredData}
            columns={columns}
            itemsPerPage={10}
            searchAble={false}
            title="Wallet Top-Up Transactions"
            action={false}
            paginationOff={false}
          />
        </div>
      </div>
    </div>
  );
};

export default WalletReport;
