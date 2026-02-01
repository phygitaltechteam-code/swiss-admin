import React from 'react';
import {Client} from './types';
import {
  MdArrowDownward,
  MdMoreVert,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';

interface ClientTableProps {
  data: Client[];
}

const avatarColors = {
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  teal: 'bg-teal-50 text-teal-600',
  red: 'bg-red-50 text-red-600',
};

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Pending: 'bg-amber-50 text-amber-700 border-amber-100',
  Suspended: 'bg-red-50 text-red-700 border-red-100',
  Closed: 'bg-gray-100 text-gray-700 border-gray-200',
};

const ClientTable: React.FC<ClientTableProps> = ({data}) => {
  return (
    <div className="border-gray-200 flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="scrollbar-hide overflow-x-auto">
        <table className="divide-gray-200 min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="text-body-text px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                Client ID
              </th>
              <th
                scope="col"
                className="text-body-text group cursor-pointer px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                <div className="flex items-center gap-1">
                  Full Name
                  <MdArrowDownward className="text-gray-400 text-[16px] transition-colors group-hover:text-primary" />
                </div>
              </th>
              <th
                scope="col"
                className="text-body-text px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                Contact Info
              </th>
              <th
                scope="col"
                className="text-body-text px-6 py-4 text-right text-xs font-bold uppercase tracking-wider"
              >
                Total Assets
                <span className="block text-[10px] font-normal normal-case">
                  (Private + Temp)
                </span>
              </th>
              <th
                scope="col"
                className="text-body-text px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                Registration Date
              </th>
              <th
                scope="col"
                className="text-body-text px-6 py-4 text-center text-xs font-bold uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="text-body-text px-6 py-4 text-right text-xs font-bold uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-gray-200 divide-y bg-white">
            {data.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="text-body-text font-mono whitespace-nowrap px-6 py-4 text-sm">
                  {client.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className={`mr-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${avatarColors[client.avatarColor]}`}
                    >
                      {client.avatarInitials}
                    </div>
                    <div className="text-header-text text-sm font-bold">
                      {client.firstName} {client.lastName}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-header-text text-sm">
                      {client.phone}
                    </span>
                    <span className="text-body-text text-xs">
                      {client.email}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="text-header-text text-sm font-bold">
                    $
                    {client.totalAssets.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-body-text text-xs">
                    P: {client.privateAssets} | T: {client.tempAssets}
                  </div>
                </td>
                <td className="text-body-text whitespace-nowrap px-6 py-4 text-sm">
                  {client.registrationDate}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold leading-5 ${statusStyles[client.status]}`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button className="text-body-text hover:bg-gray-100 rounded-full p-1 transition-colors hover:text-primary">
                    <MdMoreVert className="text-[20px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-gray-200 flex items-center justify-between border-t bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-body-text text-sm">
              Showing <span className="text-header-text font-medium">1</span> to{' '}
              <span className="text-header-text font-medium">5</span> of{' '}
              <span className="text-header-text font-medium">2,450</span>{' '}
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
                className="border-gray-200 text-body-text hover:bg-gray-50 relative inline-flex items-center rounded-l-md border bg-white px-2 py-2 text-sm font-medium"
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
                className="border-gray-200 text-body-text hover:bg-gray-50 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium"
              >
                2
              </a>
              <a
                href="#"
                className="border-gray-200 text-body-text hover:bg-gray-50 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium"
              >
                3
              </a>
              <span className="border-gray-200 text-body-text relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium">
                ...
              </span>
              <a
                href="#"
                className="border-gray-200 text-body-text hover:bg-gray-50 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium"
              >
                15
              </a>
              <a
                href="#"
                className="border-gray-200 text-body-text hover:bg-gray-50 relative inline-flex items-center rounded-r-md border bg-white px-2 py-2 text-sm font-medium"
              >
                <span className="sr-only">Next</span>
                <MdChevronRight className="text-[20px]" />
              </a>
            </nav>
          </div>
        </div>

        {/* Mobile Pagination View */}
        <div className="flex w-full items-center justify-between gap-4 sm:hidden">
          <a
            href="#"
            className="border-gray-200 text-body-text hover:bg-gray-50 relative inline-flex flex-1 items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium"
          >
            Previous
          </a>
          <a
            href="#"
            className="border-gray-200 text-body-text hover:bg-gray-50 relative inline-flex flex-1 items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium"
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;
