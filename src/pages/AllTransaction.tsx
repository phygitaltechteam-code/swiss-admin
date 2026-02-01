// AllTransaction.tsx
import React, {useState, useMemo} from 'react';
import {FaFilePdf, FaFileCsv} from 'react-icons/fa6';
import {FiPrinter} from 'react-icons/fi';
import StatsCards from '@/components/alltransactionreports/StatsCards';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {
  STATS,
  TRANSACTIONS,
  Transaction,
} from '@/components/alltransactionreports/constants';

function AllTransaction() {
  const [filters, setFilters] = useState({
    dateRange: '',
    status: 'All Status',
    type: 'All Types',
    amount: 'Any Amount',
    search: '',
  });

  // Filter data
  const filteredData = useMemo(() => {
    let data = [...TRANSACTIONS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchLower) ||
          transaction.sender.name.toLowerCase().includes(searchLower) ||
          transaction.recipient.name.toLowerCase().includes(searchLower) ||
          transaction.note.toLowerCase().includes(searchLower),
      );
    }

    // Apply status filter
    if (filters.status !== 'All Status') {
      data = data.filter(
        (transaction) => transaction.status === filters.status,
      );
    }

    // Apply type filter
    if (filters.type !== 'All Types') {
      data = data.filter((transaction) => transaction.type === filters.type);
    }

    // Apply amount filter
    if (filters.amount !== 'Any Amount') {
      switch (filters.amount) {
        case '< $100':
          data = data.filter((transaction) => transaction.amount < 100);
          break;
        case '$100 - $1,000':
          data = data.filter(
            (transaction) =>
              transaction.amount >= 100 && transaction.amount <= 1000,
          );
          break;
        case '$1,000 - $10,000':
          data = data.filter(
            (transaction) =>
              transaction.amount >= 1000 && transaction.amount <= 10000,
          );
          break;
        case '> $10,000':
          data = data.filter((transaction) => transaction.amount > 10000);
          break;
      }
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
      'Time',
      'Transaction ID',
      'Sender Name',
      'Sender Account',
      'Recipient Name',
      'Recipient Account',
      'Type',
      'Amount',
      'Status',
      'Note',
    ];
    const csvData = filteredData.map((transaction) => [
      transaction.date,
      transaction.time,
      transaction.id,
      transaction.sender.name,
      transaction.sender.account,
      transaction.recipient.name,
      transaction.recipient.account,
      transaction.type,
      `$${transaction.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      transaction.status,
      transaction.note,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle print
  const handlePrint = () => {
    const printContent = document.getElementById('all-transactions-content');
    const printWindow = window.open('', '_blank');
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>All Transaction Reports</title>
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
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
              th { background-color: #f8fafc; color: #6B7280; font-weight: 600; text-transform: uppercase; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
              td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
              .type-badge { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; }
              .type-credit { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
              .type-debit { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
              .status-badge { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; }
              .status-success { background: #d1fae5; color: #065f46; }
              .status-failed { background: #fee2e2; color: #991b1b; }
              .status-pending { background: #fef3c7; color: #92400e; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6B7280; font-size: 12px; }
              @media print {
                body { margin: 0; padding: 20px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>All Transaction Reports</h1>
              <p>Comprehensive log of all financial activities, including successful and failed transactions</p>
              <p>Generated on ${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
            </div>
            
            <div class="print-meta">
              <div>
                <strong>Date Range:</strong> ${filters.dateRange || 'Oct 1 - Oct 31, 2023'}<br>
                <strong>Status:</strong> ${filters.status}<br>
                <strong>Type:</strong> ${filters.type}
              </div>
              <div>
                <strong>Total Records:</strong> ${filteredData.length}<br>
                <strong>Total Amount:</strong> $${filteredData.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-US', {minimumFractionDigits: 2})}<br>
                <strong>Filter:</strong> ${filters.amount}
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>TXN ID</th>
                  <th>Sender</th>
                  <th>Recipient</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Admin Note</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData
                  .map(
                    (transaction) => `
                  <tr>
                    <td>
                      <div><strong>${transaction.date}</strong></div>
                      <div style="color: #6B7280; font-size: 11px;">${transaction.time}</div>
                    </td>
                    <td style="font-family: monospace; color: #6B7280;">${transaction.id}</td>
                    <td>
                      <div><strong>${transaction.sender.name}</strong></div>
                      <div style="color: #6B7280; font-size: 11px;">${transaction.sender.account}</div>
                    </td>
                    <td>
                      <div><strong>${transaction.recipient.name}</strong></div>
                      <div style="color: #6B7280; font-size: 11px;">${transaction.recipient.account}</div>
                    </td>
                    <td>
                      <span class="type-badge type-${transaction.type.toLowerCase()}">
                        ${transaction.type}
                      </span>
                    </td>
                    <td><strong>$${transaction.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
                    <td>
                      <span class="status-badge status-${transaction.status.toLowerCase()}">
                        ${transaction.status}
                      </span>
                    </td>
                    <td style="color: #6B7280; font-style: italic;">${transaction.note}</td>
                  </tr>
                `,
                  )
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
      header: 'Date/Time',
      accessor: 'date',
      render: (item: Transaction) => (
        <div>
          <div className="text-header-text text-sm font-medium dark:text-white">
            {item.date}
          </div>
          <div className="text-secondary-text dark:text-gray-400 text-xs">
            {item.time}
          </div>
        </div>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'TXN ID',
      accessor: 'id',
      render: (item: Transaction) => (
        <span className="font-mono text-secondary-text dark:text-gray-400 text-sm">
          {item.id}
        </span>
      ),
      className: 'min-w-[120px]',
    },
    {
      header: 'Sender',
      accessor: 'sender',
      render: (item: Transaction) => (
        <div>
          <div className="text-header-text text-sm dark:text-white">
            {item.sender.name}
          </div>
          <div className="font-mono text-secondary-text dark:text-gray-400 text-xs">
            {item.sender.account}
          </div>
        </div>
      ),
      className: 'min-w-[140px]',
      sortable: true,
    },
    {
      header: 'Recipient',
      accessor: 'recipient',
      render: (item: Transaction) => (
        <div>
          <div className="text-header-text text-sm dark:text-white">
            {item.recipient.name}
          </div>
          <div className="font-mono text-secondary-text dark:text-gray-400 text-xs">
            {item.recipient.account}
          </div>
        </div>
      ),
      className: 'min-w-[140px]',
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (item: Transaction) => {
        const typeClasses =
          item.type === 'Credit'
            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
            : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';

        return (
          <span
            className={`inline-flex rounded border px-2 py-1 text-xs font-semibold leading-5 ${typeClasses}`}
          >
            {item.type}
          </span>
        );
      },
      className: 'min-w-[80px] text-center',
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
      header: 'Status',
      accessor: 'status',
      render: (item: Transaction) => {
        const statusStyles = {
          Success:
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          Failed:
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          Pending:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        };

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}
          >
            <span
              className={`size-1.5 rounded-full ${
                item.status === 'Success'
                  ? 'bg-green-500'
                  : item.status === 'Failed'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
              }`}
            ></span>
            {item.status}
          </span>
        );
      },
      className: 'min-w-[90px] text-center',
    },
    {
      header: 'Admin Note',
      accessor: 'note',
      render: (item: Transaction) => (
        <span className="text-secondary-text dark:text-gray-500 text-sm italic">
          {item.note}
        </span>
      ),
      className: 'min-w-[150px]',
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
                All Transaction Reports
              </h2>
              <p className="text-secondary-text dark:text-gray-400 mt-1 text-sm">
                Comprehensive log of all financial activities, including
                successful and failed transactions
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportPDF}
                className="dark:bg-gray-800 dark:border-gray-700 text-header-text hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dce0e5] bg-white px-3 text-sm font-medium transition-colors dark:text-white"
              >
                <FaFilePdf className="text-base" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="dark:bg-gray-800 dark:border-gray-700 text-header-text hover:bg-gray-50 dark:hover:bg-gray-700 flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dce0e5] bg-white px-3 text-sm font-medium transition-colors dark:text-white"
              >
                <FaFileCsv className="text-base" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-orange-500 px-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <FiPrinter className="text-base" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6">
          <StatsCards stats={STATS} />
        </div>

        {/* Filters and Table */}
        <div id="all-transactions-content" className="space-y-6">
          {/* Filters */}
          <div className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:bg-[#111a22]">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                {/* Date Picker */}
                <div className="relative min-w-[200px] flex-1 lg:flex-none">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-secondary-text dark:text-gray-400 text-lg">
                      📅
                    </span>
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

                {/* Status Select */}
                <div className="relative min-w-[140px] flex-1 lg:flex-none">
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange('status', e.target.value)
                    }
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option>All Status</option>
                    <option>Success</option>
                    <option>Pending</option>
                    <option>Failed</option>
                    <option>Reverted</option>
                  </select>
                  <div className="text-secondary-text dark:text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <span className="text-lg">⌄</span>
                  </div>
                </div>

                {/* Type Select */}
                <div className="relative min-w-[140px] flex-1 lg:flex-none">
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option>All Types</option>
                    <option>Credit</option>
                    <option>Debit</option>
                  </select>
                  <div className="text-secondary-text dark:text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <span className="text-lg">⌄</span>
                  </div>
                </div>

                {/* Amount Select */}
                <div className="relative min-w-[140px] flex-1 lg:flex-none">
                  <select
                    value={filters.amount}
                    onChange={(e) =>
                      handleFilterChange('amount', e.target.value)
                    }
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option>Any Amount</option>
                    <option>&lt; $100</option>
                    <option>$100 - $1,000</option>
                    <option>$1,000 - $10,000</option>
                    <option>&gt; $10,000</option>
                  </select>
                  <div className="text-secondary-text dark:text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <span className="text-lg">⌄</span>
                  </div>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-secondary-text dark:text-gray-400 text-lg">
                    🔍
                  </span>
                </div>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                  placeholder="Search TXN ID, User..."
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
            title="All Transactions"
            action={false}
            paginationOff={false}
          />
        </div>
      </div>
    </div>
  );
}

export default AllTransaction;
