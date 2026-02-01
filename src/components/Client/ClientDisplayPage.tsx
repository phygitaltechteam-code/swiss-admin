import React from 'react';
import {MdHome, MdChevronRight, MdAdd, MdSearch} from 'react-icons/md';
import {FiDownload} from 'react-icons/fi';
import Toggle from './Toggle';
import {Client} from '@/types/client';
import ClientTable from './ClientTable';

const MOCK_DATA: Client[] = [
  {
    id: '1',
    accountNumber: '8839201452',
    name: 'John Doe',
    mobile: '+1 (555) 234-8890',
    totalTrans: 142,
    transVolume: 45210.0,
    privateBalance: 12450.0,
    tempBalance: 250.0,
    isActive: true,
  },
  {
    id: '2',
    accountNumber: '1293844992',
    name: 'Sarah Smith',
    mobile: '+1 (555) 900-1234',
    totalTrans: 0,
    transVolume: 0.0,
    privateBalance: 0.0,
    tempBalance: 0.0,
    isActive: false,
  },
  {
    id: '3',
    accountNumber: '9928371003',
    name: 'Michael Brown',
    mobile: '+44 7700 900077',
    totalTrans: 23,
    transVolume: 8900.5,
    privateBalance: 450.5,
    tempBalance: 1200.0,
    isActive: false,
  },
  {
    id: '4',
    accountNumber: '4482910221',
    name: 'Emily Chen',
    mobile: '+1 (415) 555-0199',
    totalTrans: 892,
    transVolume: 214500.25,
    privateBalance: 8920.25,
    tempBalance: 50.0,
    isActive: true,
  },
  {
    id: '5',
    accountNumber: '7721093884',
    name: 'David Wilson',
    mobile: '+1 (212) 555-8821',
    totalTrans: 56,
    transVolume: 12100.0,
    privateBalance: 2100.0,
    tempBalance: 0.0,
    isActive: true,
  },
];

const ClientDisplay: React.FC = () => {
  return (
    <main className="ml-0 min-h-screen flex-1 bg-white p-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        {/* Breadcrumb */}

        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-header-text text-3xl font-bold tracking-tight">
              Client Management
            </h1>
            <p className="text-secondary-text mt-1 text-sm">
              View and manage detailed client account records and balances.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="text-header-text hover:bg-gray-50 flex items-center gap-2 rounded-lg border border-stroke px-4 py-2 text-sm font-semibold transition-colors">
              <FiDownload className="text-lg" />
              Export
            </button>
            <button className="hover:bg-primary-hover flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors">
              <MdAdd className="text-lg" />
              Add New Client
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col items-center gap-4 rounded-xl border border-stroke bg-white p-4 lg:flex-row">
          <div className="relative w-full lg:flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdSearch className="text-secondary-text text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search by name, account, email, or mobile number"
              className="placeholder-secondary-text block w-full rounded-lg border border-stroke py-2.5 pl-10 pr-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {/* Custom Select Wrapper for standardized arrow */}
            <div className="relative">
              <select className="text-secondary-text block w-full cursor-pointer appearance-none rounded-lg border border-stroke bg-white px-3 py-2.5 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48">
                <option value="">Private Balance</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <div className="text-gray-500 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="relative">
              <select className="text-secondary-text block w-full cursor-pointer appearance-none rounded-lg border border-stroke bg-white px-3 py-2.5 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48">
                <option value="">Temp Balance</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <div className="text-gray-500 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="relative">
              <select className="text-secondary-text block w-full cursor-pointer appearance-none rounded-lg border border-stroke bg-white px-3 py-2.5 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48">
                <option value="">Trans. Volume</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <div className="text-gray-500 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <ClientTable clients={MOCK_DATA} />
      </div>
    </main>
  );
};

export default ClientDisplay;
