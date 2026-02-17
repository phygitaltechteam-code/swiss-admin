import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useGetClients} from '@/lib/react-query/client';
import React, {useState, useEffect, useMemo} from 'react';
import {
  MdDownload,
  MdAdd,
  MdSearch,
  MdFilterList,
  MdOutlineAccountBalance,
  MdPerson,
  MdAttachMoney,
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdTrendingUp,
  MdTrendingDown,
  MdPictureAsPdf,
  MdPrint,
} from 'react-icons/md';

// Types based on your API response
interface ApiClient {
  id: string;
  userId: string;
  passport: string | null;
  aadharCard: string | null;
  panCard: string | null;
  passportNumber: string | null;
  aadharCardNumber: string | null;
  panCardNumber: string | null;
  accountNumber: string;
  address: string;
  city: string;
  photo: string;
  state: string;
  country: string;
  pincode: string;
  securityPin: string;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    fullname: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    dob: string | null;
    isVerified: boolean;
    isRejected: boolean;
  };
  wallets: Array<{
    eprivateAccount: number;
    temporyAccount: number;
  }>;
  _count: {
    senderTransactions: number;
  };
}

interface ClientRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
  transactions: number;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isRejected: boolean;
}

// Stats Card Component
interface StatCardProps {
  stat: {
    title: string;
    value: string;
    change: string;
    changeLabel: string;
    icon: React.ComponentType<{className?: string}>;
    color: string;
    trend: 'up' | 'down';
  };
}

