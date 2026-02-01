// TransfersPage.tsx
import React, {useState, useMemo} from 'react';
import {MdPictureAsPdf, MdPrint, MdDownload} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';
import StatsCard from '@/components/transfersreport/StatsCard';
import TransferFilters from '@/components/transfersreport/TransferFilters';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {MOCK_TRANSFERS, Transfer} from '@/components/transfersreport/constants';

const TransfersPage: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: '',
    country: 'All Countries',
    status: 'All Statuses',
    search: '',
  });

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...MOCK_TRANSFERS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (transfer) =>
          transfer.transferId.toLowerCase().includes(searchLower) ||
          transfer.senderName.toLowerCase().includes(searchLower) ||
          transfer.beneficiaryName.toLowerCase().includes(searchLower) ||
          transfer.swiftIban.toLowerCase().includes(searchLower),
      );
    }

    // Apply status filter
    if (filters.status !== 'All Statuses') {
      data = data.filter((transfer) => transfer.status === filters.status);
    }

    // Apply country filter
    if (filters.country !== 'All Countries') {
      data = data.filter((transfer) =>
        transfer.beneficiaryLocation.includes(filters.country),
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
      'Time',
      'Transfer ID',
      'Sender Name',
      'Sender Account',
      'Beneficiary Name',
      'Beneficiary Location',
      'Bank Name',
      'SWIFT/IBAN',
      'Amount',
      'Fee',
      'Status',
    ];
    const csvData = filteredData.map((transfer) => [
      transfer.date,
      transfer.time,
      transfer.transferId,
      transfer.senderName,
      transfer.senderAccount,
      transfer.beneficiaryName,
      transfer.beneficiaryLocation,
      transfer.bankName,
      transfer.swiftIban,
      transfer.amount,
      transfer.fee,
      transfer.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transfers-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle print
  const handlePrint = () => {
    const printContent = document.getElementById('transfer-report-content');
    const printWindow = window.open('', '_blank');
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Transfers Report</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              body { font-family: 'Inter', sans-serif; margin: 20px; background: #fff; color: #000; }
              .print-header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0; }
              .print-header h1 { color: #0F1535; margin: 0; font-size: 28px; font-weight: 700; }
              .print-header p { color: #6B7280; margin: 5px 0 0; font-size: 14px; }
              .print-meta { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 13px; }
              .print-stats { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
              .print-stats h3 { margin: 0 0 15px; color: #0F1535; font-size: 16px; font-weight: 600; }
              .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
              .stat-item { background: #fff; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; }
              .stat-item p { margin: 0; }
              .stat-label { font-size: 12px; color: #6B7280; margin-bottom: 5px; }
              .stat-value { font-size: 24px; font-weight: 700; color: #0F1535; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
              th { background-color: #f8fafc; color: #6B7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 15px; text-align: left; border-bottom: 2px solid #e5e7eb; }
              td { padding: 12px 15px; border-bottom: 1px solid #e5e7eb; }
              tr:hover { background-color: #f9fafb; }
              .status { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; }
              .status-completed { background: #d1fae5; color: #065f46; }
              .status-pending { background: #fef3c7; color: #92400e; }
              .status-failed { background: #fee2e2; color: #991b1b; }
              .status-review { background: #dbeafe; color: #1e40af; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6B7280; font-size: 12px; }
              @media print {
                body { margin: 0; padding: 20px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>Transfers Report</h1>
              <p>Comprehensive log of internal and external money movements for Q4 2023</p>
              <p>Generated on ${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
            </div>
            
            <div class="print-meta">
              <div>
                <strong>Date Range:</strong> ${filters.dateRange || 'Oct 1 - Oct 31, 2023'}<br>
                <strong>Country:</strong> ${filters.country}<br>
                <strong>Status:</strong> ${filters.status}
              </div>
              <div>
                <strong>Total Records:</strong> ${filteredData.length}<br>
                <strong>Total Amount:</strong> $${filteredData.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-US', {minimumFractionDigits: 2})}<br>
                <strong>Total Fees:</strong> $${filteredData.reduce((sum, t) => sum + t.fee, 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
              </div>
            </div>
            
            <div class="print-stats">
              <h3>Summary Statistics</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <p class="stat-label">Total Sent</p>
                  <p class="stat-value">$${filteredData.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
                <div class="stat-item">
                  <p class="stat-label">Total Transactions</p>
                  <p class="stat-value">${filteredData.length}</p>
                </div>
                <div class="stat-item">
                  <p class="stat-label">Average Transfer</p>
                  <p class="stat-value">$${(filteredData.reduce((sum, t) => sum + t.amount, 0) / filteredData.length || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
                <div class="stat-item">
                  <p class="stat-label">Total Fees</p>
                  <p class="stat-value">$${filteredData.reduce((sum, t) => sum + t.fee, 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Transfer ID</th>
                  <th>Sender</th>
                  <th>Beneficiary</th>
                  <th>Bank</th>
                  <th>SWIFT/IBAN</th>
                  <th>Amount</th>
                  <th>Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData
                  .map(
                    (transfer) => `
                  <tr>
                    <td>
                      <div><strong>${transfer.date}</strong></div>
                      <div style="color: #6B7280; font-size: 11px;">${transfer.time}</div>
                    </td>
                    <td><strong style="color: #f5813d;">${transfer.transferId}</strong></td>
                    <td>
                      <div><strong>${transfer.senderName}</strong></div>
                      <div style="color: #6B7280; font-size: 11px;">${transfer.senderAccount}</div>
                    </td>
                    <td>
                      <div><strong>${transfer.beneficiaryName}</strong></div>
                      <div style="color: #6B7280; font-size: 11px;">${transfer.beneficiaryLocation}</div>
                    </td>
                    <td>${transfer.bankName}</td>
                    <td style="font-family: monospace; font-size: 11px;">${transfer.swiftIban}</td>
                    <td><strong>$${transfer.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
                    <td style="color: #6B7280;">$${transfer.fee.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td>
                      <span class="status status-${transfer.status.toLowerCase().replace(' ', '-')}">
                        ${transfer.status}
                      </span>
                    </td>
                  </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Report generated by Admin Panel • Page 1 of 1 • Confidential</p>
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
  const columns: Column<Transfer>[] = [
    {
      header: 'Date & Time',
      accessor: 'date',
      render: (item: Transfer) => (
        <div>
          <div className="text-header-text text-sm font-medium dark:text-white">
            {item.date}
          </div>
          <div className="text-secondary-text text-xs font-normal">
            {item.time}
          </div>
        </div>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Transfer ID',
      accessor: 'transferId',
      render: (item: Transfer) => (
        <span className="cursor-pointer text-primary hover:underline">
          {item.transferId}
        </span>
      ),
      className: 'min-w-[130px]',
    },
    {
      header: 'Sender',
      accessor: 'senderName',
      render: (item: Transfer) => (
        <div>
          <div className="text-header-text text-sm dark:text-white">
            {item.senderName}
          </div>
          <div className="text-secondary-text text-xs">
            {item.senderAccount}
          </div>
        </div>
      ),
      className: 'min-w-[150px]',
      sortable: true,
    },
    {
      header: 'Beneficiary',
      accessor: 'beneficiaryName',
      render: (item: Transfer) => (
        <div>
          <div className="text-header-text text-sm dark:text-white">
            {item.beneficiaryName}
          </div>
          <div className="text-secondary-text text-xs">
            {item.beneficiaryLocation}
          </div>
        </div>
      ),
      className: 'min-w-[150px]',
      sortable: true,
    },
    {
      header: 'Bank',
      accessor: 'bankName',
      render: (item: Transfer) => (
        <div className="text-header-text text-sm dark:text-white">
          {item.bankName}
        </div>
      ),
      className: 'min-w-[120px] hidden lg:table-cell',
    },
    {
      header: 'SWIFT/IBAN',
      accessor: 'swiftIban',
      render: (item: Transfer) => (
        <div className="font-mono text-secondary-text dark:text-gray-400 text-xs">
          {item.swiftIban}
        </div>
      ),
      className: 'min-w-[160px] hidden xl:table-cell',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item: Transfer) => (
        <div className="text-header-text text-sm font-bold dark:text-white">
          ${item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
        </div>
      ),
      className: 'min-w-[100px] text-right',
      sortable: true,
    },
    {
      header: 'Fee',
      accessor: 'fee',
      render: (item: Transfer) => (
        <div className="text-secondary-text dark:text-gray-500 text-right text-sm">
          ${item.fee.toLocaleString('en-US', {minimumFractionDigits: 2})}
        </div>
      ),
      className: 'min-w-[80px] text-right',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item: Transfer) => {
        const statusStyles = {
          Completed:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
          Pending:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          Failed:
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          'Under Review':
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        };

        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}
          >
            <span
              className={`size-1.5 rounded-full ${
                item.status === 'Completed'
                  ? 'bg-emerald-500'
                  : item.status === 'Pending'
                    ? 'bg-yellow-500'
                    : item.status === 'Failed'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
              }`}
            ></span>
            {item.status}
          </span>
        );
      },
      className: 'min-w-[110px]',
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
                Transfers Report
              </h2>
              <p className="text-secondary-text dark:text-gray-400 mt-1 text-sm">
                Comprehensive log of internal and external money movements for
                Q4 2023
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

        {/* Stats Card */}
        <div className="mb-6">
          <StatsCard />
        </div>

        {/* Filters and Table */}
        <div id="transfer-report-content" className="space-y-6">
          {/* Filters */}
          <div className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:bg-[#111a22]">
            <TransferFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Table */}
          <GenericTable
            data={filteredData}
            columns={columns}
            itemsPerPage={10}
            searchAble={false}
            title="Transfer Details"
            action={false}
            paginationOff={false}
          />
        </div>
      </div>
    </div>
  );
};

export default TransfersPage;
