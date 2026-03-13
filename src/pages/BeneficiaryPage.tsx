import BeneficiaryTable from './BeneficiaryTable';
import React, {useRef} from 'react';
import {FaFilePdf, FaFileCsv} from 'react-icons/fa6';
import {MdPrint, MdDownload, MdLock, MdClose} from 'react-icons/md';

const BeneficiaryPage: React.FC = () => {
  // Create ref to access table functions
  const tableRef = useRef<{
    getFilteredData: () => any[];
    getAllData: () => any[];
    getFilters: () => any;
    clearAllFilters: () => void;
  }>(null);

  // Function to get filtered data from table
  const getFilteredData = () => {
    if (tableRef.current?.getFilteredData) {
      return tableRef.current.getFilteredData();
    }
    return [];
  };

  // Function to get all data from table
  const getAllData = () => {
    if (tableRef.current?.getAllData) {
      return tableRef.current.getAllData();
    }
    return [];
  };

  // Function to get current filters
  const getCurrentFilters = () => {
    if (tableRef.current?.getFilters) {
      return tableRef.current.getFilters();
    }
    return {};
  };

  const handleExportPDF = () => {
    const data = getFilteredData();
    if (data.length === 0) {
      alert('No data to export');
      return;
    }
    console.log('Export PDF with filtered data:', data.length);
  };

  const handleExportCSV = () => {
    const data = getFilteredData();
    if (data.length === 0) {
      alert('No data to export');
      return;
    }
    console.log('Export CSV with filtered data:', data.length);
  };

  const handleExportAll = () => {
    const data = getFilteredData();
    if (data.length === 0) {
      alert('No data to export');
      return;
    }
    console.log('Export All with filtered data:', data.length);
  };

  const handlePrint = () => {
    // Get filtered data from the table ref
    const filteredData = tableRef.current?.getFilteredData() || [];
    const filters = tableRef.current?.getFilters() || {};

    if (filteredData.length === 0) {
      alert('No data to print. Adjust your filters and try again.');
      return;
    }

    // Compute stats from the filtered data
    const total = filteredData.length;
    const active = filteredData.filter((item) => item.user?.isActive).length;
    const verified = filteredData.filter((item) => item.isVerified).length;
    const rejected = filteredData.filter((item) => item.isRejected).length;
    const pending = total - verified - rejected;
    const withForeign = filteredData.filter(
      (item) => (item.foreignBeneficiariesCount || 0) > 0,
    ).length;

    // Helper for status text
    const getStatusText = (item: (typeof filteredData)[0]) => {
      if (item.isRejected) return 'Rejected';
      if (item.isVerified) return 'Approved';
      return 'Pending';
    };

    // Build filter summary
    const filterParts = [];
    if (filters.startDate) filterParts.push(`From: ${filters.startDate}`);
    if (filters.endDate) filterParts.push(`To: ${filters.endDate}`);
    if (filters.searchQuery)
      filterParts.push(`Search: "${filters.searchQuery}"`);
    if (filters.statusFilter)
      filterParts.push(
        `Status: ${filters.statusFilter === 'active' ? 'Active' : 'Inactive'}`,
      );
    if (filters.verificationFilter)
      filterParts.push(
        `Verification: ${filters.verificationFilter === 'verified' ? 'Verified' : 'Not Verified'}`,
      );
    if (filters.rejectionFilter)
      filterParts.push(
        `Rejection: ${filters.rejectionFilter === 'rejected' ? 'Rejected' : 'Not Rejected'}`,
      );
    if (filters.hasForeignFilter)
      filterParts.push(
        `Foreign: ${filters.hasForeignFilter === 'has-foreign' ? 'Has Foreign' : 'No Foreign'}`,
      );

    const filterSummary = filterParts.length
      ? filterParts.join(' • ')
      : 'No filters applied';

    // Build table rows
    const tableRows = filteredData
      .map(
        (item, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.fullName || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.clientName || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.email || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.phoneNumber || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.bankName || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.accountNumber || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.bankCountry || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 50px; font-size: 11px; font-weight: 600; background: ${
            item.isRejected
              ? '#fee2e2'
              : item.isVerified
                ? '#d1fae5'
                : '#fef3c7'
          }; color: ${
            item.isRejected
              ? '#991b1b'
              : item.isVerified
                ? '#065f46'
                : '#92400e'
          };">
            ${getStatusText(item)}
          </span>
        </td>
      </tr>
    `,
      )
      .join('');

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

    // Build the full HTML document
    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Beneficiary Report</title>
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
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Beneficiary Report</h1>
          <div class="header-row">
            <span>Generated: ${dateStr} ${timeStr}</span>
            <span>Total records: ${total}</span>
          </div>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-title">Total Beneficiaries</div>
            <div class="stat-value">${total}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Active</div>
            <div class="stat-value">${active}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Verified</div>
            <div class="stat-value">${verified}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">With Foreign</div>
            <div class="stat-value">${withForeign}</div>
          </div>
        </div>

        <div class="filter-summary">
          <strong>Applied filters:</strong> ${filterSummary}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Beneficiary</th>
              <th>Linked Client</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Bank</th>
              <th>Account</th>
              <th>Country</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          Printed from Beneficiary Management System
        </div>
      </body>
    </html>
  `;

    // Open print window
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

    // Trigger print after content loads
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  const handleLockPin = () => {
    const data = getFilteredData();
    if (data.length === 0) {
      alert('No data to lock');
      return;
    }
    console.log('Lock & Pin with filtered data:', data.length);
  };

  const handleClearAllFilters = () => {
    if (tableRef.current?.clearAllFilters) {
      tableRef.current.clearAllFilters();
    }
  };

  const filters = getCurrentFilters();
  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    filters.searchQuery ||
    filters.statusFilter ||
    filters.verificationFilter ||
    filters.rejectionFilter ||
    filters.hasForeignFilter;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 md:p-10">
        {/* Page Title & Actions */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
              All Beneficiary List Report
            </h1>
            <p className="text-gray-600 max-w-2xl text-sm">
              Manage and monitor all beneficiaries, including their status,
              verification, and foreign beneficiary details.
            </p>
          </div>

          {/* Export Buttons at Top */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="hover:bg-primary-dark flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-sm transition-colors sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
              title="Print current filtered view"
            >
              <MdPrint className="text-base sm:text-lg" />
              <span className="xs:inline hidden">Print</span>
            </button>
          </div>
        </div>

        {/* Clear All Filters Button - Shows when any filter is active */}
        {hasActiveFilters && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleClearAllFilters}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            >
              <MdClose className="text-sm sm:text-base" />
              Clear All Filters
            </button>
          </div>
        )}

        {/* Beneficiary Table Component with container for printing */}
        <div id="beneficiary-table-container">
          <BeneficiaryTable ref={tableRef} />
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryPage;
