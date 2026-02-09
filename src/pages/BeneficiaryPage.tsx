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
    // This will trigger print preview in a new tab
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print');
      return;
    }

    // Get the table container content
    const tableContainer = document.getElementById(
      'beneficiary-table-container',
    );
    if (!tableContainer) {
      alert('No content to print');
      return;
    }

    // Clone the table container
    const printContent = tableContainer.cloneNode(true) as HTMLElement;

    // Remove export buttons from cloned content
    const buttons = printContent.querySelectorAll('button');
    buttons.forEach((button) => {
      if (
        button.textContent?.includes('Export') ||
        button.textContent?.includes('Print') ||
        button.textContent?.includes('Lock')
      ) {
        button.remove();
      }
    });

    // Create print-friendly HTML
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Beneficiary Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 12px;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            
            .print-title {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px 0;
            }
            
            .print-subtitle {
              font-size: 14px;
              color: #666;
              margin: 0 0 10px 0;
            }
            
            .print-info {
              font-size: 11px;
              color: #999;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            
            th {
              background: #f2f2f2;
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-weight: bold;
            }
            
            td {
              border: 1px solid #ddd;
              padding: 6px;
            }
            
            tr:nth-child(even) {
              background: #f9f9f9;
            }
            
            .print-footer {
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 10px;
              color: #999;
            }
            
            .no-print {
              display: none !important;
            }
            
            @media print {
              @page {
                margin: 0.5cm;
              }
              
              body {
                margin: 0;
                font-size: 10px;
                padding: 10px;
              }
              
              .print-header {
                margin-bottom: 15px;
                padding-bottom: 5px;
              }
              
              .print-title {
                font-size: 18px;
              }
              
              th, td {
                padding: 4px;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1 class="print-title">Beneficiary Management Report</h1>
            <div class="print-subtitle">Current Filtered View</div>
            <div class="print-info">
              Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}<br>
              Total Records: ${printContent.querySelectorAll('table tbody tr').length}
            </div>
          </div>
          
          ${printContent.innerHTML}
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            };
            
            // Fallback for print dialog cancellation
            window.onafterprint = function() {
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
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
            <button
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
            </button>

            <button
              onClick={handlePrint}
              className="hover:bg-primary-dark flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors"
              title="Print current filtered view"
            >
              <MdPrint />
              <span>Print</span>
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
