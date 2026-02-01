import React, {useState} from 'react';
import {
  Search,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  BadgeCheck,
  MapPin,
  Building2,
  Copy,
  CreditCard,
  User,
  ShieldAlert,
  ChevronLeft,
} from 'lucide-react';

// --- Types ---

interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  accountLast4: string;
  status: 'verified' | 'pending' | 'rejected';
}

// --- Component ---

const BeneficiaryPage: React.FC = () => {
  const [adminNote, setAdminNote] = useState('');

  // Mock Data
  const recentBeneficiaries: Beneficiary[] = [
    {
      id: 'GT',
      name: 'Global Travels Ltd',
      bank: 'Wells Fargo',
      accountLast4: '9921',
      status: 'verified',
    },
    {
      id: 'AC',
      name: 'Acme Corp Logistics',
      bank: 'Chase Bank',
      accountLast4: '4589',
      status: 'pending',
    },
    {
      id: 'JD',
      name: 'John Doe',
      bank: 'Barclays',
      accountLast4: '1234',
      status: 'rejected',
    },
  ];

  return (
    <div className="bg-background-light font-sans flex h-screen flex-col overflow-hidden text-slate-800">
      {/* --- Header --- */}
      <header className="border-gray-200 z-20 flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="mr-4 flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-header-text text-lg font-bold tracking-tight">
              Verification Hub
            </h1>
          </div>

          <div className="bg-gray-200 mx-2 hidden h-6 w-px sm:block"></div>

          <nav className="text-label-text flex items-center text-sm">
            <span className="cursor-pointer transition-colors hover:text-primary">
              Verifications
            </span>
            <span className="text-gray-300 mx-2">/</span>
            <span className="text-header-text font-semibold">
              Beneficiary Review
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="group relative hidden md:flex">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="text-gray-400 h-4 w-4 transition-colors group-focus-within:text-primary" />
            </span>
            <input
              type="text"
              className="bg-gray-50 border-gray-200 text-gray-900 w-64 rounded-full border py-2 pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search Client ID or Name"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:bg-gray-50 relative rounded-full p-1.5 transition-colors hover:text-primary">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
            </button>
            <div className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-indigo-200 bg-indigo-100 ring-2 ring-transparent transition-all hover:ring-indigo-100">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ6H4HbZY6bap1nYguIuQIQNQ4SAIr8UxQ22DQhaLWuM8GgXOxJKGFOJ-E5UYufTmNjUUn4ZNlGBC1hUgOKeT7m1Izb3erAFGx4RtAKHV-08jMr6hr_3SciXlKoG2JEQpe_bS6ByDOrx2fakSFk6zj5xYOfnbnJiMkER9LEK6eiq-BYriyoTBBQMODC-_msI3fnQZQao_WpNgWK3wLDc9cgNZEdj1sF16Up_U5h9RMuRFFGuclQHK51qfqnhQROZXDCVcvqZZVQP3V"
                alt="Admin"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content Layout --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Context & Recents */}
        <aside className="border-gray-200 z-10 flex hidden w-72 shrink-0 flex-col overflow-hidden border-r bg-white lg:flex">
          {/* Client Profile Summary */}
          <div className="border-gray-200 border-b p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="ring-gray-100 h-12 w-12 overflow-hidden rounded-full ring-2">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxLv8nMzfKhzXXamrzyV5FM6u5MYQHa8cOMQuzTfbQz8C4nzLwlCkiH2E1cUKDbls2T_oqnBS5wXQZn3zdgTjGC9dJetGjjVqGM_0w5m1D5Vfd9AQl4mqAkp02jI4L3pO5ewHQgCGMVySc1URaWL2l5AvnhDrDAPIhqnqzk_YnysZInDv4fxuvFKR7rJmST4KNycJV2AjnImIC8aDFSwHJjPQFC4bxLjszMh0vY3fAZg15ZQ56S30cwsgShZ8SPhjGvgWvadKR3-e4"
                  alt="Client"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-header-text text-sm font-bold">
                  Sarah Jenkins
                </h2>
                <p className="text-label-text text-xs">Client #77210</p>
              </div>
            </div>

            <div className="mb-4 inline-flex items-center rounded border border-green-100 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
              Active
            </div>

            <div className="bg-gray-50 border-gray-100 grid grid-cols-2 gap-3 rounded-lg border p-3 text-xs">
              <div>
                <p className="text-label-text mb-0.5 text-[10px]">
                  Total Assets
                </p>
                <p className="text-header-text font-semibold">$142,500.00</p>
              </div>
              <div>
                <p className="text-label-text mb-0.5 text-[10px]">Risk Level</p>
                <p className="font-semibold text-yellow-600">Low</p>
              </div>
            </div>
          </div>

          {/* Recent Beneficiaries List */}
          <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
            <h3 className="text-label-text mb-3 px-2 pt-2 text-[10px] font-bold uppercase tracking-wider">
              Recent Beneficiaries
            </h3>
            <div className="space-y-1">
              {recentBeneficiaries.map((b) => (
                <div
                  key={b.id}
                  className={`flex cursor-pointer items-center rounded-lg border p-2.5 transition-all ${
                    b.status === 'pending'
                      ? 'relative overflow-hidden border-orange-100 bg-orange-50'
                      : 'hover:bg-gray-50 border-transparent'
                  } ${b.status === 'rejected' ? 'opacity-60' : ''}`}
                >
                  {b.status === 'pending' && (
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary"></div>
                  )}

                  <div
                    className={`mr-3 flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-bold shadow-sm ${
                      b.status === 'pending'
                        ? 'bg-primary text-white'
                        : 'border-gray-200 text-gray-600 border bg-white'
                    }`}
                  >
                    {b.id}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs font-semibold ${b.status === 'pending' ? 'text-gray-900' : 'text-header-text'}`}
                    >
                      {b.name}
                    </p>
                    <p
                      className={`truncate text-[10px] ${b.status === 'pending' ? 'text-gray-600' : 'text-label-text'}`}
                    >
                      {b.bank} •••• {b.accountLast4}
                    </p>
                  </div>

                  <div className="ml-2">
                    {b.status === 'verified' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {b.status === 'pending' && (
                      <Clock className="h-4 w-4 animate-pulse text-primary" />
                    )}
                    {b.status === 'rejected' && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Main Detail View */}
        <section className="bg-gray-50/50 relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Detail Header */}
          <div className="border-gray-200 shrink-0 border-b bg-white px-8 py-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-label-text flex items-center text-xs font-medium">
                <span>Request #89201</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-bold text-primary shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"></span>
                Pending Review
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h1 className="text-header-text mb-1 text-2xl font-bold">
                  New Beneficiary Request
                </h1>
                <p className="text-label-text flex items-center gap-1 text-xs">
                  Submitted on Oct 24, 2023 at 10:42 AM by{' '}
                  <span className="text-gray-700 font-medium">
                    Sarah Jenkins
                  </span>
                </p>
              </div>

              {/* Alert Box */}
              <div className="flex max-w-md items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-3 shadow-sm">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <h3 className="mb-0.5 text-xs font-bold text-red-800">
                    Potential KYC Flag
                  </h3>
                  <p className="text-[11px] leading-snug text-red-600">
                    Match on watch list database. Manual verification required
                    before processing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="mx-auto h-full max-w-5xl">
              <div className="border-gray-200 flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
                {/* Card Header */}
                <div className="border-gray-200 bg-gray-50 flex shrink-0 items-center justify-between border-b px-6 py-4">
                  <h3 className="text-header-text flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <User className="text-label-text h-4 w-4" />
                    Beneficiary Information
                  </h3>
                  <span className="text-gray-600 border-gray-200 rounded border bg-white px-2 py-1 text-[10px] font-medium shadow-sm">
                    International Transfer
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Section 1: Identity */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-3">
                      <h4 className="text-label-text border-gray-100 mb-4 flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase tracking-wider">
                        <BadgeCheck className="h-4 w-4" /> Identity Details
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Full Legal Name
                          </label>
                          <div className="text-header-text text-sm font-semibold">
                            Sarah Miller
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Relationship
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            Family Member (Sister)
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Email
                          </label>
                          <div className="text-header-text cursor-pointer truncate text-sm font-medium text-primary hover:underline">
                            sarah.miller@example.co.uk
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Mobile Number
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            +44 7700 900077
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Address */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-3">
                      <h4 className="text-label-text border-gray-100 mb-4 flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase tracking-wider">
                        <MapPin className="h-4 w-4" /> Address Details
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        <div className="md:col-span-2">
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Address Line 1
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            45 Oxford Street
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            City
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            London
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            State / Province
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            Westminster
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            ZIP / Postal Code
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            W1D 2DZ
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Country
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="overflow-hidden rounded-sm text-xl shadow-sm">
                              🇬🇧
                            </span>
                            <span className="text-header-text text-sm font-medium">
                              United Kingdom
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Bank Details */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-3">
                      <h4 className="text-label-text border-gray-100 mb-4 flex items-center gap-2 border-b pb-2 text-xs font-bold uppercase tracking-wider">
                        <Building2 className="h-4 w-4" /> Bank Details
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Bank Country
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="overflow-hidden rounded-sm text-xl shadow-sm">
                              🇬🇧
                            </span>
                            <span className="text-header-text text-sm font-medium">
                              United Kingdom
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Currency
                          </label>
                          <div className="text-header-text flex items-center gap-2 text-sm font-medium">
                            <span className="bg-gray-100 text-gray-600 border-gray-200 rounded border px-1.5 py-0.5 text-[10px] font-bold">
                              GBP
                            </span>
                            British Pound
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Account / IBAN
                          </label>
                          <div className="text-header-text font-mono bg-gray-50 border-gray-200 hover:border-gray-300 group flex cursor-pointer items-center justify-between rounded border p-2 text-sm font-medium tracking-wide transition-colors">
                            GB00 0000 0000 0000 0000
                            <Copy className="text-gray-400 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Account Type
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            Personal Checking
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            SWIFT / BIC
                          </label>
                          <div className="text-header-text font-mono text-sm font-medium">
                            HDFCGB2L
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Routing / IFSC
                          </label>
                          <div className="text-header-text font-mono text-sm font-medium">
                            20-00-00
                          </div>
                        </div>
                        <div>
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Bank Name
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            HDFC Bank UK
                          </div>
                        </div>
                        <div className="md:col-span-4">
                          <label className="text-label-text mb-1.5 block text-[11px] font-semibold">
                            Branch Name
                          </label>
                          <div className="text-header-text text-sm font-medium">
                            London Main Branch (Old Broad St)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Action Center */}
        <aside className="border-gray-200 z-20 flex w-80 shrink-0 flex-col border-l bg-white shadow-xl">
          <div className="border-gray-200 border-b bg-white p-6">
            <h2 className="text-header-text text-lg font-bold">
              Action Center
            </h2>
            <p className="text-label-text mt-1 text-xs">
              Review carefully before processing.
            </p>
          </div>

          <div className="bg-gray-50/30 flex flex-1 flex-col overflow-hidden p-6">
            <div className="mb-6 flex flex-1 flex-col">
              <label
                htmlFor="admin-note"
                className="text-label-text mb-2 block flex items-center justify-between text-sm font-semibold"
              >
                Admin Note
                <span className="rounded border border-red-100 bg-red-50 px-1.5 py-0.5 text-[10px] font-normal text-red-500">
                  * Required for rejection
                </span>
              </label>
              <textarea
                id="admin-note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Enter rejection reason or approval notes..."
                className="border-gray-300 text-header-text w-full flex-1 resize-none rounded-lg p-4 text-sm shadow-sm transition-shadow duration-200 focus:border-primary focus:shadow-md focus:ring-primary"
              ></textarea>
            </div>

            <div className="mt-auto shrink-0 space-y-3">
              <button className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]">
                <CheckCircle className="h-5 w-5" />
                Approve Beneficiary
              </button>
              <button className="border-gray-200 flex w-full transform items-center justify-center gap-2 rounded-lg border bg-white px-4 py-3.5 font-medium text-red-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-[0.98]">
                <XCircle className="h-5 w-5" />
                Reject Request
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BeneficiaryPage;
