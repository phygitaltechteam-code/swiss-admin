import React from 'react';
import {
  MdHistory,
  MdSearch,
  MdFilterList,
  MdMoreVert,
  MdDownload,
  MdPayments,
  MdReceiptLong,
  MdAddCard,
  MdSwapCalls,
  MdGroup,
  MdContacts,
  MdCarCrash,
} from 'react-icons/md';
import {useNavigate} from '@tanstack/react-router';

// Header Component
const Header: React.FC = () => {
  return (
    <header className="bg-bg-main/95 sticky top-0 z-10 w-full px-8 py-6 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-black">
              Reports Center
            </h2>
            <p className="text-slate-custom text-base font-normal">
              Generate and manage financial statements and audit logs.
            </p>
          </div>
          {/* <button className="border-gray-300 text-slate-custom hover:border-gray-400 hover:text-navy flex h-10 items-center justify-center gap-2 rounded-lg border bg-white px-4 text-sm font-medium shadow-sm transition-colors">
            <MdHistory className="text-lg" />
            Recent Downloads
          </button> */}
        </div>

        {/* <div className="border-gray-200 flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
          <div className="min-w-[240px] flex-1">
            <div className="group relative">
              <MdSearch className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xl" />
              <input
                className="text-header-text placeholder-gray-500 block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Search by report name or ID..."
                type="text"
              />
            </div>
          </div>

          <div className="bg-gray-200 hidden h-8 w-px sm:block"></div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap">
            <label className="flex w-full min-w-[180px] cursor-pointer items-center gap-2 sm:w-auto">
              <span className="text-slate-custom whitespace-nowrap text-sm">
                Date Range:
              </span>
              <select className="text-header-text block w-full rounded-lg border border-[#dce0e5] bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Last 30 Days</option>
                <option>This Quarter</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
            </label>
            <button className="border-gray-200 bg-bg-main text-slate-custom hover:bg-gray-50 hover:text-navy flex h-10 w-10 items-center justify-center rounded-lg border">
              <MdFilterList className="text-xl" />
            </button>
          </div>
        </div> */}
      </div>
    </header>
  );
};

// ReportCard Component
interface ReportItem {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{className?: string}>;
  iconColor: string;
  hasGradient?: boolean;
  route: string;
}

const ReportCard: React.FC<{item: ReportItem}> = ({item}) => {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <div
      className="border-gray-200 group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-white p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      onClick={() => navigate({to: item.route})}
    >
      {item.hasGradient && (
        <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-gradient-to-bl from-primary/10 to-transparent"></div>
      )}

      <div className="relative z-10 mb-4 flex items-start justify-between">
        <div
          className={`bg-gray-50 flex h-12 w-12 items-center justify-center rounded-lg group-hover:scale-110 ${item.iconColor} transition-transform`}
        >
          <Icon className="text-2xl" />
        </div>
        <MdMoreVert className="text-gray-400 hover:text-navy cursor-pointer" />
      </div>

      <h3 className="text-navy relative z-10 mb-2 text-lg font-bold">
        {item.title}
      </h3>
      <p className="text-slate-custom relative z-10 mb-6 flex-1 text-sm leading-relaxed">
        {item.description}
      </p>

      <div className="relative z-10 mt-auto flex gap-2">
        <button
          className="h-9 flex-1 rounded-lg bg-primary text-sm font-bold text-white shadow-sm shadow-orange-100 transition-colors hover:bg-primary/90"
          onClick={(e) => {
            e.stopPropagation();
            navigate({to: item.route});
          }}
        >
          Generate
        </button>
        <button
          className="border-gray-200 text-slate-custom hover:border-gray-300 hover:bg-gray-50 hover:text-navy flex h-9 w-9 items-center justify-center rounded-lg border"
          onClick={(e) => e.stopPropagation()}
        >
          <MdDownload className="text-lg" />
        </button>
      </div>
    </div>
  );
};

// Reports Data
const reportsData: ReportItem[] = [
  {
    id: 1,
    title: 'Transactions Fee',
    description:
      'Analyze revenue generated from transaction fees across all channels and gateways.',
    icon: MdPayments,
    iconColor: 'text-primary',
    route: '/transactionReport',
  },
  {
    id: 2,
    title: 'All Transactions',
    description:
      'Complete log of all incoming and outgoing funds system-wide with granular details.',
    icon: MdReceiptLong,
    iconColor: 'text-blue-600',
    route: '/alltransaction',
  },
  {
    id: 3,
    title: 'Wallet Top-Up',
    description:
      'Overview of user wallet funding sources, success rates, and volume metrics.',
    icon: MdAddCard,
    iconColor: 'text-green-600',
    route: '/wallettopupreport',
  },
  {
    id: 4,
    title: 'Transfers Log',
    description:
      'Detailed records of internal P2P and external bank transfer activities.',
    icon: MdSwapCalls,
    iconColor: 'text-purple-600',
    route: '/transfersReport',
  },
  {
    id: 5,
    title: 'Client List',
    description:
      'Comprehensive database of active and inactive clients with KYC status.',
    icon: MdGroup,
    iconColor: 'text-yellow-500',
    route: '/clientlistreport',
  },
  {
    id: 6,
    title: 'Beneficiary List',
    description:
      'Registry of all saved external beneficiaries linked to client accounts.',
    icon: MdContacts,
    iconColor: 'text-pink-500',
    route: '/beneficiaryreport',
  },
  {
    id: 7,
    title: 'Cash Flow',
    description:
      'High-level inflow vs. outflow summary for executive financial review.',
    icon: MdCarCrash,
    iconColor: 'text-teal-600',
    hasGradient: true,
    route: '/cashflowreport',
  },
];

// Main Page Component
const ReportPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full">
      <main className="bg-bg-main relative flex h-full flex-1 flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mx-auto max-w-7xl pb-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {reportsData.map((report) => (
                <ReportCard key={report.id} item={report} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;
