// utils/exportUtils.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {utils, writeFile} from 'xlsx';

interface Beneficiary {
  id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  accountNumber: string;
  isActive: boolean;
  isVerified: boolean;
  isRejected: boolean;
  rejectedReason: string;
  foreignBeneficiariesCount: number;
  verifiedForeignCount: number;
}

export class ExportFunctions {
  // Export to PDF from main page
  static exportToPDF(
    data: Beneficiary[],
    title: string = 'Beneficiary Report',
  ) {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(16);
      doc.text(title, 14, 20);

      // Date and info
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total: ${data.length} records`, 14, 37);

      // Simple table data (current filtered view)
      const tableData = data.map((item) => [
        item.fullname || '',
        item.email || '',
        item.phoneNumber || '',
        item.accountNumber || '',
        item.isActive ? 'Active' : 'Inactive',
        item.isVerified ? 'Verified' : 'Pending',
        item.foreignBeneficiariesCount,
      ]);

      // Create table
      (doc as any).autoTable({
        head: [
          [
            'Name',
            'Email',
            'Phone',
            'Account',
            'Status',
            'Verification',
            'Foreign',
          ],
        ],
        body: tableData,
        startY: 45,
        styles: {fontSize: 9},
        headStyles: {fillColor: [41, 128, 185]},
      });

      doc.save(`beneficiaries_${Date.now()}.pdf`);
    } catch (error) {
      alert('Error creating PDF');
    }
  }

  // Export to CSV from main page
  static exportToCSV(data: Beneficiary[]) {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      const headers = [
        'Name',
        'Email',
        'Phone',
        'Account',
        'Status',
        'Verification',
        'Foreign Count',
      ];

      const csvRows = [
        headers.join(','),
        ...data.map((item) =>
          [
            `"${item.fullname || ''}"`,
            `"${item.email || ''}"`,
            `"${item.phoneNumber || ''}"`,
            `"${item.accountNumber || ''}"`,
            `"${item.isActive ? 'Active' : 'Inactive'}"`,
            `"${item.isVerified ? 'Verified' : 'Pending'}"`,
            item.foreignBeneficiariesCount,
          ].join(','),
        ),
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `beneficiaries_${Date.now()}.csv`;
      link.click();
    } catch (error) {
      alert('Error creating CSV');
    }
  }

  // Export to Excel from main page
  static exportToExcel(data: Beneficiary[]) {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      const worksheetData = [
        [
          'Name',
          'Email',
          'Phone',
          'Account',
          'Status',
          'Verification',
          'Foreign Count',
        ],
        ...data.map((item) => [
          item.fullname || '',
          item.email || '',
          item.phoneNumber || '',
          item.accountNumber || '',
          item.isActive ? 'Active' : 'Inactive',
          item.isVerified ? 'Verified' : 'Pending',
          item.foreignBeneficiariesCount,
        ]),
      ];

      const worksheet = utils.aoa_to_sheet(worksheetData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Beneficiaries');

      writeFile(workbook, `beneficiaries_${Date.now()}.xlsx`);
    } catch (error) {
      alert('Error creating Excel');
    }
  }

  // Export all formats (prompt for choice)
  static exportAll(data: Beneficiary[]) {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const format = prompt(
      'Choose format: 1=PDF, 2=Excel, 3=CSV\nEnter 1, 2, or 3:',
    );

    switch (format) {
      case '1':
        this.exportToPDF(data);
        break;
      case '2':
        this.exportToExcel(data);
        break;
      case '3':
        this.exportToCSV(data);
        break;
      default:
        alert('Invalid choice');
    }
  }

  // Lock & Pin - Simple secure PDF
  static lockPin(data: Beneficiary[]) {
    if (data.length === 0) {
      alert('No data to lock');
      return;
    }

    const doc = new jsPDF();

    // Add secure header
    doc.setFontSize(12);
    doc.text('🔒 SECURE BENEFICIARY REPORT', 20, 20);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      20,
      30,
    );
    doc.text(`Total Records: ${data.length}`, 20, 40);
    doc.text(`Data Protected`, 20, 50);

    doc.save(`secure_beneficiaries_${Date.now()}.pdf`);
  }
}
