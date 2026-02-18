// AllTransaction.tsx
import React, {useState, useMemo} from 'react';
import {
  FaFilePdf,
  FaFileCsv,
  FaChartArea,
  FaChartLine,
  FaHourglassHalf,
} from 'react-icons/fa6';
import {FiPrinter} from 'react-icons/fi';
import StatsCards from '@/components/alltransactionreports/StatsCards';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useGetAllTransaction} from '@/lib/react-query/alltransaction';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import {MdPieChart, MdSearch} from 'react-icons/md';
import {FaCheckCircle, FaTimesCircle} from 'react-icons/fa';

// Define the Transaction interface based on your API response
interface Transaction {
  id: string;
  particular: string;
  amount: number;
  amountType: string;
  type: 'CREDIT' | 'DEBIT';
  isPending: boolean;
  isRejected: boolean;
  rejectReason?: string | null;
  createdAt: string;
  fullname?: string;
  email?: string;
  phoneNumber?: string;
  beneficiary?: {
    fullName: string;
    accountNumber: string;
  } | null;
  accountType: 'E_PRIVATEACCOUNT' | 'E_TEMPORYACCOUNT';
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper function to format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Calculate stats from API data
const calculateStats = (transactions: Transaction[]) => {
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successfulTransactions = transactions.filter(
    (t) => !t.isPending && !t.isRejected,
  ).length;
  const pendingTransactions = transactions.filter((t) => t.isPending).length;
  const failedTransactions = transactions.filter((t) => t.isRejected).length;
  const creditAmount = transactions
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);
  const debitAmount = transactions
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalTransactions,
    totalAmount,
    successfulTransactions,
    pendingTransactions,
    failedTransactions,
    creditAmount,
    debitAmount,
  };
};

