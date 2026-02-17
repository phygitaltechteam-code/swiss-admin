import React, {useState, useMemo} from 'react';
import {
  MdPictureAsPdf,
  MdPrint,
  MdCalendarToday,
  MdExpandMore,
  MdSearch,
  MdDownload,
} from 'react-icons/md';
import StatsCard from '@/components/wallettopupreport/StatsCard';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {Transaction} from '@/components/wallettopupreport/types';
import {useGetTopup} from '@/lib/react-query/Topup';
import {FaCopy, FaFilePdf, FaHourglassHalf, FaRupeeSign} from 'react-icons/fa';
import {IoMdRadioButtonOff} from 'react-icons/io';
//import {useGetTopupApproved} from '@/lib/react-query/topup';

// PDF Export Service - Separate from React component
class PDFExportService {
  static async generateWalletReport(
    data: Transaction[],
    stats: any[],
    filename: string = 'wallet_topup_report.pdf',
  ): Promise<void> {
    try {
      // Check if data is empty
      if (!data || data.length === 0) {
        throw new Error('No data available to export');
      }

      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error(
          'PDF generation is only available in browser environment',
        );
      }

      // Dynamically import jsPDF
      let jsPDFModule;
      try {
        jsPDFModule = await import('jspdf');
        console.log('jsPDF loaded successfully');
      } catch (error) {
        console.error('Failed to import jsPDF:', error);
        throw new Error(
          'PDF library (jspdf) is not installed. Please install it using: npm install jspdf jspdf-autotable',
        );
      }

      const {jsPDF} = jsPDFModule;

      if (!jsPDF || typeof jsPDF !== 'function') {
        throw new Error('Failed to initialize PDF library');
      }

      // Try to load autoTable
      let autoTableLoaded = false;
      try {
        await import('jspdf-autotable');
        autoTableLoaded = true;
        console.log('AutoTable loaded successfully');
      } catch (error) {
        console.warn(
          'AutoTable not available, using basic table generation:',
          error,
        );
        autoTableLoaded = false;
      }

      const doc = new jsPDF('landscape');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;

      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Wallet Top-Up Report', pageWidth / 2, margin, {
        align: 'center',
      });

      // Add generation date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        pageWidth / 2,
        margin + 10,
        {align: 'center'},
      );

      // Add statistics section if available
      if (stats && stats.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary Statistics', margin, margin + 25);

        // Create stats boxes
        const statsStartY = margin + 35;
        const statBoxWidth =
          (pageWidth - 2 * margin - 15) / Math.min(stats.length, 4);

        stats.forEach((stat, index) => {
          if (index >= 4) return; // Limit to 4 stats per row

          const x = margin + index * (statBoxWidth + 5);
          const y = statsStartY;

          // Draw stat box
          doc.setDrawColor(200, 200, 200);
          doc.setFillColor(245, 245, 245);
          doc.rect(x, y, statBoxWidth, 25, 'FD');

          // Add stat title
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          const title =
            stat.title.length > 20
              ? stat.title.substring(0, 17) + '...'
              : stat.title;
          doc.text(title, x + 5, y + 8, {maxWidth: statBoxWidth - 10});

          // Add stat value
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const value = stat.value;
          doc.text(value, x + 5, y + 17, {maxWidth: statBoxWidth - 10});

          // Add stat change if available
          if (stat.trend) {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            const changeText =
              `${stat.trend || ''} ${stat.subtext || ''}`.trim();
            if (changeText) {
              doc.text(changeText.substring(0, 20), x + 5, y + 23, {
                maxWidth: statBoxWidth - 10,
              });
            }
          }
        });
      }

      // Determine table start position
      const tableStartY = margin + (stats && stats.length > 0 ? 70 : 45);

      // Generate table based on autoTable availability
      if (autoTableLoaded && (doc as any).autoTable) {
        // Prepare table data for autoTable
        const headers = [
          [
            'Date',
            'Request ID',
            'Client Name',
            'Account Type',
            'Amount',
            'Payment Proof',
            'Status',
          ],
        ];

        const tableData = data.map((item) => [
          item.date || 'N/A',
          item.requestId || item.id || 'N/A',
          item.clientName?.substring(0, 20) || 'N/A',
          item.accountType || 'N/A',
          item.amount ? `$${item.amount.toFixed(2)}` : '$0.00',
          item.paymentProof?.label?.substring(0, 15) || 'N/A',
          item.status || 'N/A',
        ]);

        // Configure and generate autoTable
        (doc as any).autoTable({
          startY: tableStartY,
          head: headers,
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [245, 158, 11], // Orange color
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 8,
            cellPadding: 3,
          },
          bodyStyles: {
            fontSize: 7,
            cellPadding: 2,
            overflow: 'linebreak',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: {top: 10},
          styles: {
            overflow: 'linebreak',
            cellPadding: 2,
            fontSize: 7,
            valign: 'middle',
          },
          columnStyles: {
            0: {cellWidth: 20}, // Date
            1: {cellWidth: 25}, // Request ID
            2: {cellWidth: 30}, // Client Name
            3: {cellWidth: 20}, // Account Type
            4: {cellWidth: 20}, // Amount
            5: {cellWidth: 25}, // Payment Proof
            6: {cellWidth: 15}, // Status
          },
          didDrawPage: (data: any) => {
            // Add page number
            doc.setFontSize(8);
            doc.text(
              `Page ${data.pageNumber}`,
              data.settings.margin.left,
              doc.internal.pageSize.height - 10,
            );
          },
        });
      } else {
        // Fallback: Simple table without autoTable
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(
          'Wallet Top-Up Transactions (Limited Preview)',
          margin,
          tableStartY,
        );

        // Simple header
        const headers = ['Date', 'ID', 'Client', 'Type', 'Amount', 'Status'];
        let currentY = tableStartY + 10;

        // Draw header
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(headers.join(' | '), margin, currentY);
        currentY += 6;

        // Draw separator
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 4;

        // Draw data rows (limited to 30 for performance)
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        data.slice(0, 30).forEach((item, index) => {
          if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = margin;
          }

          const row = [
            item.date?.substring(0, 10) || 'N/A',
            item.requestId?.substring(0, 8) || 'N/A',
            item.clientName?.substring(0, 10) || 'N/A',
            item.accountType?.substring(0, 8) || 'N/A',
            item.amount ? `$${item.amount}` : '$0.00',
            item.status?.substring(0, 10) || 'N/A',
          ].join(' | ');

          doc.text(row, margin, currentY);
          currentY += 5;
        });

        // Add note about limited data
        if (data.length > 30) {
          doc.setFontSize(7);
          doc.setFont('helvetica', 'italic');
          doc.text(
            `Note: Showing 30 of ${data.length} records. Install jspdf-autotable for full table.`,
            margin,
            currentY + 5,
          );
        }
      }

      // Get final Y position for footer
      const finalY = (doc as any)?.lastAutoTable?.finalY || tableStartY + 150;

      // Add footer
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text(`Total Transactions: ${data.length}`, margin, finalY + 10);

      // Calculate total amount
      const totalAmount = data.reduce(
        (sum, item) => sum + (item.amount || 0),
        0,
      );
      doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, margin, finalY + 17);

      // Add company info
      doc.setFontSize(8);
      doc.text('Wallet Management System © 2024', pageWidth / 2, finalY + 10, {
        align: 'center',
      });

      // Add export info
      doc.text(
        `Exported by: ${window.location.hostname}`,
        pageWidth - margin,
        finalY + 10,
        {align: 'right'},
      );

      // Save the PDF
      doc.save(filename);

      console.log(
        `PDF exported successfully: ${filename}, ${data.length} records`,
      );
      return Promise.resolve();
    } catch (error) {
      console.error('Error in PDF generation:', error);

      // Provide detailed error information
      if (error instanceof Error) {
        if (error.message.includes('jspdf')) {
          throw new Error(
            'PDF library error. Please ensure jspdf is installed: npm install jspdf jspdf-autotable',
          );
        } else if (error.message.includes('No data')) {
          throw new Error('No data available to export.');
        } else if (error.message.includes('browser')) {
          throw new Error('PDF generation requires a browser environment.');
        }
        throw new Error(`PDF Generation Error: ${error.message}`);
      }

      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async exportTableData(
    data: Transaction[],
    stats: any[],
  ): Promise<void> {
    const filename = `wallet_topup_report_${new Date().toISOString().split('T')[0]}.pdf`;
    await this.generateWalletReport(data, stats, filename);
  }
}

