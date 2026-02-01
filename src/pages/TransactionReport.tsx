// TransactionReport.tsx
import React, {useState, useMemo} from 'react';
import {
  MdPictureAsPdf,
  MdPrint,
  MdAttachMoney,
  MdAnalytics,
} from 'react-icons/md';
import {FaFileCsv} from 'react-icons/fa';
import StatsCard from '@/components/transactionreport/StatsCard';
import ChartSection from '@/components/transactionreport/ChartSection';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {
  Transaction,
  CHART_DATA,
  TRANSACTIONS,
} from '@/components/transactionreport/constants';

const TransactionReport: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: '',
    type: 'All Types',
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
          transaction.transactionId.toLowerCase().includes(searchLower) ||
          transaction.clientName.toLowerCase().includes(searchLower) ||
          transaction.id.toLowerCase().includes(searchLower),
      );
    }

    // Apply type filter
    if (filters.type !== 'All Types') {
      data = data.filter(
        (transaction) => transaction.transactionType === filters.type,
      );
    }

    return data;
  }, [filters]);

  // Calculate total fees
  const totalFees = useMemo(() => {
    return filteredData.reduce((sum, txn) => sum + txn.totalFeeCharged, 0);
  }, [filteredData]);

  // Calculate average fee
  const averageFee = useMemo(() => {
    return filteredData.length > 0 ? totalFees / filteredData.length : 0;
  }, [filteredData, totalFees]);

  // Handle export to PDF
  const handleExportPDF = () => {
    console.log('Exporting to PDF:', filteredData);
    alert('PDF export functionality would be implemented here');
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Transaction ID',
      'Client Name',
      'Transaction Type',
      'Amount',
      'Fee Type',
      'Total Fee Charged',
    ];
    const csvData = filteredData.map((transaction) => [
      transaction.date,
      transaction.transactionId,
      transaction.clientName,
      transaction.transactionType,
      transaction.amount
        ? `$${transaction.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`
        : '-',
      transaction.feeType,
      `$${transaction.totalFeeCharged.toFixed(2)}`,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-fees-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle print
  const handlePrint = () => {
    const printContent = document.getElementById('fee-report-content');
    const printWindow = window.open('', '_blank');
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Transactions Fee Report</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              body { font-family: 'Inter', sans-serif; margin: 20px; background: #fff; color: #000; }
              .print-header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0; }
              .print-header h1 { color: #0F1535; margin: 0; font-size: 28px; font-weight: 700; }
              .print-header p { color: #6B7280; margin: 5px 0 0; font-size: 14px; }
              .print-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
              .stat-card { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
              .stat-label { color: #6B7280; font-size: 13px; margin-bottom: 5px; }
              .stat-value { color: #0F1535; font-size: 28px; font-weight: 700; }
              .stat-trend { display: inline-block; margin-top: 8px; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; }
              .trend-up { background: #d1fae5; color: #065f46; }
              .trend-down { background: #fee2e2; color: #991b1b; }
              .trend-stable { background: #dbeafe; color: #1e40af; }
              .chart-section { margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb; }
              .chart-title { margin: 0 0 15px; color: #0F1535; font-size: 16px; font-weight: 600; }
              .chart-container { height: 200px; position: relative; padding-top: 10px; }
              .chart-grid { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 20px; }
              .chart-grid-line { display: flex; align-items: center; }
              .chart-grid-label { width: 40px; text-align: right; font-size: 10px; color: #6B7280; margin-right: 10px; }
              .chart-grid-line > div { flex: 1; border-bottom: 1px dashed #d1d5db; }
              .chart-bars { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: space-between; padding: 10px 50px 20px; }
              .chart-bar { flex: 1; margin: 0 5px; background: linear-gradient(to top, #f5813d, #ff9f69); border-radius: 3px 3px 0 0; position: relative; }
              .chart-bar-label { position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #6B7280; }
              .chart-x-axis { margin-top: 25px; text-align: center; font-size: 11px; color: #6B7280; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
              th { background-color: #f8fafc; color: #6B7280; font-weight: 600; text-transform: uppercase; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
              td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
              .type-badge { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; }
              .badge-intl { background: #dbeafe; color: #1e40af; }
              .badge-card { background: #f3e8ff; color: #7c3aed; }
              .badge-overdraft { background: #fed7aa; color: #c2410c; }
              .badge-ach { background: #d1fae5; color: #065f46; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6B7280; font-size: 12px; }
              @media print {
                body { margin: 0; padding: 20px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>Transactions Fee Report</h1>
              <p>Detailed breakdown of fees collected per transaction type for October 2023</p>
              <p>Generated on ${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
            </div>
            
            <div class="print-stats">
              <div class="stat-card">
                <div class="stat-label">Total Fees Collected</div>
                <div class="stat-value">$${totalFees.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                <span class="stat-trend trend-up">8.2% vs last month</span>
              </div>
              <div class="stat-card">
                <div class="stat-label">Average Fee per Transaction</div>
                <div class="stat-value">$${averageFee.toFixed(2)}</div>
                <span class="stat-trend trend-stable">stable</span>
              </div>
            </div>
            
            <div class="chart-section">
              <h3 class="chart-title">Fees Collected Trend</h3>
              <div class="chart-container">
                <div class="chart-grid">
                  ${[1, 0.75, 0.5, 0.25, 0]
                    .map((tick, i) => {
                      const maxValue =
                        Math.max(...CHART_DATA.map((d) => d.value)) * 1.1;
                      return `
                      <div class="chart-grid-line">
                        <span class="chart-grid-label">
                          ${tick === 0 ? '0' : `$${Math.round((maxValue * tick) / 1000)}k`}
                        </span>
                        <div></div>
                      </div>
                    `;
                    })
                    .join('')}
                </div>
                <div class="chart-bars">
                  ${CHART_DATA.map((item) => {
                    const maxValue =
                      Math.max(...CHART_DATA.map((d) => d.value)) * 1.1;
                    const height = (item.value / maxValue) * 100;
                    return `
                      <div class="chart-bar" style="height: ${height}%">
                        <div class="chart-bar-label">$${(item.value / 1000).toFixed(0)}k</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
              <div class="chart-x-axis">${CHART_DATA.map((item) => item.name).join(' | ')}</div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Client Name</th>
                  <th>Transaction Type</th>
                  <th>Amount</th>
                  <th>Fee Type</th>
                  <th>Total Fee Charged</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData
                  .map((transaction) => {
                    const badgeClass = `badge-${transaction.transactionType.toLowerCase().replace(' ', '').replace('.', '')}`;
                    return `
                    <tr>
                      <td><strong>${transaction.date}</strong></td>
                      <td style="font-family: monospace; color: #6B7280;">${transaction.transactionId}</td>
                      <td><strong>${transaction.clientName}</strong></td>
                      <td>
                        <span class="type-badge ${badgeClass}">
                          ${transaction.transactionType}
                        </span>
                      </td>
                      <td>
                        ${transaction.amount ? `<strong>$${transaction.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>` : '-'}
                      </td>
                      <td style="color: #6B7280;">${transaction.feeType}</td>
                      <td style="color: #f5813d; font-weight: bold;">$${transaction.totalFeeCharged.toFixed(2)}</td>
                    </tr>
                  `;
                  })
                  .join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Report generated by Admin Panel • Total Fees: $${totalFees.toLocaleString('en-US', {minimumFractionDigits: 2})} • Confidential</p>
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
      header: 'Transaction ID',
      accessor: 'transactionId',
      render: (item: Transaction) => (
        <span className="font-mono text-secondary-text dark:text-gray-400 text-sm">
          {item.transactionId}
        </span>
      ),
      className: 'min-w-[130px]',
    },
    {
      header: 'Client Name',
      accessor: 'clientName',
      render: (item: Transaction) => (
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
      render: (item: Transaction) => {
        const badgeStyle = {
          'Intl Wire':
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          'Card Trans.':
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
          Overdraft:
            'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
          'ACH Pay':
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
        };

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${badgeStyle[item.transactionType]}`}
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
      render: (item: Transaction) => (
        <div className="text-header-text text-right text-sm font-medium dark:text-white">
          {item.amount
            ? `$${item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`
            : '-'}
        </div>
      ),
      className: 'min-w-[100px] text-right',
      sortable: true,
    },
    {
      header: 'Fee Type',
      accessor: 'feeType',
      render: (item: Transaction) => (
        <div className="text-secondary-text dark:text-gray-400 text-center text-sm">
          {item.feeType}
        </div>
      ),
      className: 'min-w-[100px] text-center',
    },
    {
      header: 'Total Fee Charged',
      accessor: 'totalFeeCharged',
      render: (item: Transaction) => (
        <div className="text-right text-sm font-bold text-primary dark:text-orange-400">
          ${item.totalFeeCharged.toFixed(2)}
        </div>
      ),
      className: 'min-w-[120px] text-right',
      sortable: true,
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
                Transactions Fee Report
              </h2>
              <p className="text-secondary-text dark:text-gray-400 mt-1 text-sm">
                Detailed breakdown of fees collected per transaction type for
                October 2023
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>

        {/* Chart Section */}
        <div className="mb-6">
          <ChartSection />
        </div>

        {/* Filters and Table */}
        <div id="fee-report-content" className="space-y-6">
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

                {/* Type Select */}
                <div className="relative min-w-[160px] flex-1 lg:flex-none">
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option>All Types</option>
                    <option>Wire Transfer</option>
                    <option>ACH Payment</option>
                    <option>International Wire</option>
                    <option>Card Transaction</option>
                    <option>Overdraft</option>
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
                  placeholder="Search ID, Client..."
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
            title="Transaction Fee Details"
            action={false}
            paginationOff={false}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionReport;
