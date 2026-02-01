import React from 'react';
import {BENEFICIARIES} from './constants';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';

const BeneficiaryTable: React.FC = () => {
  return (
    <div className="border-border-light flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="divide-border-light min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              {[
                'Beneficiary Name',
                'Linked Client',
                'Bank Name',
                'Account Number',
                'Country',
                'Currency',
                'Status',
              ].map((header, index) => (
                <th
                  key={header}
                  scope="col"
                  className={`text-text-secondary px-6 py-4 text-xs font-bold uppercase tracking-wider ${index === 6 ? 'text-right' : 'text-left'}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border-light divide-y bg-white">
            {BENEFICIARIES.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 group transition-colors"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-bg flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-primary">
                      {item.initials}
                    </div>
                    <div className="text-text-main text-sm font-bold">
                      {item.name}
                    </div>
                  </div>
                </td>
                <td className="text-text-secondary whitespace-nowrap px-6 py-4 text-sm">
                  {item.client}
                </td>
                <td className="text-text-main whitespace-nowrap px-6 py-4 text-sm font-medium">
                  {item.bank}
                </td>
                <td className="font-mono text-text-secondary whitespace-nowrap px-6 py-4 text-sm">
                  {item.account}
                </td>
                <td className="text-text-main whitespace-nowrap px-6 py-4 text-sm">
                  {item.country}
                </td>
                <td className="text-text-secondary whitespace-nowrap px-6 py-4 text-sm">
                  {item.currency}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold leading-5 ${
                      item.status === 'Approved'
                        ? 'bg-primary-bg text-primary'
                        : 'bg-gray-100 text-text-secondary'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-border-light flex items-center justify-between border-t px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-text-secondary text-sm">
              Showing <span className="text-text-main font-bold">1</span> to{' '}
              <span className="text-text-main font-bold">6</span> of{' '}
              <span className="text-text-main font-bold">12,450</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button className="border-border-light text-text-secondary hover:bg-gray-50 relative inline-flex items-center rounded-l-md border bg-white px-2 py-2 text-sm font-medium">
                <span className="sr-only">Previous</span>
                <MdChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                aria-current="page"
                className="bg-primary-bg relative z-10 inline-flex items-center border border-primary px-4 py-2 text-sm font-bold text-primary"
              >
                1
              </button>
              <button className="border-border-light text-text-secondary hover:bg-gray-50 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium">
                2
              </button>
              <button className="border-border-light text-text-secondary hover:bg-gray-50 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium">
                3
              </button>
              <span className="border-border-light text-text-secondary relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium">
                ...
              </span>
              <button className="border-border-light text-text-secondary hover:bg-gray-50 relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium">
                125
              </button>
              <button className="border-border-light text-text-secondary hover:bg-gray-50 relative inline-flex items-center rounded-r-md border bg-white px-2 py-2 text-sm font-medium">
                <span className="sr-only">Next</span>
                <MdChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
        {/* Mobile Pagination */}
        <div className="flex w-full items-center justify-between gap-4 sm:hidden">
          <button className="border-border-light text-text-secondary hover:bg-gray-50 relative inline-flex flex-1 items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium">
            Previous
          </button>
          <button className="border-border-light text-text-secondary hover:bg-gray-50 relative inline-flex flex-1 items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryTable;