function AllTransaction() {
  const {data: transactionData, isLoading, error} = useGetAllTransaction();

  console.log('Full API Response:', transactionData); // Debug log
  console.log('Error:', error); // Debug log

  // Access the data from API response - FIXED: Check the correct path
  const transactions: Transaction[] = useMemo(() => {
    if (!transactionData) return [];

    // Check different possible structures
    if (Array.isArray(transactionData)) {
      return transactionData;
    } else if (transactionData.data && Array.isArray(transactionData.data)) {
      return transactionData.data;
    } else if (
      transactionData.data &&
      transactionData.data.data &&
      Array.isArray(transactionData.data.data)
    ) {
      return transactionData.data.data;
    }

    console.warn('Unexpected API response structure:', transactionData);
    return [];
  }, [transactionData]);

  console.log('Processed Transactions:', transactions); // Debug log

  // Calculate stats from API data
  const stats = useMemo(() => {
    const statsData = calculateStats(transactions);

    const statsArray = [
      {
        title: 'Total Transactions',
        value: statsData.totalTransactions.toString(),
        change: '+12.5%',
        changeType: 'increase',
        icon: <MdPieChart />,
        trend: '+12.5',
        trendDirection: 'up',
        trendLabel: 'from last month',
        type: 'volume',
      },
      {
        title: 'Total Amount',
        value: `$${statsData.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
        change: '+8.3%',
        changeType: 'increase',
        icon: <FaFilePdf />,
        trend: '+8.3',
        trendDirection: 'up',
        trendLabel: 'from last month',
        type: 'volume',
      },
      {
        title: 'Successful',
        value: statsData.successfulTransactions.toString(),
        change: '+5.2%',
        changeType: 'increase',
        icon: <FaCheckCircle />,
        trend: '+5.2',
        trendDirection: 'up',
        trendLabel: 'success rate',
        type: 'success',
      },
      {
        title: 'Pending',
        value: statsData.pendingTransactions.toString(),
        change: '+2.1%',
        changeType: 'increase',
        icon: <FaHourglassHalf />,
        trend: '+2.1',
        trendDirection: 'up',
        trendLabel: 'awaiting processing',
        type: 'pending',
      },
      {
        title: 'Failed',
        value: statsData.failedTransactions.toString(),
        change: '-1.8%',
        changeType: 'decrease',
        icon: <FaTimesCircle />,
        trend: '-1.8',
        trendDirection: 'down',
        trendLabel: 'failure rate',
        type: 'failed',
      },
      {
        title: 'Total Credits',
        value: `$${statsData.creditAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
        change: '+15.7%',
        changeType: 'increase',
        icon: <FaChartLine />,
        trend: '+15.7',
        trendDirection: 'up',
        trendLabel: 'credit volume',
        type: 'success',
      },
      {
        title: 'Total Debits',
        value: `$${statsData.debitAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
        change: '+10.2%',
        changeType: 'increase',
        icon: <FaChartArea />,
        trend: '+10.2',
        trendDirection: 'up',
        trendLabel: 'debit volume',
        type: 'pending',
      },
    ];

    return statsArray;
  }, [transactions]);

  const [filters, setFilters] = useState({
    dateRange: '',
    status: 'All Status',
    type: 'All Types',
    amount: 'Any Amount',
    search: '',
  });

  // Filter data
  const filteredData = useMemo(() => {
    let data = [...transactions];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchLower) ||
          transaction.particular.toLowerCase().includes(searchLower) ||
          transaction.beneficiary?.fullName
            ?.toLowerCase()
            .includes(searchLower) ||
          false ||
          transaction.rejectReason?.toLowerCase().includes(searchLower) ||
          false ||
          transaction.fullname?.toLowerCase().includes(searchLower) ||
          false ||
          transaction.email?.toLowerCase().includes(searchLower) ||
          false,
      );
    }

    // Apply status filter
    if (filters.status !== 'All Status') {
      switch (filters.status) {
        case 'Success':
          data = data.filter((t) => !t.isPending && !t.isRejected);
          break;
        case 'Pending':
          data = data.filter((t) => t.isPending);
          break;
        case 'Failed':
          data = data.filter((t) => t.isRejected);
          break;
        case 'Reverted':
          data = data.filter((t) => t.isRejected);
          break;
      }
    }

    // Apply type filter
    if (filters.type !== 'All Types') {
      data = data.filter(
        (transaction) =>
          transaction.type.toLowerCase() === filters.type.toLowerCase(),
      );
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
  }, [transactions, filters]);

  // Handle export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');

    // Title
    doc.setFontSize(20);
    doc.setTextColor(15, 21, 53);
    doc.text('All Transaction Reports', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(
      'Comprehensive log of all financial activities, including successful and failed transactions',
      14,
      28,
    );
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}`,
      14,
      35,
    );

    // Stats summary
    const statsData = calculateStats(filteredData);
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text('Summary Statistics', 14, 45);

    doc.setFontSize(9);
    doc.text(`Total Transactions: ${statsData.totalTransactions}`, 14, 55);
    doc.text(
      `Total Amount: $${statsData.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      14,
      61,
    );
    doc.text(`Successful: ${statsData.successfulTransactions}`, 14, 67);
    doc.text(`Pending: ${statsData.pendingTransactions}`, 14, 73);
    doc.text(`Failed: ${statsData.failedTransactions}`, 14, 79);

    // Filter info
    doc.text(`Filters Applied:`, 200, 55);
    doc.text(`Status: ${filters.status}`, 200, 61);
    doc.text(`Type: ${filters.type}`, 200, 67);
    doc.text(`Amount: ${filters.amount}`, 200, 73);
    doc.text(`Records: ${filteredData.length}`, 200, 79);

    // Table data
    const tableData = filteredData.map((transaction) => [
      formatDate(transaction.createdAt) +
        ' ' +
        formatTime(transaction.createdAt),
      transaction.id.substring(0, 8) + '...',
      transaction.particular,
      transaction.fullname || 'N/A',
      transaction.email || 'N/A',
      transaction.beneficiary?.fullName || 'N/A',
      transaction.beneficiary?.accountNumber || 'N/A',
      transaction.type,
      `$${transaction.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      transaction.amountType,
      transaction.isPending
        ? 'Pending'
        : transaction.isRejected
          ? 'Failed'
          : 'Success',
      transaction.accountType
        .replace('E_PRIVATEACCOUNT', 'Private')
        .replace('E_TEMPORYACCOUNT', 'Temporary'),
      transaction.rejectReason || 'N/A',
    ]);

    // Table headers
    const headers = [
      [
        'Date/Time',
        'TXN ID',
        'Particular',
        'Sender Name',
        'Sender Email',
        'Beneficiary',
        'Account No.',
        'Type',
        'Amount',
        'Currency',
        'Status',
        'Account Type',
        'Note',
      ],
    ];

    // Add table
    (doc as any).autoTable({
      head: headers,
      body: tableData,
      startY: 85,
      theme: 'grid',
      headStyles: {
        fillColor: [248, 250, 252],
        textColor: [107, 114, 128],
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    // Save PDF
    doc.save(
      `transactions-report-${new Date().toISOString().split('T')[0]}.pdf`,
    );
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Time',
      'Transaction ID',
      'Particular',
      'Sender Name',
      'Sender Email',
      'Beneficiary Name',
      'Beneficiary Account',
      'Type',
      'Amount',
      'Amount Type',
      'Status',
      'Account Type',
      'Reject Reason',
    ];

    const csvData = filteredData.map((transaction) => [
      formatDate(transaction.createdAt),
      formatTime(transaction.createdAt),
      transaction.id,
      transaction.particular,
      transaction.fullname || 'N/A',
      transaction.email || 'N/A',
      transaction.beneficiary?.fullName || 'N/A',
      transaction.beneficiary?.accountNumber || 'N/A',
      transaction.type,
      transaction.amount.toString(),
      transaction.amountType,
      transaction.isPending
        ? 'Pending'
        : transaction.isRejected
          ? 'Failed'
          : 'Success',
      transaction.accountType,
      transaction.rejectReason || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (filteredData.length === 0) {
      alert('No data to print. Adjust your filters and try again.');
      return;
    }

    // Compute stats from the filtered data
    const statsData = calculateStats(filteredData);
    const total = filteredData.length;
    const successful = statsData.successfulTransactions;
    const pending = statsData.pendingTransactions;
    const failed = statsData.failedTransactions;
    const totalAmount = statsData.totalAmount;

    // Helper to get status text (same as in table column)
    const getStatusText = (item: Transaction) => {
      if (item.isPending) return 'Pending';
      if (item.isRejected) return 'Failed';
      return 'Success';
    };

    // Build table rows
    const tableRows = filteredData
      .map(
        (item, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <div><strong>${formatDate(item.createdAt)}</strong></div>
          <div style="color: #6B7280; font-size: 11px;">${formatTime(item.createdAt)}</div>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 11px;">${item.id.substring(0, 8)}...</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.particular}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <div><strong>${item.fullname || 'N/A'}</strong></div>
          <div style="color: #6B7280; font-size: 11px;">${item.email || ''}</div>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          ${item.beneficiary ? `<div><strong>${item.beneficiary.fullName}</strong></div><div style="color: #6B7280; font-size: 11px;">${item.beneficiary.accountNumber}</div>` : '<span style="color: #9CA3AF;">N/A</span>'}
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: ${item.type === 'CREDIT' ? '#dbeafe' : '#fef3c7'}; color: ${item.type === 'CREDIT' ? '#1e40af' : '#92400e'};">${item.type}</span>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">
          <strong>$${item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>
          <div style="color: #6B7280; font-size: 11px;">${item.amountType}</div>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 50px; font-size: 11px; font-weight: 600; background: ${item.isPending ? '#fef3c7' : item.isRejected ? '#fee2e2' : '#d1fae5'}; color: ${item.isPending ? '#92400e' : item.isRejected ? '#991b1b' : '#065f46'};">${getStatusText(item)}</span>
        </td>
      </tr>
    `,
      )
      .join('');

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

    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Transaction Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #111827; }
          h1 { color: #1e3a8a; font-size: 24px; margin-bottom: 4px; }
          .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 16px; }
          .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
          .stat-card { background: #f3f4f6; border-radius: 8px; padding: 12px 16px; flex: 1 0 180px; }
          .stat-title { font-size: 14px; color: #4b5563; }
          .stat-value { font-size: 24px; font-weight: bold; color: #1e3a8a; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #ff7207; color: white; padding: 8px; text-align: left; }
          td { padding: 6px; border: 1px solid #e5e7eb; }
          .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: right; }
          @media print {
            body { margin: 0.5in; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Transaction Report</h1>
          <div style="display: flex; justify-content: space-between;">
            <span>Generated: ${dateStr} ${timeStr}</span>
            <span>Total records: ${total}</span>
          </div>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-title">Total Transactions</div>
            <div class="stat-value">${total}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Amount</div>
            <div class="stat-value">$${totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Successful</div>
            <div class="stat-value">${successful}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Pending</div>
            <div class="stat-value">${pending}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Failed</div>
            <div class="stat-value">${failed}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date/Time</th>
              <th>TXN ID</th>
              <th>Particular</th>
              <th>Sender</th>
              <th>Beneficiary</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          Printed from Transaction Management System
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

    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({...prev, [key]: value}));
  };

  // Define table columns for GenericTable
  const columns: Column<Transaction>[] = [
    {
      header: 'Date/Time',
      accessor: 'createdAt',
      render: (item: Transaction) => (
        <div>
          <div className="text-header-text text-sm font-medium dark:text-white">
            {formatDate(item.createdAt)}
          </div>
          <div className="text-secondary-text dark:text-gray-400 text-xs">
            {formatTime(item.createdAt)}
          </div>
        </div>
      ),
      className: 'min-w-[130px]',
      sortable: true,
    },
    {
      header: 'TXN ID',
      accessor: 'id',
      render: (item: Transaction) => (
        <span
          className="font-mono text-secondary-text dark:text-gray-400 text-xs"
          title={item.id}
        >
          {item.id.substring(0, 8)}...
        </span>
      ),
      className: 'min-w-[100px]',
    },
    {
      header: 'Particular',
      accessor: 'particular',
      render: (item: Transaction) => (
        <div className="text-header-text text-sm dark:text-white">
          {item.particular}
        </div>
      ),
      className: 'min-w-[180px]',
    },
    {
      header: 'Sender',
      accessor: 'fullname',
      render: (item: Transaction) => (
        <div>
          <div className="text-header-text text-sm dark:text-white">
            {item.fullname || 'N/A'}
          </div>
          <div className="text-secondary-text dark:text-gray-400 text-xs">
            {item.email || 'N/A'}
          </div>
        </div>
      ),
      className: 'min-w-[160px]',
    },
    {
      header: 'Beneficiary',
      accessor: 'beneficiary',
      render: (item: Transaction) => (
        <div>
          {item.beneficiary ? (
            <>
              <div className="text-header-text text-sm dark:text-white">
                {item.beneficiary.fullName}
              </div>
              <div className="font-mono text-secondary-text dark:text-gray-400 text-xs">
                {item.beneficiary.accountNumber}
              </div>
            </>
          ) : (
            <div className="text-secondary-text dark:text-gray-500 text-sm italic">
              N/A
            </div>
          )}
        </div>
      ),
      className: 'min-w-[160px]',
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (item: Transaction) => {
        const typeClasses =
          item.type === 'CREDIT'
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
        <div className="text-right">
          <div className="text-header-text text-sm font-bold dark:text-white">
            ${item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
          </div>
          <div className="text-secondary-text dark:text-gray-400 text-xs">
            {item.amountType}
          </div>
        </div>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item: Transaction) => {
        const status = item.isPending
          ? 'Pending'
          : item.isRejected
            ? 'Failed'
            : 'Success';
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
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
          >
            <span
              className={`size-1.5 rounded-full ${
                status === 'Success'
                  ? 'bg-green-500'
                  : status === 'Failed'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
              }`}
            ></span>
            {status}
          </span>
        );
      },
      className: 'min-w-[100px] text-center',
    },
    {
      header: 'Account Type',
      accessor: 'accountType',
      render: (item: Transaction) => {
        const accountType =
          item.accountType === 'E_PRIVATEACCOUNT' ? 'Private' : 'Temporary';
        return (
          <span className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
            {accountType}
          </span>
        );
      },
      className: 'min-w-[100px] text-center',
    },
    {
      header: 'Note',
      accessor: 'rejectReason',
      render: (item: Transaction) => (
        <span
          className="text-secondary-text dark:text-gray-500 text-sm italic"
          title={item.rejectReason || ''}
        >
          {item.rejectReason || 'N/A'}
        </span>
      ),
      className: 'min-w-[150px]',
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-light dark:bg-background-dark flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <span className="text-2xl">❌</span>
          </div>
          <h3 className="text-gray-900 mb-2 text-lg font-medium dark:text-white">
            Error loading transactions
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Failed to load transaction data. Please try again.
          </p>
        </div>
      </div>
    );
  }

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
          <StatsCards stats={stats} />
        </div>

        {/* Filters and Table */}
        <div id="all-transactions-content" className="space-y-6">
          {/* Filters */}
          <div className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:bg-[#111a22]">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
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
                    <option>CREDIT</option>
                    <option>DEBIT</option>
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
                    <MdSearch />
                  </span>
                </div>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                  placeholder="Search TXN ID, Particular..."
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white shadow-sm dark:bg-[#111a22]">
            <div className="p-4">
              <h3 className="text-header-text mb-4 text-lg font-semibold dark:text-white">
                All Transactions ({filteredData.length} records)
              </h3>
              <GenericTable
                data={filteredData}
                columns={columns}
                itemsPerPage={10}
                searchAble={false}
                action={false}
                paginationOff={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllTransaction;
