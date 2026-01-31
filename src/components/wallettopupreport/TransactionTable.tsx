import React from 'react';
import {Transaction} from './types';
import {
  MdAttachFile,
  MdImage,
  MdPictureAsPdf,
  MdBlock,
  MdArrowDownward,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';

const transactions: Transaction[] = [
  {
    id: 'REQ-89021',
    requestId: '#REQ-89021',
    clientName: 'John Doe',
    clientInitials: 'JD',
    clientColor:
      'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
    accountType: 'E-Private',
    amount: 5000.0,
    date: 'Oct 24, 2023',
    paymentProof: {type: 'View', label: 'View'},
    status: 'Completed',
  },
  {
    id: 'REQ-89020',
    requestId: '#REQ-89020',
    clientName: 'Alice Smith',
    clientInitials: 'AS',
    clientColor:
      'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300',
    accountType: 'Temp',
    amount: 1200.0,
    date: 'Oct 24, 2023',
    paymentProof: {type: 'Image', label: 'Proof.jpg'},
    status: 'Pending',
  },
  {
    id: 'REQ-89019',
    requestId: '#REQ-89019',
    clientName: 'Robert Johnson',
    clientInitials: 'RJ',
    clientColor:
      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300',
    accountType: 'E-Private',
    amount: 15000.0,
    date: 'Oct 23, 2023',
    paymentProof: {type: 'PDF', label: 'Receipt.pdf'},
    status: 'Completed',
  },
  {
    id: 'REQ-89018',
    requestId: '#REQ-89018',
    clientName: 'Maria Williams',
    clientInitials: 'MW',
    clientColor:
      'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300',
    accountType: 'Temp',
    amount: 350.0,
    date: 'Oct 22, 2023',
    paymentProof: {type: 'Missing', label: 'Missing'},
    status: 'Rejected',
  },
  {
    id: 'REQ-89017',
    requestId: '#REQ-89017',
    clientName: 'David Brown',
    clientInitials: 'DB',
    clientColor:
      'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300',
    accountType: 'E-Private',
    amount: 2500.0,
    date: 'Oct 21, 2023',
    paymentProof: {type: 'View', label: 'Slip.png'},
    status: 'Completed',
  },
];

const TransactionTable: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProofIcon = (type: string) => {
    switch (type) {
      case 'View':
        return <MdAttachFile className="text-[18px]" />;
      case 'Image':
        return <MdImage className="text-[18px]" />;
      case 'PDF':
        return <MdPictureAsPdf className="text-[18px]" />;
      case 'Missing':
        return <MdBlock className="text-[18px]" />;
      default:
        return null;
    }
  };

  return (
    <div className="border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-[#111a22]">
      <div className="overflow-x-auto">
        <table className="divide-gray-200 dark:divide-gray-800 min-w-full divide-y">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th
                scope="col"
                className="text-text-muted dark:text-gray-400 group cursor-pointer px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                <div className="flex items-center gap-1">
                  Date
                  <MdArrowDownward className="text-gray-400 text-[16px] group-hover:text-primary" />
                </div>
              </th>
              <th
                scope="col"
                className="text-text-muted dark:text-gray-400 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                Request ID
              </th>
              <th
                scope="col"
                className="text-text-muted dark:text-gray-400 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                Client Name
              </th>
              <th
                scope="col"
                className="text-text-muted dark:text-gray-400 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                Account Type
              </th>
              <th
                scope="col"
                className="text-text-muted dark:text-gray-400 px-6 py-4 text-right text-xs font-bold uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="text-text-muted dark:text-gray-400 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider"
              >
                Payment Proof
              </th>
              <th
                scope="col"
                className="text-text-muted dark:text-gray-400 px-6 py-4 text-right text-xs font-bold uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-gray-200 dark:divide-gray-800 divide-y bg-white dark:bg-[#111a22]">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="text-text-main whitespace-nowrap px-6 py-4 text-sm font-medium dark:text-white">
                  {transaction.date}
                </td>
                <td className="text-text-muted dark:text-gray-300 font-mono whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.requestId}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${transaction.clientColor}`}
                    >
                      {transaction.clientInitials}
                    </div>
                    <div className="text-text-main text-sm font-medium dark:text-white">
                      {transaction.clientName}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                    {transaction.accountType}
                  </span>
                </td>
                <td className="text-text-main whitespace-nowrap px-6 py-4 text-right text-sm font-bold dark:text-white">
                  $
                  {transaction.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <span
                    className={`${transaction.paymentProof.type === 'Missing' ? 'text-gray-400' : 'cursor-pointer text-primary hover:text-blue-600'} inline-flex items-center gap-1 text-sm font-medium`}
                  >
                    {getProofIcon(transaction.paymentProof.type)}
                    {transaction.paymentProof.label}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${getStatusColor(transaction.status)}`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-gray-200 dark:border-gray-800 flex items-center justify-between border-t bg-white px-4 py-3 dark:bg-[#111a22] sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-text-muted dark:text-gray-400 text-sm">
              Showing{' '}
              <span className="text-text-main font-medium dark:text-white">
                1
              </span>{' '}
              to{' '}
              <span className="text-text-main font-medium dark:text-white">
                5
              </span>{' '}
              of{' '}
              <span className="text-text-main font-medium dark:text-white">
                124
              </span>{' '}
              results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#"
                className="border-gray-200 dark:border-gray-700 text-text-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-l-md border bg-white px-2 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                <span className="sr-only">Previous</span>
                <MdChevronLeft className="text-[20px]" />
              </a>
              <a
                href="#"
                aria-current="page"
                className="relative z-10 inline-flex items-center border border-primary bg-primary/10 px-4 py-2 text-sm font-bold text-primary"
              >
                1
              </a>
              <a
                href="#"
                className="border-gray-200 dark:border-gray-700 text-text-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                2
              </a>
              <a
                href="#"
                className="border-gray-200 dark:border-gray-700 text-text-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                3
              </a>
              <span className="border-gray-200 dark:border-gray-700 text-text-muted dark:text-gray-400 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]">
                ...
              </span>
              <a
                href="#"
                className="border-gray-200 dark:border-gray-700 text-text-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                12
              </a>
              <a
                href="#"
                className="border-gray-200 dark:border-gray-700 text-text-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-r-md border bg-white px-2 py-2 text-sm font-medium dark:bg-[#111a22]"
              >
                <span className="sr-only">Next</span>
                <MdChevronRight className="text-[20px]" />
              </a>
            </nav>
          </div>
        </div>

        {/* Mobile Pagination */}
        <div className="flex w-full items-center justify-between gap-4 sm:hidden">
          <a
            href="#"
            className="border-gray-200 dark:border-gray-700 text-text-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
          >
            Previous
          </a>
          <a
            href="#"
            className="border-gray-200 dark:border-gray-700 text-text-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium dark:bg-[#111a22]"
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
