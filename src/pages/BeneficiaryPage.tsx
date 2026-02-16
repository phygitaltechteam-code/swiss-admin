import BeneficiaryTable from './BeneficiaryTable';
import React, {useRef} from 'react';
import {FaFilePdf, FaFileCsv} from 'react-icons/fa6';
import {MdPrint, MdDownload, MdLock} from 'react-icons/md';

const BeneficiaryPage: React.FC = () => {
  // Create ref to access table functions
  const tableRef = useRef<{
    getFilteredData: () => any[];
    getAllData: () => any[];
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

  const handleExportPDF = () => {
    const data = getFilteredData();
    if (data.length === 0) {
      alert('No data to export');
      return;
    }
    // You'll need to implement or import ExportFunctions here
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
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${getStatusText(item)}</td>
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
          .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
          .stat-card { background: #f3f4f6; border-radius: 8px; padding: 12px 16px; flex: 1 0 180px; }
          .stat-title { font-size: 14px; color: #4b5563; }
          .stat-value { font-size: 24px; font-weight: bold; color: #1e3a8a; }
          .filter-summary { background: #eff6ff; padding: 10px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #ff7207; color: white; padding: 8px; text-align: left; }
          td {  padding: 6px; }
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
          <div style="display: flex; justify-content: space-between;">
            <span>Generated: ${dateStr} ${timeStr}</span>
            <span>Total records: ${total}</span>
          </div>
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
      // Optionally close after printing (some browsers may need a delay)
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1600px] p-6 md:p-10">
        {/* Page Title & Actions */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
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
          <div className="flex flex-wrap gap-3">
            {/* <button
              onClick={handleExportPDF}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold transition-colors"
              title="Export current filtered view as PDF"
            >
              <FaFilePdf />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold transition-colors"
              title="Export current filtered view as CSV"
            >
              <FaFileCsv />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportAll}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold transition-colors"
              title="Export all formats (PDF, Excel, CSV)"
            >
              <MdDownload />
              <span>Export All</span>
            </button> */}

            <button
              onClick={handlePrint}
              className="hover:bg-primary-dark flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors"
              title="Print current filtered view"
            >
              <MdPrint className="text-lg" />
              Print
            </button>
          </div>
        </div>

        {/* Beneficiary Table Component with container for printing */}
        <div id="beneficiary-table-container">
          <BeneficiaryTable ref={tableRef} />
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryPage;
