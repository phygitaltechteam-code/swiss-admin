// TransfersPage.tsx
import React, {useState, useMemo} from 'react';
import {
  MdPictureAsPdf,
  MdPrint,
  MdDownload,
  MdPayments,
  MdSend,
  MdTrendingUp,
  MdArrowUpward,
} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';
import TransferFilters from '@/components/transfersreport/TransferFilters';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useGetPendingTransfers} from '@/lib/react-query/transfer';
import {TransactionTransfer} from '@/types/transactionhistory';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

interface Transfer {
  id: string;
  createdAt: string;
  time: string;
  transferId: string;
  senderName: string;
  senderAccount: string;
  beneficiaryName: string;
  beneficiaryLocation: string;
  bankName: string;
  swiftIban: string;
  amount: number;
  fee: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Under Review';
}

const TransfersPage: React.FC = () => {
  const {data: transfersData, isLoading, error} = useGetPendingTransfers();
  const [filters, setFilters] = useState({
    dateRange: '',
    country: 'All Countries',
    status: 'All Statuses',
    search: '',
  });

  // Transform API data to match the expected format
  const transformedData = useMemo(() => {
    if (!transfersData?.transactions) return [];

    return transfersData.transactions.map((transfer: TransactionTransfer) => {
      const date = new Date(transfer.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      let status: 'Completed' | 'Pending' | 'Failed' | 'Under Review';
      if (transfer.isRejected) {
        status = 'Failed';
      } else if (transfer.isPending) {
        status = 'Pending';
      } else {
        status = 'Completed';
      }

      const fee = transfer.amount * 0.01;

      return {
        id: transfer.id,
        createdAt: formattedDate,
        date: formattedDate,
        time: formattedTime,
        transferId: `#TRX-${transfer.id.slice(0, 8).toUpperCase()}`,
        senderName: transfer.fullname || 'N/A',
        senderAccount: `**** ${transfer.phoneNumber?.slice(-4) || '0000'}`,
        beneficiaryName:
          transfer.beneficiaryDetails?.fullName ||
          transfer.beneficiary ||
          'N/A',
        beneficiaryLocation: transfer.beneficiaryDetails?.country || 'N/A',
        bankName: transfer.beneficiaryDetails?.bankName || 'N/A',
        swiftIban:
          transfer.beneficiaryDetails?.SWIFTBIC ||
          transfer.beneficiaryDetails?.IFSC ||
          'N/A',
        amount: transfer.amount,
        fee: parseFloat(fee.toFixed(2)),
        status,
      };
    });
  }, [transfersData]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...transformedData];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (transfer) =>
          transfer.transferId.toLowerCase().includes(searchLower) ||
          transfer.senderName.toLowerCase().includes(searchLower) ||
          transfer.beneficiaryName.toLowerCase().includes(searchLower) ||
          transfer.swiftIban.toLowerCase().includes(searchLower) ||
          transfer.bankName.toLowerCase().includes(searchLower),
      );
    }

    // Apply status filter
    if (filters.status !== 'All Statuses') {
      data = data.filter((transfer) => transfer.status === filters.status);
    }

    // Apply country filter
    if (filters.country !== 'All Countries') {
      data = data.filter(
        (transfer) =>
          transfer.beneficiaryLocation.toLowerCase() ===
          filters.country.toLowerCase(),
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      const [startDateStr, endDateStr] = filters.dateRange.split(' - ');
      if (startDateStr && endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        data = data.filter((transfer) => {
          const transferDate = new Date(transfer.date);
          return transferDate >= startDate && transferDate <= endDate;
        });
      }
    }

    return data;
  }, [transformedData, filters]);

  // Calculate stats from filtered data
  const stats = useMemo(() => {
    if (!filteredData.length)
      return {
        totalAmount: 0,
        totalTransactions: 0,
        averageTransfer: 0,
        totalFees: 0,
        growth: 0,
      };

    const totalAmount = filteredData.reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = filteredData.length;
    const averageTransfer = totalAmount / totalTransactions;
    const totalFees = filteredData.reduce((sum, t) => sum + t.fee, 0);
    const growth = 18.2;

    return {
      totalAmount,
      totalTransactions,
      averageTransfer,
      totalFees,
      growth,
    };
  }, [filteredData]);

  // Handle export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Transfers Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Comprehensive log of internal and external money movements',
      14,
      30,
    );
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
      14,
      35,
    );

    // Meta information
    doc.setFontSize(9);
    doc.text(`Date Range: ${filters.dateRange || 'All Dates'}`, 14, 45);
    doc.text(`Country: ${filters.country}`, 14, 50);
    doc.text(`Status: ${filters.status}`, 14, 55);

    doc.text(`Total Records: ${filteredData.length}`, 200, 45);
    doc.text(
      `Total Amount: $${stats.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      200,
      50,
    );
    doc.text(
      `Total Fees: $${stats.totalFees.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      200,
      55,
    );

    // Stats
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text('Summary Statistics', 14, 65);

    // Stats table
    autoTable(doc, {
      startY: 70,
      head: [['Metric', 'Value']],
      body: [
        [
          'Total Sent',
          `$${stats.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
        ],
        ['Total Transactions', stats.totalTransactions.toString()],
        [
          'Average Transfer',
          `$${stats.averageTransfer.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
        ],
        [
          'Total Fees',
          `$${stats.totalFees.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
        ],
        ['Growth', `${stats.growth}%`],
      ],
      theme: 'grid',
      headStyles: {fillColor: [245, 129, 61], textColor: 255},
      styles: {fontSize: 9, cellPadding: 3},
      margin: {left: 14},
    });

    // Main data table
    const tableData = filteredData.map((transfer) => [
      `${transfer.date}\n${transfer.time}`,
      transfer.transferId,
      `${transfer.senderName}\n${transfer.senderAccount}`,
      `${transfer.beneficiaryName}\n${transfer.beneficiaryLocation}`,
      transfer.bankName,
      transfer.swiftIban,
      `$${transfer.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      `$${transfer.fee.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      transfer.status,
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [
        [
          'Date & Time',
          'Transfer ID',
          'Sender',
          'Beneficiary',
          'Bank',
          'SWIFT/IBAN',
          'Amount',
          'Fee',
          'Status',
        ],
      ],
      body: tableData,
      theme: 'grid',
      headStyles: {fillColor: [15, 21, 53], textColor: 255},
      styles: {fontSize: 8, cellPadding: 2},
      columnStyles: {
        0: {cellWidth: 25},
        1: {cellWidth: 25},
        2: {cellWidth: 30},
        3: {cellWidth: 30},
        4: {cellWidth: 25},
        5: {cellWidth: 30},
        6: {cellWidth: 20},
        7: {cellWidth: 15},
        8: {cellWidth: 20},
      },
      margin: {left: 14, right: 14},
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount} • Report generated by Admin Panel • Confidential`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        {align: 'center'},
      );
    }

    doc.save(`transfers-report-${new Date().toISOString().split('T')[0]}.pdf`);
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
      transfer.amount.toFixed(2),
      transfer.fee.toFixed(2),
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

  // Inside TransfersPage.tsx, replace the existing handlePrint function with this:

  const handlePrint = () => {
    if (filteredData.length === 0) {
      alert('No data to print. Adjust your filters and try again.');
      return;
    }

    // Current date/time (same format as other reports)
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

    // Build filter summary text
    const filterParts = [];
    if (filters.dateRange) filterParts.push(`Date: ${filters.dateRange}`);
    if (filters.country !== 'All Countries')
      filterParts.push(`Country: ${filters.country}`);
    if (filters.status !== 'All Statuses')
      filterParts.push(`Status: ${filters.status}`);
    if (filters.search) filterParts.push(`Search: "${filters.search}"`);
    const filterSummary = filterParts.length
      ? filterParts.join(' • ')
      : 'No filters applied';

    // Build table rows with alternating background
    const tableRows = filteredData
      .map(
        (transfer, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <div><strong>${transfer.date}</strong></div>
          <div style="color: #6B7280; font-size: 11px;">${transfer.time}</div>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; color: #f5813d;">${transfer.transferId}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <div><strong>${transfer.senderName}</strong></div>
          <div style="color: #6B7280; font-size: 11px;">${transfer.senderAccount}</div>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <div><strong>${transfer.beneficiaryName}</strong></div>
          <div style="color: #6B7280; font-size: 11px;">${transfer.beneficiaryLocation}</div>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${transfer.bankName}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${transfer.swiftIban}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">
          <strong>$${transfer.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right; color: #6B7280;">
          $${transfer.fee.toLocaleString('en-US', {minimumFractionDigits: 2})}
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 50px; font-size: 11px; font-weight: 600; background: ${
            transfer.status === 'Completed'
              ? '#d1fae5'
              : transfer.status === 'Pending'
                ? '#fef3c7'
                : transfer.status === 'Failed'
                  ? '#fee2e2'
                  : '#dbeafe'
          }; color: ${
            transfer.status === 'Completed'
              ? '#065f46'
              : transfer.status === 'Pending'
                ? '#92400e'
                : transfer.status === 'Failed'
                  ? '#991b1b'
                  : '#1e40af'
          };">
            ${transfer.status}
          </span>
        </td>
      </tr>
    `,
      )
      .join('');

    // Full HTML document with same styling as other reports
    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Transfers Report</title>
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
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Transfers Report</h1>
          <div class="header-row">
            <span>Generated: ${dateStr} ${timeStr}</span>
            <span>Total transfers: ${filteredData.length}</span>
          </div>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-title">Total Sent</div>
            <div class="stat-value">$${stats.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Transactions</div>
            <div class="stat-value">${stats.totalTransactions}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Average Transfer</div>
            <div class="stat-value">$${stats.averageTransfer.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Fees</div>
            <div class="stat-value">$${stats.totalFees.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          </div>
        </div>

        <div class="filter-summary">
          <strong>Applied filters:</strong> ${filterSummary}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
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
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          Printed from Transfer Management System
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

    // Small delay to ensure content is loaded before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 250);
  };
  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({...prev, [key]: value}));
  };

  // Responsive table columns
  const columns: Column<Transfer>[] = [
    {
      header: 'Date & Time',
      accessor: 'createdAt',
      render: (item: Transfer) => (
        <div>
          <div className="text-header-text text-sm font-medium dark:text-white">
            {item.createdAt}
          </div>
          <div className="text-secondary-text text-xs font-normal">
            {item.time}
          </div>
        </div>
      ),
      className: 'min-w-[100px] lg:min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Transfer ID',
      accessor: 'transferId',
      render: (item: Transfer) => (
        <span className="cursor-pointer text-sm text-primary hover:underline">
          {item.transferId}
        </span>
      ),
      className: 'min-w-[110px] lg:min-w-[130px]',
    },
    {
      header: 'Sender',
      accessor: 'senderName',
      render: (item: Transfer) => (
        <div>
          <div className="text-header-text line-clamp-1 text-sm dark:text-white">
            {item.senderName}
          </div>
          <div className="text-secondary-text text-xs">
            {item.senderAccount}
          </div>
        </div>
      ),
      className: 'min-w-[120px] lg:min-w-[150px]',
      sortable: true,
    },
    {
      header: 'Beneficiary',
      accessor: 'beneficiaryName',
      render: (item: Transfer) => (
        <div>
          <div className="text-header-text line-clamp-1 text-sm dark:text-white">
            {item.beneficiaryName}
          </div>
          <div className="text-secondary-text text-xs">
            {item.beneficiaryLocation}
          </div>
        </div>
      ),
      className: 'min-w-[120px] lg:min-w-[150px]',
      sortable: true,
    },
    {
      header: 'Bank',
      accessor: 'bankName',
      render: (item: Transfer) => (
        <div className="text-header-text line-clamp-1 text-sm dark:text-white">
          {item.bankName}
        </div>
      ),
      className: 'min-w-[100px] hidden md:table-cell',
    },
    {
      header: 'SWIFT/IBAN',
      accessor: 'swiftIban',
      render: (item: Transfer) => (
        <div className="font-mono text-secondary-text dark:text-gray-400 max-w-[120px] truncate text-xs">
          {item.swiftIban}
        </div>
      ),
      className: 'min-w-[100px] hidden lg:table-cell',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item: Transfer) => (
        <div className="text-header-text text-sm font-bold dark:text-white">
          ${item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
        </div>
      ),
      className: 'min-w-[80px] lg:min-w-[100px] text-right',
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
      className: 'min-w-[60px] lg:min-w-[80px] text-right',
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
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusStyles[item.status]}`}
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
            <span className="hidden sm:inline">{item.status}</span>
            <span className="sm:hidden">{item.status.charAt(0)}</span>
          </span>
        );
      },
      className: 'min-w-[70px] lg:min-w-[110px]',
    },
  ];

  // Get unique countries for filter dropdown
  const uniqueCountries = useMemo(() => {
    const countries = new Set(
      transformedData.map((t) => t.beneficiaryLocation).filter(Boolean),
    );
    return ['All Countries', ...Array.from(countries).sort()];
  }, [transformedData]);

  if (isLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Loading transfers...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-light dark:bg-background-dark flex min-h-screen w-full items-center justify-center">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Error loading transfers data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen w-full overflow-x-hidden">
      <div className="flex flex-col p-3 sm:p-4 lg:p-6 xl:p-8">
        {/* Header Section - Responsive */}
        <div className="mb-4 sm:mb-6">
          <div className="mb-3 flex flex-col justify-between gap-3 sm:mb-4 sm:gap-4 md:flex-row md:items-start">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-3xl">
                Transfers Report
              </h2>
              <p className="text-secondary-text dark:text-gray-400 mt-1 line-clamp-2 text-xs sm:text-sm">
                Comprehensive log of internal and external money movements
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2 md:mt-0">
              <button
                onClick={handleExportPDF}
                className="dark:bg-gray-800 dark:border-gray-700 text-header-text hover:bg-gray-50 dark:hover:bg-gray-700 flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dce0e5] bg-white px-2 text-xs font-medium transition-colors dark:text-white sm:h-9 sm:gap-2 sm:px-3 sm:text-sm md:h-10"
                title="Export PDF"
              >
                <MdPictureAsPdf className="text-base sm:text-lg" />
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="dark:bg-gray-800 dark:border-gray-700 text-header-text hover:bg-gray-50 dark:hover:bg-gray-700 flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dce0e5] bg-white px-2 text-xs font-medium transition-colors dark:text-white sm:h-9 sm:gap-2 sm:px-3 sm:text-sm md:h-10"
                title="Export CSV"
              >
                <FaFileCsv className="text-base sm:text-lg" />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg bg-orange-500 px-2 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90 sm:h-9 sm:gap-2 sm:px-3 sm:text-sm md:h-10"
                title="Print"
              >
                <MdPrint className="text-base sm:text-lg" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Card - Responsive */}
        <div className="mb-4 sm:mb-6">
          <div className="dark:border-gray-800 relative overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:bg-[#111a22] sm:p-6">
            <div className="pointer-events-none absolute right-0 top-0 p-2 opacity-5 dark:opacity-10 sm:p-4">
              <MdDownload className="-mr-4 -mt-4 rotate-[-45deg] text-[80px] sm:-mr-8 sm:-mt-8 sm:text-[140px]" />
            </div>

            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 sm:h-10 sm:w-10">
                      <MdPayments className="text-lg text-primary sm:text-xl" />
                    </div>
                    <p className="text-secondary-text dark:text-gray-400 truncate text-xs font-semibold sm:text-sm">
                      Total Sent
                    </p>
                  </div>
                  <p className="text-header-text truncate text-lg font-bold dark:text-white sm:text-xl lg:text-2xl xl:text-3xl">
                    $
                    {stats.totalAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Table */}
        <div id="transfer-report-content" className="space-y-4 sm:space-y-6">
          {/* Filters */}
          <div className="dark:border-gray-800 rounded-lg border border-[#e5e7eb] bg-white p-3 shadow-sm dark:bg-[#111a22] sm:rounded-xl sm:p-4">
            <TransferFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              countries={uniqueCountries}
            />
          </div>

          {/* Table */}
          <div className="dark:border-gray-800 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:bg-[#111a22] sm:rounded-xl">
            <div className="p-3 sm:p-4">
              <h3 className="text-header-text mb-3 text-base font-semibold dark:text-white sm:mb-4 sm:text-lg">
                Transfer Details
              </h3>
            </div>

            <div className="overflow-x-auto">
              <GenericTable
                data={filteredData}
                columns={columns}
                itemsPerPage={10}
                searchAble={false}
                title=""
                action={false}
                paginationOff={false}
                responsive={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransfersPage;
