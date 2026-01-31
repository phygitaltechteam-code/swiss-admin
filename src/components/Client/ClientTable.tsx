import React from 'react';
import {MdVisibility} from 'react-icons/md';
import Toggle from './Toggle';
import {Client} from '@/types/client';

interface ClientTableProps {
  clients: Client[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const ClientTable: React.FC<ClientTableProps> = ({clients}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-stroke bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-stroke bg-neutral-50 text-left">
              <th className="text-secondary-text w-48 px-6 py-4 text-xs font-semibold uppercase tracking-wider">
                Account Details
              </th>
              <th className="text-secondary-text px-6 py-4 text-xs font-semibold uppercase tracking-wider">
                Mobile Number
              </th>
              <th className="text-secondary-text px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Total Trans.
              </th>
              <th className="text-secondary-text px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Trans. Volume
              </th>
              <th className="text-secondary-text px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Private Balance
              </th>
              <th className="text-secondary-text px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Temp Balance
              </th>
              <th className="text-secondary-text w-56 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke">
            {clients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 group transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-header-text font-mono text-sm font-bold tracking-tight">
                      {client.accountNumber}
                    </span>
                    <span className="text-secondary-text mt-0.5 text-xs">
                      {client.name}
                    </span>
                  </div>
                </td>
                <td className="text-header-text px-6 py-4 text-sm font-medium">
                  {client.mobile}
                </td>
                <td className="text-header-text px-6 py-4 text-right text-sm font-medium">
                  {client.totalTrans}
                </td>
                <td className="text-header-text px-6 py-4 text-right text-sm font-medium">
                  {formatCurrency(client.transVolume)}
                </td>
                <td className="text-header-text font-mono px-6 py-4 text-right text-sm font-bold tracking-tight">
                  {formatCurrency(client.privateBalance)}
                </td>
                <td className="text-secondary-text font-mono px-6 py-4 text-right text-sm font-medium tracking-tight">
                  {formatCurrency(client.tempBalance)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <button className="text-secondary-text rounded-full p-1 transition-colors hover:bg-orange-50 hover:text-primary">
                      <MdVisibility size={20} />
                    </button>
                    <button className="hover:text-primary-hover text-xs font-bold text-primary transition-colors">
                      See History
                    </button>
                    <Toggle checked={client.isActive} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-stroke px-6 py-4">
        <p className="text-secondary-text text-sm">
          Showing <span className="text-header-text font-bold">1</span> to{' '}
          <span className="text-header-text font-bold">{clients.length}</span>{' '}
          of <span className="text-header-text font-bold">97</span> results
        </p>
        <div className="flex gap-1">
          <button className="border-gray-300 text-secondary-text hover:bg-gray-50 flex h-8 w-8 items-center justify-center rounded border disabled:opacity-50">
            <span className="material-symbols-outlined text-sm font-bold">
              &lt;
            </span>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded bg-primary text-sm font-bold text-white shadow-sm">
            1
          </button>
          <button className="border-gray-300 text-header-text hover:bg-gray-50 flex h-8 w-8 items-center justify-center rounded border text-sm font-bold">
            2
          </button>
          <button className="border-gray-300 text-header-text hover:bg-gray-50 flex h-8 w-8 items-center justify-center rounded border text-sm font-bold">
            3
          </button>
          <div className="text-secondary-text flex h-8 w-8 items-center justify-center text-sm font-bold">
            ...
          </div>
          <button className="border-gray-300 text-header-text hover:bg-gray-50 flex h-8 w-8 items-center justify-center rounded border text-sm font-bold">
            10
          </button>
          <button className="border-gray-300 text-secondary-text hover:bg-gray-50 flex h-8 w-8 items-center justify-center rounded border">
            <span className="material-symbols-outlined text-sm font-bold">
              &gt;
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;