const WalletReport: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: '',
    accountType: 'All Account Types',
    status: 'All Statuses',
    search: '',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Use the React Query hook to fetch topup data
  const {data: apiResponse, isLoading, isError, error} = useGetTopup();

  // Extract data from API response
  const apiData = useMemo(() => {
    if (!apiResponse) {
      return {transactions: [], stats: {}};
    }

    console.log('API Response:', apiResponse);
    return {
      transactions: apiResponse.transactions || [],
      stats: apiResponse.stats || {},
      rawData: apiResponse.rawData || apiResponse,
    };
  }, [apiResponse]);

  // Transform API data to Transaction format if needed
  const transformedData = useMemo(() => {
    const transactions = apiData.transactions;

    // If transactions are already in the correct format, return them
    if (transactions.length > 0 && transactions[0].id) {
      return transactions;
    }

    // Transform if needed - adjust based on your actual API response structure
    return transactions.map((tx: any, index: number) => ({
      id: tx.id || `REQ-${10000 + index}`,
      requestId: tx.requestId || `#REQ-${10000 + index}`,
      clientName: tx.clientName || tx.user?.fullname || 'Unknown Client',
      clientInitials: getInitials(tx.clientName || tx.user?.fullname || 'UC'),
      clientColor: getColorClass(index),
      accountType: tx.accountType || 'E-Private',
      amount: tx.amount || 0,
      date:
        tx.date ||
        tx.createdAt?.split('T')[0] ||
        new Date().toLocaleDateString(),
      paymentProof: {
        type: tx.paymentProof?.type || 'View',
        label: tx.paymentProof?.label || 'View',
      },
      status: tx.status || 'Pending',
    }));
  }, [apiData.transactions]);

  // Helper function to get initials
  const getInitials = (name: string): string => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get color class based on index
  const getColorClass = (index: number): string => {
    const colors = [
      'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
      'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300',
      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300',
      'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300',
      'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300',
      'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300',
      'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300',
      'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300',
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300',
      'bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-300',
    ];
    return colors[index % colors.length];
  };

  // Calculate stats from the data
  const calculatedStats = useMemo(() => {
    const transactions = transformedData;
    const totalAmount = transactions.reduce(
      (sum, tx) => sum + (tx.amount || 0),
      0,
    );
    const pendingCount = transactions.filter(
      (tx) => tx.status === 'Pending',
    ).length;
    const completedCount = transactions.filter(
      (tx) => tx.status === 'Completed',
    ).length;

    // Get most used account type
    const accountTypes = transactions.reduce(
      (acc, tx) => {
        const type = tx.accountType || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostUsedType = Object.entries(accountTypes).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return [
      {
        title: 'Total Top-Ups Value',
        value: `$${totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        trend: '8.2%',
        trendDirection: 'up',
        subtext: 'vs last month',
        icon: <FaRupeeSign />,
      },
      {
        title: 'Total Requests',
        value: transactions.length.toString(),
        trend: '12.5%',
        trendDirection: 'up',
        subtext: 'volume increase',
        icon: <FaCopy />,
      },
      {
        title: 'Most Used Method',
        value: mostUsedType ? mostUsedType[0] : 'Bank Transfer',
        subtext: mostUsedType
          ? `${Math.round((mostUsedType[1] / transactions.length) * 100)}% of total`
          : '65% of total volume',
        icon: <IoMdRadioButtonOff />,
        highlightValue: true,
      },
      {
        title: 'Pending Approval',
        value: pendingCount.toString(),
        icon: <FaHourglassHalf />,
        alert: pendingCount > 0,
      },
    ];
  }, [transformedData]);

  // Filter data
  const filteredData = useMemo(() => {
    let data = [...transformedData];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (transaction) =>
          (transaction.requestId &&
            transaction.requestId.toLowerCase().includes(searchLower)) ||
          (transaction.clientName &&
            transaction.clientName.toLowerCase().includes(searchLower)) ||
          (transaction.id &&
            transaction.id.toLowerCase().includes(searchLower)),
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
  }, [transformedData, filters]);

  // PDF Export handler
  const handleExportPDF = async () => {
    if (transformedData.length === 0) {
      alert('No data available to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress for PDF export
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      console.log(
        `Starting PDF export with ${transformedData.length} records...`,
      );
      await PDFExportService.exportTableData(transformedData, calculatedStats);

      clearInterval(progressInterval);
      setExportProgress(100);

      // Reset after successful export
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    } catch (error) {
      console.error('Export error:', error);

      // Provide specific error messages
      let errorMessage = 'Failed to export PDF. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('jspdf')) {
          errorMessage = `PDF Export Error: ${error.message}\n\nPlease ensure you have installed the required packages:\nnpm install jspdf jspdf-autotable`;
        } else if (error.message.includes('No data')) {
          errorMessage = 'No data available to export.';
        } else {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handlePrint = () => {
    if (filteredData.length === 0) {
      alert('No data to print. Adjust your filters and try again.');
      return;
    }

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

    // Helper to get status text and colour (same as in table column)
    const getStatusClass = (status: string) => {
      const s = status?.toLowerCase() || 'pending';
      if (s === 'completed' || s === 'approved') return 'status-completed';
      if (s === 'pending') return 'status-pending';
      if (s === 'rejected' || s === 'declined') return 'status-rejected';
      return 'status-pending';
    };

    // Build table rows
    const tableRows = filteredData
      .map(
        (item, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.date || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; color: #f5813d;">${item.requestId || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; margin-right: 8px; font-weight: bold; font-size: 11px; background: ${item.clientColor?.split(' ')[0] || '#e5e7eb'}; color: ${item.clientColor?.split(' ')[1] || '#000'};">${item.clientInitials || '??'}</div>
            <span>${item.clientName || 'Unknown Client'}</span>
          </div>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;"><span class="account-badge">${item.accountType || 'N/A'}</span></td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">
          <strong>$${(item.amount || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="color: #f5813d; text-decoration: none;">${item.paymentProof?.label || 'View'}</span>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span class="status ${getStatusClass(item.status)}">${item.status || 'Pending'}</span>
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
        <title>Wallet Top-Up Report</title>
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
          .status { display: inline-block; padding: 4px 8px; border-radius: 50px; font-size: 11px; font-weight: 600; }
          .status-completed { background: #d1fae5; color: #065f46; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-rejected { background: #fee2e2; color: #991b1b; }
          .account-badge { display: inline-block; padding: 3px 10px; border-radius: 50px; background: #fff3e0; color: #f57c00; font-size: 11px; font-weight: 600; }
          .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: right; }
          @media print {
            body { margin: 0.5in; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Wallet Top-Up Report</h1>
          <div style="display: flex; justify-content: space-between;">
            <span>Generated: ${dateStr} ${timeStr}</span>
            <span>Total records: ${filteredData.length}</span>
          </div>
        </div>

        <div class="stats">
          ${calculatedStats
            .map(
              (stat) => `
            <div class="stat-card">
              <div class="stat-title">${stat.title}</div>
              <div class="stat-value">${stat.value}</div>
              ${stat.subtext ? `<div style="font-size: 11px; color: #6b7280; margin-top: 4px;">${stat.subtext}</div>` : ''}
            </div>
          `,
            )
            .join('')}
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
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          Printed from Wallet Management System
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
      header: 'Date',
      accessor: 'date',
      render: (item: Transaction) => (
        <div className="text-header-text text-sm font-medium dark:text-white">
          {item.date || 'N/A'}
        </div>
      ),
      className: 'min-w-[100px]',
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
            {item.clientName || 'Unknown Client'}
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
          {item.accountType || 'N/A'}
        </span>
      ),
      className: 'min-w-[100px]',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item: Transaction) => (
        <div className="text-header-text text-right text-sm font-bold dark:text-white">
          $
          {(item.amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })}
        </div>
      ),
      className: 'min-w-[100px] text-right',
      sortable: true,
    },
    // {
    //   header: 'Payment Proof',
    //   accessor: 'paymentProof',
    //   render: (item: Transaction) => {
    //     const getProofIcon = (type: string) => {
    //       switch (type) {
    //         case 'View':
    //           return <span className="mr-1">📎</span>;
    //         case 'Image':
    //           return <span className="mr-1">🖼️</span>;
    //         case 'PDF':
    //           return <span className="mr-1">📄</span>;
    //         case 'Missing':
    //           return <span className="mr-1">❌</span>;
    //         default:
    //           return null;
    //       }
    //     };

    //     return (
    //       <span
    //         className={`inline-flex items-center gap-1 text-sm font-medium ${
    //           (item.paymentProof?.type || 'View') === 'Missing'
    //             ? 'text-gray-400 dark:text-gray-500'
    //             : 'cursor-pointer text-primary hover:text-blue-600 dark:text-orange-400'
    //         }`}
    //       >
    //         {getProofIcon(item.paymentProof?.type || 'View')}
    //         {item.paymentProof?.label || 'View'}
    //       </span>
    //     );
    //   },
    //   className: 'min-w-[120px]',
    // },
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
          Approved:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
          Declined:
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };

        const status = item.status || 'Pending';
        const style =
          statusStyles[status as keyof typeof statusStyles] ||
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
          >
            <span
              className={`size-1.5 rounded-full ${
                status === 'Completed' || status === 'Approved'
                  ? 'bg-emerald-500'
                  : status === 'Pending'
                    ? 'bg-yellow-500'
                    : status === 'Rejected' || status === 'Declined'
                      ? 'bg-red-500'
                      : 'bg-gray-500'
              }`}
            ></span>
            {status}
          </span>
        );
      },
      className: 'min-w-[100px]',
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading wallet top-up data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error?.message || 'Failed to load wallet top-up data'}
          </p>
          <div className="text-gray-500 space-y-2 text-sm">
            <p>API URL: /admin/transaction/pending/topup</p>
            <p>Check browser console for detailed error information</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="hover:bg-primary-dark mt-4 rounded-lg bg-primary px-4 py-2 text-white"
          >
            Retry
          </button>
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
                Wallet Top-Up Report
              </h2>
              <p className="text-secondary-text dark:text-gray-400 mt-1 text-sm">
                Detailed log of all wallet funding requests, payment proofs, and
                verification status
              </p>
              {transformedData.length > 0 && (
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  Showing {filteredData.length} of {transformedData.length}{' '}
                  transactions
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportPDF}
                disabled={isExporting || transformedData.length === 0}
                className={`border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 relative flex h-10 items-center gap-2 overflow-hidden rounded-lg border bg-white px-4 text-sm font-semibold transition-colors ${
                  isExporting || transformedData.length === 0
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
                title="Export Table Data as PDF"
              >
                {isExporting ? (
                  <>
                    <div className="border-gray-300 border-t-gray-600 h-4 w-4 animate-spin rounded-full border-2"></div>
                    <span>Exporting... {exportProgress}%</span>
                    {/* Progress bar background */}
                    <div className="bg-gray-200 absolute bottom-0 left-0 h-0.5 w-full">
                      {/* Progress bar fill */}
                      <div
                        className="h-full bg-green-500 transition-all duration-300 ease-out"
                        style={{width: `${exportProgress}%`}}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <MdPictureAsPdf className="text-lg" />
                    <span>Export PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-orange-500 px-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                disabled={transformedData.length === 0}
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
            {calculatedStats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                trendDirection={stat.trendDirection as any}
                subtext={stat.subtext}
                icon={<span className="text-xl">{stat.icon}</span>}
                highlightValue={stat.highlightValue}
                alert={stat.alert}
              />
            ))}
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
                    placeholder="Select date range..."
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
                    <option>Approved</option>
                    <option>Declined</option>
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
          <div className="dark:border-gray-700 dark:bg-gray-800 overflow-hidden bg-white shadow-sm">
            <div className="flex-1">
              {transformedData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <svg
                    className="text-gray-400 mb-4 h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-gray-900 mb-2 text-lg font-medium">
                    No wallet top-up transactions found
                  </h3>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <svg
                    className="text-gray-400 mb-4 h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="text-gray-900 mb-2 text-lg font-medium">
                    No matching transactions
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <GenericTable
                  data={filteredData}
                  columns={columns}
                  itemsPerPage={10}
                  searchAble={false}
                  action={false}
                  paginationOff={false}
                />
              )}
            </div>
          </div>

          {/* Export Instructions */}
        </div>
      </div>
    </div>
  );
};

export default WalletReport;
