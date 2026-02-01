import React, {useState} from 'react';
import {
  MdFilterList,
  MdDownload,
  MdPayments,
  MdTrendingUp,
  MdToday,
  MdHourglassEmpty,
  MdCheckCircle,
  MdCancel,
  MdSearch,
  MdRefresh,
  MdMoreHoriz,
  MdVisibility,
} from 'react-icons/md';
import {TransactionTransfer} from '@/types/transactionhistory';
import {useNavigate} from '@tanstack/react-router';
import GenericButton from '../Forms/Buttons/GenericButton';
import GenericTable from '../Forms/Table/GenericTable';

const StatCard = ({
  label,
  value,
  subValue,
  subValueColor,
  icon,
  iconBgColor,
  iconColor,
}: any) => (
  <div className="group flex h-full flex-col justify-between rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-start justify-between">
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <span
        className={`rounded-lg p-2 ${iconBgColor} ${iconColor} transition-transform group-hover:scale-110`}
      >
        {icon}
      </span>
    </div>
    <h3 className="text-gray-900 text-2xl font-bold">{value}</h3>
    <p
      className={`mt-1 flex items-center gap-1 text-xs font-bold ${subValueColor}`}
    >
      {subValue}
    </p>
  </div>
);

const transactions: TransactionTransfer[] = [
  {
    id: 'TRX-882931',
    senderName: 'Sarah Jenkins',
    senderAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAOlNvSZOqIRrbtFdJYsjwqAuNjIxXGEb6AmAm8Zt0BPQu-2NpqeO_LTyJT4waJFiewy6orVtuXwctoOO3uacE2nJwWfC38uxxYqY_ZuTjBsu1nxZDSnqvjD49fHsz2h-BNzoRnFu0bmbkf2LAeqdFImI-6P3kTCB42FUxGv-x8_SoMwcUnrRzr6d5r1qMJmsyN3twRGnn0qVgfoXa6Ay2LbpvjxPJguS5l4osLL8os9umrTs-53x6bJWzSulm0oC__XsQBvTEaEJoE',
    beneficiary: 'John Doe',
    amount: 5000.0,
    date: 'Oct 24, 2023, 14:30',
    status: 'Pending',
  },
  {
    id: 'TRX-994102',
    senderName: 'Michael Chen',
    senderAvatar: '',
    beneficiary: 'Amazon Services',
    amount: 120.0,
    date: 'Oct 24, 2023, 13:15',
    status: 'Approved',
  },
  {
    id: 'TRX-773821',
    senderName: 'Jessica Wu',
    senderAvatar: '',
    beneficiary: 'Citibank NA',
    amount: 4500.0,
    date: 'Oct 24, 2023, 11:45',
    status: 'Payment Completed',
  },
  {
    id: 'TRX-662910',
    senderName: 'David Miller',
    senderAvatar: '',
    beneficiary: 'Binance Global',
    amount: 10000.0,
    date: 'Oct 23, 2023, 16:20',
    status: 'Rejected',
  },
  {
    id: 'TRX-551029',
    senderName: 'Emily Davis',
    senderAvatar: '',
    beneficiary: 'Utility Corp',
    amount: 85.5,
    date: 'Oct 23, 2023, 15:00',
    status: 'Payment Completed',
  },
  {
    id: 'TRX-442811',
    senderName: 'Robert Fox',
    senderAvatar: '',
    beneficiary: 'Tesla Inc',
    amount: 650.0,
    date: 'Oct 23, 2023, 14:10',
    status: 'Pending',
  },
];

const StatusBadge = ({status}: {status: TransactionTransfer['status']}) => {
  const styles = {
    Pending: 'bg-yellow-50 text-yellow-700',
    Approved: 'bg-blue-50 text-blue-700',
    'Payment Completed': 'bg-green-50 text-green-700',
    Rejected: 'bg-red-50 text-red-700',
  };

  const dots = {
    Pending: 'bg-yellow-500',
    Approved: 'bg-blue-500',
    'Payment Completed': 'bg-green-500',
    Rejected: 'bg-red-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`}></span>
      {status}
    </span>
  );
};

