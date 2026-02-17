import React, {useState, useMemo} from 'react';
import {MdPrint} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';
import StatsCard from '@/components/transactionreport/StatsCard';
import ChartSection from '@/components/transactionreport/ChartSection';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useGetAllTransactions} from '@/lib/react-query/transfer';

// ------------------------------------------------------------------
// 1. TYPES
// ------------------------------------------------------------------
interface ApiTransaction {
  id: string;
  walletId: string;
  particular: string;
  receiverId: string | null;
  senderId: string;
  beneficiaryId: string | null;
  amount: number; // cents
  fee: number; // cents
  amountType: string;
  accountType: string;
  type: 'DEBIT' | 'CREDIT';
  category: string;
  rejectReason: string | null;
  isPending: boolean;
  isRejected: boolean;
  createdAt: string;
  updatedAt: string;
  beneficiary: any | null;
  fullname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  dob: string;
  isVerified: boolean;
}

interface DisplayTransaction {
  date: string;
  transactionId: string;
  clientName: string;
  transactionType: string;
  amount: number; // dollars
  feeType: string;
  totalFeeCharged: number; // dollars
}

// ------------------------------------------------------------------
// 2. TRANSFORMER
// ------------------------------------------------------------------
const mapApiToDisplay = (tx: ApiTransaction): DisplayTransaction => {
  const date = new Date(tx.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  let transactionType = tx.category || 'Transfer';
  if (tx.type === 'CREDIT' && tx.particular?.toLowerCase().includes('topup')) {
    transactionType = 'Top-up';
  } else if (tx.type === 'DEBIT' && tx.beneficiaryId) {
    transactionType = 'Sent Money';
  }

  const feeType = tx.fee > 0 ? 'Transfer Fee' : 'No Fee';

  const amountInDollars = tx.amount / 100;
  const feeInDollars = tx.fee / 100;

  return {
    date,
    transactionId: tx.id,
    clientName: tx.fullname,
    transactionType,
    amount: amountInDollars,
    feeType,
    totalFeeCharged: feeInDollars,
  };
};

// ------------------------------------------------------------------
// 3. MAIN COMPONENT
// ------------------------------------------------------------------
const TransactionReport: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: '',
    type: 'All Types',
    search: '',
  });

  // ---------- FETCH REAL DATA ----------
  const {data: response, isLoading, error} = useGetAllTransactions();

  // ---------- SAFELY EXTRACT THE ARRAY ----------

  const rawTransactions = useMemo(() => {
    if (Array.isArray(response)) {
      // Case 1: Direct array
      return response;
    }

    if (response && typeof response === 'object' && 'data' in response) {
      const maybeArray = (response as any).data;
      return Array.isArray(maybeArray) ? maybeArray : [];
    }
    return [];
  }, [response]);

  // ---------- TRANSFORM ----------
  const allTransactions = useMemo<DisplayTransaction[]>(() => {
    const transformed = rawTransactions.map(mapApiToDisplay);

    return transformed;
  }, [rawTransactions]);

  // ---------- UNIQUE TYPES ----------
  const transactionTypes = useMemo(() => {
    const types = allTransactions.map((tx) => tx.transactionType);
    return ['All Types', ...new Set(types)];
  }, [allTransactions]);

  // ---------- FILTER LOGIC ----------
  const filteredData = useMemo(() => {
    let data = [...allTransactions];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (tx) =>
          tx.transactionId.toLowerCase().includes(searchLower) ||
          tx.clientName.toLowerCase().includes(searchLower),
      );
    }

    if (filters.type !== 'All Types') {
      data = data.filter((tx) => tx.transactionType === filters.type);
    }

    return data;
  }, [allTransactions, filters]);

  // ---------- STATS ----------
  const totalFees = useMemo(
    () => filteredData.reduce((sum, tx) => sum + tx.totalFeeCharged, 0),
    [filteredData],
  );

  const averageFee = useMemo(
    () => (filteredData.length ? totalFees / filteredData.length : 0),
    [filteredData, totalFees],
  );

  // ---------- CHART DATA ----------
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredData.forEach((tx) => {
      grouped[tx.date] = (grouped[tx.date] || 0) + tx.totalFeeCharged;
    });
    const result = Object.entries(grouped)
      .map(([date, value]) => ({name: date, value}))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    return result;
  }, [filteredData]);

  // ---------- HANDLERS ----------
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({...prev, [key]: value}));
  };

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Client Name',
      'Transaction Type',
      'Amount (USD)',
      'Fee Type',
      'Fee Charged (USD)',
    ];
    const csvRows = filteredData.map((tx) => [
      tx.date,
      tx.transactionId,
      tx.clientName,
      tx.transactionType,
      tx.amount.toFixed(2),
      tx.feeType,
      tx.totalFeeCharged.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-fees-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Inside TransactionReport.tsx, replace the existing handlePrint function with this:

  const handlePrint = () => {
    if (filteredData.length === 0) {
      alert('No data to print. Adjust your filters and try again.');
      return;
    }

    // Compute additional stats
    const totalAmount = filteredData.reduce((sum, tx) => sum + tx.amount, 0);
    const transactionCount = filteredData.length;

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

    // Build filter summary text
    const filterParts = [];
    if (filters.type !== 'All Types') filterParts.push(`Type: ${filters.type}`);
    if (filters.search) filterParts.push(`Search: "${filters.search}"`);
    const filterSummary = filterParts.length
      ? filterParts.join(' • ')
      : 'No filters applied';

    // Build table rows with alternating background
    const tableRows = filteredData
      .map(
        (tx, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${tx.date}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${tx.transactionId}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>${tx.clientName}</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 50px; font-size: 11px; font-weight: 600; background: ${
            tx.transactionType === 'Top-up'
              ? '#d1fae5'
              : tx.transactionType === 'Sent Money'
                ? '#fef3c7'
                : '#dbeafe'
          }; color: ${
            tx.transactionType === 'Top-up'
              ? '#065f46'
              : tx.transactionType === 'Sent Money'
                ? '#92400e'
                : '#1e40af'
          };">${tx.transactionType}</span>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">
          <strong>$${tx.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${tx.feeType}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #f5813d;">
          $${tx.totalFeeCharged.toFixed(2)}
        </td>
      </tr>
    `,
      )
      .join('');

    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Transaction Fee Report</title>
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
          <h1>Transaction Fee Report</h1>
          <div class="header-row">
            <span>Generated: ${dateStr} ${timeStr}</span>
            <span>Total transactions: ${transactionCount}</span>
          </div>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-title">Total Fees Collected</div>
            <div class="stat-value">$${totalFees.toFixed(2)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Average Fee per Transaction</div>
            <div class="stat-value">$${averageFee.toFixed(2)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Transaction Amount</div>
            <div class="stat-value">$${totalAmount.toFixed(2)}</div>
          </div>
        </div>

        <div class="filter-summary">
          <strong>Applied filters:</strong> ${filterSummary}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Client Name</th>
              <th>Type</th>
              <th>Amount (USD)</th>
              <th>Fee Type</th>
              <th>Fee Charged (USD)</th>
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

    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 250);
  };
  // ---------- TABLE COLUMNS ----------
  const columns: Column<DisplayTransaction>[] = [
    {
      header: 'Date',
      accessor: 'date',
      render: (item) => (
        <div className="text-header-text text-sm font-medium dark:text-white">
          {item.date}
        </div>
      ),
      className: 'min-w-[100px]',
      sortable: true,
    },
    {
      header: 'Client Name',
      accessor: 'clientName',
      render: (item) => (
        <div className="text-header-text text-sm font-semibold dark:text-white">
          {item.clientName}
        </div>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Transaction Type',
      accessor: 'transactionType',
      render: (item) => {
        let badgeColor =
          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        if (item.transactionType === 'Top-up') {
          badgeColor =
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        } else if (item.transactionType === 'Sent Money') {
          badgeColor =
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        }
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${badgeColor}`}
          >
            {item.transactionType}
          </span>
        );
      },
      className: 'min-w-[110px]',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item) => (
        <div className="text-header-text text-right text-sm font-medium dark:text-white">
          ${item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
        </div>
      ),
      className: 'min-w-[100px] text-right',
      sortable: true,
    },
    {
      header: 'Fee Type',
      accessor: 'feeType',
      render: (item) => (
        <div className="text-secondary-text dark:text-gray-400 text-center text-sm">
          {item.feeType}
        </div>
      ),
      className: 'min-w-[100px] text-center',
    },
    {
      header: 'Total Fee Charged',
      accessor: 'totalFeeCharged',
      render: (item) => (
        <div className="text-right text-sm font-bold text-primary dark:text-orange-400">
          ${item.totalFeeCharged.toFixed(2)}
        </div>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
    },
  ];

  // ---------- LOADING & ERROR ----------
  if (isLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="spinner-border h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Loading transactions…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-light dark:bg-background-dark flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-xl font-semibold">Failed to load transactions</p>
          <p className="mt-2">{String(error)}</p>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen w-full">
      <div className="flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Transaction Fee Report
              </h2>
              <p className="text-secondary-text dark:text-gray-400 mt-1 text-sm">
                {filteredData.length} transactions • fees collected: $
                {totalFees.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportCSV}
                className="text-header-text hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dce0e5] bg-white px-3 text-sm font-medium transition-colors dark:text-white"
              >
                <FaFileCsv className="text-lg" />
                <span>CSV</span>
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
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatsCard
            title="Total Fees Collected"
            value={`$${totalFees.toLocaleString('en-US', {minimumFractionDigits: 2})}`}
            trend={8.2}
            trendLabel="vs last month"
            iconType="money"
          />
          <StatsCard
            title="Average Fee per Transaction"
            value={`$${averageFee.toFixed(2)}`}
            trend={0}
            trendLabel="stable"
            iconType="analytics"
          />
        </div>

        {/* Chart */}
        <div className="mb-6">
          <ChartSection data={chartData} />
        </div>

        {/* Filters */}
        <div className="dark:border-gray-800 mb-6 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:bg-[#111a22]">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              {/* Type filter */}
              <div className="relative min-w-[160px] flex-1 lg:flex-none">
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="text-header-text dark:border-gray-700 dark:bg-gray-800 block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                >
                  {transactionTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                <div className="text-secondary-text dark:text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <span className="text-lg">⌄</span>
                </div>
              </div>
            </div>

            {/* Search */}
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
                className="text-header-text placeholder-gray-500 dark:border-gray-700 dark:bg-gray-800 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                placeholder="Search ID or client..."
              />
            </div>
          </div>
        </div>

        {/* ---------- DEBUG PANEL (uncomment if needed) ---------- */}
        {/* <pre className="mt-4 rounded bg-gray-100 p-4 text-xs dark:bg-gray-900">
          {JSON.stringify({ allTransactions, filteredData, chartData }, null, 2)}
        </pre> */}

        {/* Table */}
        <div id="fee-report-content">
          {filteredData.length === 0 ? (
            <div className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-8 text-center dark:bg-[#111a22]">
              <p className="text-secondary-text dark:text-gray-400">
                No transactions match your filters.
              </p>
              {allTransactions.length > 0 && (
                <p className="text-secondary-text dark:text-gray-400 mt-2 text-sm">
                  {allTransactions.length} total transactions available. Try
                  clearing filters.
                </p>
              )}
            </div>
          ) : (
            <GenericTable
              data={filteredData}
              columns={columns}
              itemsPerPage={10}
              searchAble={false}
              title="Transaction Fee Details"
              action={false}
              paginationOff={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionReport;