const StatCard: React.FC<StatCardProps> = ({stat}) => {
  const Icon = stat.icon;

  return (
    <div className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-1 rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]}`}
        >
          <Icon className="text-lg" />
        </div>
        <p className="text-sm font-medium">{stat.title}</p>
      </div>
      <p className="text-gray-900 mt-1 text-2xl font-bold dark:text-white">
        {stat.value}
      </p>
      <div className="mt-2 flex items-center gap-1">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
            stat.trend === 'up'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-xs">
          {stat.changeLabel}
        </span>
      </div>
    </div>
  );
};

// Helper function to determine status
const getStatus = (client: ApiClient): string => {
  if (client.user.isRejected) return 'Rejected';
  if (!client.user.isActive) return 'Inactive';
  if (!client.user.isVerified) return 'Pending';
  return 'Active';
};

// Helper function to determine account type
const getAccountType = (client: ApiClient): string => {
  const totalBalance =
    (client.wallets?.[0]?.eprivateAccount || 0) +
    (client.wallets?.[0]?.temporyAccount || 0);

  if (totalBalance >= 100000) return 'Premium';
  if (totalBalance >= 50000) return 'Standard';
  return 'Basic';
};

// Helper function to calculate total balance
const getTotalBalance = (client: ApiClient): number => {
  return (
    (client.wallets?.[0]?.eprivateAccount || 0) +
    (client.wallets?.[0]?.temporyAccount || 0)
  );
};

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format compact currency for stats
const formatCompactCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

// PDF Export Service - Separate from React component
class PDFExportService {
  static async generateClientReport(
    data: ClientRow[],
    stats: any[],
    filename: string = 'clients_report.pdf',
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
      doc.text('Client List Report', pageWidth / 2, margin, {align: 'center'});

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
          (pageWidth - 2 * margin - 15) / Math.min(stats.length, 5);

        stats.forEach((stat, index) => {
          if (index >= 5) return; // Limit to 5 stats per row

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
            stat.title.length > 15
              ? stat.title.substring(0, 12) + '...'
              : stat.title;
          doc.text(title, x + 5, y + 8, {maxWidth: statBoxWidth - 10});

          // Add stat value
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const value = stat.value;
          doc.text(value, x + 5, y + 17, {maxWidth: statBoxWidth - 10});

          // Add stat change
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          const changeText =
            `${stat.change || ''} ${stat.changeLabel || ''}`.trim();
          if (changeText) {
            doc.text(changeText.substring(0, 20), x + 5, y + 23, {
              maxWidth: statBoxWidth - 10,
            });
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
            '#',
            'Client Name',
            'Email',
            'Phone',
            'Account Number',
            'Account Type',
            'Balance',
            'Status',
            'Transactions',
            'Join Date',
          ],
        ];

        const tableData = data.map((item, index) => [
          (index + 1).toString(),
          item.name.substring(0, 20),
          item.email.substring(0, 25),
          item.phone || 'N/A',
          item.accountNumber.substring(0, 15) || 'N/A',
          item.accountType,
          formatCurrency(item.balance),
          item.status,
          item.transactions.toString(),
          new Date(item.createdAt).toLocaleDateString(),
        ]);

        // Configure and generate autoTable
        (doc as any).autoTable({
          startY: tableStartY,
          head: headers,
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [41, 128, 185],
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
            0: {cellWidth: 8}, // Index
            1: {cellWidth: 25}, // Name
            2: {cellWidth: 30}, // Email
            3: {cellWidth: 18}, // Phone
            4: {cellWidth: 22}, // Account Number
            5: {cellWidth: 16}, // Account Type
            6: {cellWidth: 20}, // Balance
            7: {cellWidth: 15}, // Status
            8: {cellWidth: 15}, // Transactions
            9: {cellWidth: 18}, // Join Date
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
        doc.text('Client List (Limited Preview)', margin, tableStartY);

        // Simple header
        const headers = ['No.', 'Name', 'Email', 'Balance', 'Status'];
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
            (index + 1).toString(),
            item.name.substring(0, 15),
            item.email.substring(0, 15),
            formatCurrency(item.balance),
            item.status.substring(0, 10),
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
      doc.text(`Total Clients: ${data.length}`, margin, finalY + 10);

      // Add company info
      doc.setFontSize(8);
      doc.text('Client Management System © 2024', pageWidth / 2, finalY + 10, {
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
    data: ClientRow[],
    stats: any[],
    exportAll: boolean,
  ): Promise<void> {
    const filename = exportAll
      ? 'all_clients_report.pdf'
      : 'filtered_clients_report.pdf';
    await this.generateClientReport(data, stats, filename);
  }
}

// Main Page Component
const ClientListReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Use the React Query hook to fetch clients
  const {data: apiResponse, isLoading, isError, error} = useGetClients();

  // Get the actual client data from API response
  const rawClientData: ApiClient[] = useMemo(() => {
    if (!apiResponse) {
      console.log('No API response yet');
      return [];
    }

    // Check different possible response structures
    if (Array.isArray(apiResponse)) {
      console.log('API response is already an array');
      return apiResponse;
    }

    if (apiResponse.data && Array.isArray(apiResponse.data)) {
      console.log('Found data array in apiResponse.data');
      return apiResponse.data;
    }

    console.log('Unexpected API response structure:', apiResponse);
    return [];
  }, [apiResponse]);

  // Calculate dynamic stats from the data
  const dynamicStats = useMemo(() => {
    const totalClients = rawClientData.length;

    // Calculate active clients (based on status)
    const activeClients = rawClientData.filter((client) => {
      const status = getStatus(client);
      return status === 'Active';
    }).length;

    // Calculate total balance
    const totalBalance =
      rawClientData.reduce((sum, client) => {
        return sum + getTotalBalance(client);
      }, 0) / 100; // Divide by 100 if balance is in cents

    // Calculate average transactions per client
    const totalTransactions = rawClientData.reduce((sum, client) => {
      return sum + (client._count?.senderTransactions || 0);
    }, 0);

    const avgTransactions =
      totalClients > 0 ? totalTransactions / totalClients : 0;

    // Calculate verified clients
    const verifiedClients = rawClientData.filter(
      (client) => client.user?.isVerified,
    ).length;

    // Calculate percentage changes (for demo, you can replace with real data)
    const clientGrowth = totalClients > 0 ? '+12%' : '+0%';
    const activeGrowth = activeClients > 0 ? '+8%' : '+0%';
    const balanceGrowth = totalBalance > 0 ? '+15%' : '+0%';
    const activityGrowth = avgTransactions > 0 ? '-2 days' : '0 days';

    return [
      {
        title: 'Total Clients',
        value: totalClients.toLocaleString(),
        change: clientGrowth,
        changeLabel: 'vs last month',
        icon: MdPerson,
        color: 'bg-orange-100 text-orange-600',
        trend: 'up' as const,
      },
      {
        title: 'Active Clients',
        value: activeClients.toLocaleString(),
        change: activeGrowth,
        changeLabel: 'vs last month',
        icon: MdOutlineAccountBalance,
        color: 'bg-orange-100 text-orange-600',
        trend: 'up' as const,
      },
      {
        title: 'Total Balance',
        value: formatCompactCurrency(totalBalance),
        change: balanceGrowth,
        changeLabel: 'vs last quarter',
        icon: MdAttachMoney,
        color: 'bg-orange-100 text-orange-600',
        trend: 'up' as const,
      },
      {
        title: 'Avg. Transactions',
        value: avgTransactions.toFixed(1),
        change: activityGrowth,
        changeLabel: 'per client',
        icon: MdCalendarToday,
        color: 'bg-orange-100 text-orange-600',
        trend: activityGrowth.startsWith('-')
          ? ('down' as const)
          : ('up' as const),
      },
      {
        title: 'Verified Clients',
        value: verifiedClients.toString(),
        change: verifiedClients > 0 ? '+5%' : '+0%',
        changeLabel: 'vs last month',
        icon: MdCheckCircle,
        color: 'bg-orange-100 text-orange-600',
        trend: 'up' as const,
      },
    ];
  }, [rawClientData]);

  // Transform API data to ClientRow format
  const clientData: ClientRow[] = useMemo(() => {
    console.log('Transforming', rawClientData.length, 'clients');

    return rawClientData.map((client) => {
      const balance = getTotalBalance(client);

      return {
        id: client.id,
        name: client.user?.fullname || 'N/A',
        email: client.user?.email || 'N/A',
        phone: client.user?.phoneNumber || 'N/A',
        city: client.city || 'N/A',
        state: client.state || 'N/A',
        accountNumber: client.accountNumber || 'N/A',
        accountType: getAccountType(client),
        balance: balance / 100, // Assuming balance is in cents/paisa
        status: getStatus(client),
        transactions: client._count?.senderTransactions || 0,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        isVerified: client.user?.isVerified || false,
        isRejected: client.user?.isRejected || false,
      };
    });
  }, [rawClientData]);

  // Filter data
  const filteredData = clientData.filter((item) => {
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.phone.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (
      accountTypeFilter &&
      accountTypeFilter !== '' &&
      accountTypeFilter !== 'All Types' &&
      item.accountType.toLowerCase() !== accountTypeFilter.toLowerCase()
    ) {
      return false;
    }

    if (
      statusFilter &&
      statusFilter !== '' &&
      statusFilter !== 'All Status' &&
      item.status.toLowerCase() !== statusFilter.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const handlePrint = () => {
    if (filteredData.length === 0) {
      alert('No data to print. Adjust your filters and try again.');
      return;
    }

    // Compute stats from the filtered data
    const totalClients = filteredData.length;
    const activeClients = filteredData.filter(
      (c) => c.status === 'Active',
    ).length;
    const totalBalance = filteredData.reduce((sum, c) => sum + c.balance, 0);
    const avgTransactions =
      totalClients > 0
        ? filteredData.reduce((sum, c) => sum + c.transactions, 0) /
          totalClients
        : 0;
    const verifiedClients = filteredData.filter((c) => c.isVerified).length;

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

    // Build filter summary
    const filterParts = [];
    if (searchQuery) filterParts.push(`Search: "${searchQuery}"`);
    if (accountTypeFilter && accountTypeFilter !== 'All Types')
      filterParts.push(`Account Type: ${accountTypeFilter}`);
    if (statusFilter && statusFilter !== 'All Status')
      filterParts.push(`Status: ${statusFilter}`);
    const filterSummary = filterParts.length
      ? filterParts.join(' • ')
      : 'No filters applied';

    // Build table rows
    const tableRows = filteredData
      .map(
        (client, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <div><strong>${client.name}</strong></div>
          <div style="color: #6B7280; font-size: 11px;">${client.email}</div>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${client.phone}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${client.accountNumber}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${client.accountType}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">
          ${formatCurrency(client.balance)}
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 50px; font-size: 11px; font-weight: 600; background: ${
            client.status === 'Active'
              ? '#d1fae5'
              : client.status === 'Pending'
                ? '#fef3c7'
                : client.status === 'Rejected'
                  ? '#fee2e2'
                  : '#e5e7eb'
          }; color: ${
            client.status === 'Active'
              ? '#065f46'
              : client.status === 'Pending'
                ? '#92400e'
                : client.status === 'Rejected'
                  ? '#991b1b'
                  : '#374151'
          };">
            ${client.status}
          </span>
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${client.transactions}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${new Date(client.createdAt).toLocaleDateString()}</td>
      </tr>
    `,
      )
      .join('');

    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Client List Report</title>
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
          <h1>Client List Report</h1>
          <div class="header-row">
            <span>Generated: ${dateStr} ${timeStr}</span>
            <span>Total clients: ${totalClients}</span>
          </div>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-title">Total Clients</div>
            <div class="stat-value">${totalClients}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Active Clients</div>
            <div class="stat-value">${activeClients}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Balance</div>
            <div class="stat-value">${formatCurrency(totalBalance)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Avg. Transactions</div>
            <div class="stat-value">${avgTransactions.toFixed(1)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Verified Clients</div>
            <div class="stat-value">${verifiedClients}</div>
          </div>
        </div>

        <div class="filter-summary">
          <strong>Applied filters:</strong> ${filterSummary}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Phone</th>
              <th>Account Number</th>
              <th>Account Type</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Transactions</th>
              <th>Join Date</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          Printed from Client Management System
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

  // Define columns for GenericTable
  const columns: Column<ClientRow>[] = [
    {
      header: 'Client Name',
      accessor: 'name',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-semibold dark:text-white">
            {item.name}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {item.email}
          </span>
          <div className="mt-1 flex items-center gap-1">
            {item.isVerified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <MdCheckCircle className="h-3 w-3" />
                Verified
              </span>
            )}
            {item.isRejected && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-1.5 py-0.5 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <MdCancel className="h-3 w-3" />
                Rejected
              </span>
            )}
          </div>
        </div>
      ),
      className: 'min-w-[200px]',
      sortable: true,
    },
    {
      header: 'Contact',
      accessor: 'phone',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm dark:text-white">
            {item.phone}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {item.city}, {item.state}
          </span>
        </div>
      ),
      className: 'min-w-[140px]',
    },
    {
      header: 'Account Details',
      accessor: 'accountNumber',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-medium dark:text-white">
            {item.accountNumber}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {item.accountType}
          </span>
        </div>
      ),
      className: 'min-w-[140px]',
    },
    {
      header: 'Balance',
      accessor: 'balance',
      render: (item) => (
        <span className="text-gray-900 text-sm font-bold dark:text-white">
          {formatCurrency(item.balance)}
        </span>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => {
        const getStatusIcon = () => {
          switch (item.status) {
            case 'Active':
              return;
            case 'Pending':
              return;
            case 'Rejected':
              return;
            case 'Inactive':
              return;
            default:
              return null;
          }
        };

        return <span>{item.status}</span>;
      },
      className: 'min-w-[110px]',
    },
    {
      header: 'Transactions',
      accessor: 'transactions',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-medium dark:text-white">
            {item.transactions}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {item.transactions > 0 ? 'Completed' : 'No transactions'}
          </span>
        </div>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Join Date',
      accessor: 'createdAt',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm dark:text-white">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            Last: {new Date(item.updatedAt).toLocaleDateString()}
          </span>
        </div>
      ),
      className: 'min-w-[140px]',
      sortable: true,
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading clients...</p>
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
          <h3 className="mb-2 text-lg font-semibold">Error Loading Clients</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error?.message || 'Failed to load client data'}
          </p>
          <div className="text-gray-500 space-y-2 text-sm">
            <p>API URL: http://192.168.29.165:4400/api/v1/admin/customer</p>
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
      <main className="flex min-h-screen flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 p-6 md:p-10">
          {/* Page Title & Actions */}
          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Client List Report
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                Comprehensive directory of all registered clients, assets, and
                account statuses.
              </p>
              {clientData.length > 0 && (
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  Showing {filteredData.length} of {clientData.length} clients
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePrint}
                className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-orange-500 px-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                title="Print"
              >
                <MdPrint className="text-lg" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {dynamicStats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>

          {/* Table Section */}
          <div className="flex flex-col gap-4">
            {/* Custom Filter Bar */}
            <div className="dark:border-gray-700 dark:bg-gray-800 flex flex-col items-start justify-between gap-4 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
              <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 lg:w-64 lg:flex-none">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdSearch className="text-gray-400" size={20} />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                    placeholder="Search clients by name, email, account..."
                    type="text"
                  />
                </div>

                {/* Account Type Filter */}
                <div className="relative">
                  <select
                    value={accountTypeFilter}
                    onChange={(e) => setAccountTypeFilter(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option value="">All Types</option>
                    <option value="premium">Premium</option>
                    <option value="standard">Standard</option>
                    <option value="basic">Basic</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="dark:border-gray-700 dark:bg-gray-800 text-header-text block w-full cursor-pointer appearance-none rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary dark:text-white"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generic Table Container */}
            <div className="dark:border-gray-700 dark:bg-gray-800 overflow-hidden bg-white shadow-sm">
              <div className="flex-1">
                {clientData.length === 0 ? (
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
                      No clients found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {rawClientData.length === 0
                        ? 'No data loaded from API. Check console for details.'
                        : 'Data transformation may have failed.'}
                    </p>
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
                      No matching clients
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  <GenericTable
                    data={filteredData}
                    columns={columns}
                    searchAble={false}
                    itemsPerPage={10}
                    viewTooltip="View Client Details"
                    editTooltip="Edit Client"
                    deleteTooltip="Delete Client"
                    variant="default"
                  />
                )}
              </div>
            </div>

            {/* Export Instructions */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientListReport;