export const TransferDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Requests');

  const columns: Column<TransactionTransfer>[] = [
    {
      header: 'Transaction ID',
      accessor: 'id',
      render: (item) => (
        <span className="font-mono text-gray-900 font-medium">{item.id}</span>
      ),
    },
    {
      header: 'Sender Client',
      accessor: 'senderName',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.senderAvatar ? (
            <div
              className="size-6 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${item.senderAvatar})`,
              }}
            ></div>
          ) : (
            <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {item.senderName.charAt(0)}
            </div>
          )}
          <span className="text-gray-900">{item.senderName}</span>
        </div>
      ),
    },
    {
      header: 'Beneficiary',
      accessor: 'beneficiary',
      render: (item) => (
        <span className="text-gray-700">{item.beneficiary}</span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (item) => (
        <span className="text-gray-900 font-bold">
          $
          {item.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      header: 'Date & Time',
      accessor: 'date',
      render: (item) => <span className="text-gray-600">{item.date}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (item) => (
        <button
          onClick={() => navigate({to: '/client/transferview'})}
          className="text-gray-500 rounded-lg p-2 transition-colors hover:bg-primary/10 hover:text-primary"
          title="View Details"
        >
          <MdVisibility className="text-[20px]" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <div className="shrink-0 px-6 py-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-black">
              Transfer Approvals
            </h1>
            <p className="text-gray-600 text-sm font-normal">
              Manage and review incoming transfer requests.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <GenericButton className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 border bg-white px-4 py-2 font-semibold shadow-sm">
              <MdFilterList className="text-[20px] text-primary" />
              Filter
            </GenericButton>
            <GenericButton className="flex items-center gap-2 bg-primary px-4 py-2 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-700">
              <MdDownload className="text-[20px]" />
              Export Report
            </GenericButton>
          </div>
        </div>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="flex h-full flex-col justify-between rounded-xl border border-primary/20 bg-orange-50 p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <p className="text-gray-600 text-sm font-medium">
                  Total Pending Amount
                </p>
                <span className="rounded-lg bg-white p-2 text-primary shadow-sm">
                  <MdPayments className="text-[22px]" />
                </span>
              </div>
              <h3 className="text-gray-900 text-2xl font-bold">$1,250,400</h3>
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-green-600">
                <MdTrendingUp /> +12% from yesterday
              </p>
            </div>

            <StatCard
              label="Requests Today"
              value="145"
              subValue="Since 00:00 AM"
              subValueColor="text-gray-600"
              icon={<MdToday className="text-[22px]" />}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatCard
              label="Pending"
              value="42"
              subValue="Requires Action"
              subValueColor="text-yellow-600"
              icon={<MdHourglassEmpty className="text-[22px]" />}
              iconBgColor="bg-yellow-50"
              iconColor="text-yellow-600"
            />
            <StatCard
              label="Approved"
              value="95"
              subValue="Successful today"
              subValueColor="text-green-600"
              icon={<MdCheckCircle className="text-[22px]" />}
              iconBgColor="bg-green-50"
              iconColor="text-green-600"
            />
            <StatCard
              label="Rejected"
              value="8"
              subValue="5.5% Rejection Rate"
              subValueColor="text-red-600"
              icon={<MdCancel className="text-[22px]" />}
              iconBgColor="bg-red-50"
              iconColor="text-red-600"
            />
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:items-center">
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative flex-1 sm:w-72">
                <div className="text-gray-400 pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdSearch className="text-[20px]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-gray-200 text-gray-900 placeholder-gray-400 block w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Search Transaction ID, Client..."
                />
              </div>
              <div className="text-gray-400 flex w-full items-center gap-2 sm:w-auto">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-gray-200 text-gray-900 block w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-gray-600 text-sm font-medium">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-gray-200 text-gray-900 block w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex w-full overflow-x-auto pb-1 lg:w-auto lg:pb-0">
              <div className="bg-gray-100 flex gap-1 rounded-lg p-1">
                {['All Requests', 'Pending', 'Approved', 'Rejected'].map(
                  (tab) => (
                    <GenericButton
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`whitespace-nowrap px-4 py-1.5 text-sm font-semibold transition-colors ${
                        activeFilter === tab
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-600 hover:bg-white hover:text-primary'
                      }`}
                    >
                      {tab}
                    </GenericButton>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <GenericTable
            data={transactions}
            columns={columns}
            itemsPerPage={6}
            title="Recent Transactions"
            searchAble={false}
            action={false}
            paginationOff={false}
          />
        </div>
      </div>
    </div>
  );
};
