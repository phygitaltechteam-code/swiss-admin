import React from 'react';
import {MdEdit, MdDelete, MdSearch, MdExpandMore, MdAdd} from 'react-icons/md';

interface CommissionTableProps {
  data: Commission[];
}

export interface Commission {
  id: number;
  name: string;
  description: string;
  appliedOn: string;
  appliedOnColor: string;
  percentage: number;
  status: 'Active' | 'Inactive';
}

const CommissionTable: React.FC<CommissionTableProps> = ({data}) => {
  return (
    <div className="ml-0 min-h-screen flex-1 p-8">
      <div className="flex flex-col gap-4">
        {/* Title Section */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#0F1535] dark:text-white">
              Commission Structure
            </h1>
            <p className="mt-1 text-[#9c6949]">
              Manage banking fees and commission rules applied to transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#f4ece7] bg-white shadow-sm dark:border-[#3a2a20] dark:bg-[#1a120b]">
        {/* Table Toolbar */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#f4ece7] p-5 dark:border-[#3a2a20] sm:flex-row sm:items-center">
          <div className="flex max-w-2xl flex-1 gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MdSearch className="text-[20px] text-[#9c6949]" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border-none bg-[#f8f7f5] py-2.5 pl-10 pr-3 text-sm text-[#0F1535] placeholder-[#9c6949] focus:ring-2 focus:ring-primary/20 dark:bg-[#2c2019] dark:text-white"
                placeholder="Search commissions by name..."
              />
            </div>

            {/* Filter */}
            <div className="relative w-40">
              <select className="block w-full cursor-pointer appearance-none rounded-lg border-none bg-[#f8f7f5] py-2.5 pl-3 pr-10 text-sm text-[#0F1535] focus:ring-2 focus:ring-primary/20 dark:bg-[#2c2019] dark:text-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <MdExpandMore className="text-[20px] text-[#9c6949]" />
              </div>
            </div>
          </div>

          {/* Add Button */}
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#d96d2b] hover:shadow">
            <MdAdd className="text-[20px]" />
            Add New Commission
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#f4ece7] bg-[#f8f7f5]/50 dark:border-[#3a2a20] dark:bg-[#2c2019]/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#0F1535] dark:text-white/90">
                  Commission Name
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#0F1535] dark:text-white/90">
                  Applied On
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#0F1535] dark:text-white/90">
                  Percentage (%)
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#0F1535] dark:text-white/90">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#0F1535] dark:text-white/90">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ece7] dark:divide-[#3a2a20]">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-[#f8f7f5] dark:hover:bg-[#2c2019]"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#0F1535] dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-xs text-[#9c6949]">
                        {item.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.appliedOnColor}`}
                    >
                      {item.appliedOn}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium tabular-nums text-[#0F1535] dark:text-white">
                      {item.percentage.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
                        <span className="bg-gray-500 size-1.5 rounded-full"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        className="rounded-lg p-2 text-[#9c6949] transition-colors hover:bg-primary/10 hover:text-primary"
                        title="Edit"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        className="rounded-lg p-2 text-[#9c6949] transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#f4ece7] p-4 dark:border-[#3a2a20]">
          <span className="text-xs text-[#9c6949]">
            Showing{' '}
            <span className="font-medium text-[#0F1535] dark:text-white">
              1-5
            </span>{' '}
            of{' '}
            <span className="font-medium text-[#0F1535] dark:text-white">
              12
            </span>{' '}
            results
          </span>
          <div className="flex items-center gap-2">
            <button
              className="rounded px-3 py-1 text-sm text-[#9c6949] transition-colors hover:bg-[#f8f7f5] hover:text-[#0F1535] disabled:opacity-50 dark:hover:bg-[#2c2019] dark:hover:text-white"
              disabled
            >
              Previous
            </button>
            <button className="rounded bg-primary px-3 py-1 text-sm text-white shadow-sm">
              1
            </button>
            <button className="rounded px-3 py-1 text-sm text-[#9c6949] transition-colors hover:bg-[#f8f7f5] hover:text-[#0F1535] dark:hover:bg-[#2c2019] dark:hover:text-white">
              2
            </button>
            <button className="rounded px-3 py-1 text-sm text-[#9c6949] transition-colors hover:bg-[#f8f7f5] hover:text-[#0F1535] dark:hover:bg-[#2c2019] dark:hover:text-white">
              3
            </button>
            <span className="text-[#9c6949]">...</span>
            <button className="rounded px-3 py-1 text-sm text-[#9c6949] transition-colors hover:bg-[#f8f7f5] hover:text-[#0F1535] dark:hover:bg-[#2c2019] dark:hover:text-white">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionTable;
