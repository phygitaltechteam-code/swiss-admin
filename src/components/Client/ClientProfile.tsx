import React, {useState} from 'react';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {useGetCustomerById} from '@/lib/react-query/client';
import {
  MdPerson,
  MdEdit,
  MdEmail,
  MdPhone,
  MdPlace,
  MdVerified,
  MdImage,
  MdDescription,
  MdContentCopy,
  MdMoreHoriz,
  MdSavings,
  MdArrowUpward,
  MdInfo,
  MdAccountBalance,
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdArrowBack,
} from 'react-icons/md';
import {Card} from './Card';

const ClientProfile: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const navigate = useNavigate();
  // Get the ID from search params
  const search = useSearch({from: '/_app/client/profile'});
  const clientId = search.id;

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useGetCustomerById(clientId || '');

  // Extract data from API response
  const clientData = apiResponse?.data || apiResponse; // Handle both response structures
  const userData = clientData?.user;

  const walletData = clientData?.wallets?.[0] || {};
  const temporyAccountBalance = walletData.temporyAccount || 0;
  const eprivateAccountBalance = walletData.eprivateAccount || 0;

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Format date of birth
  const formatDOB = (dobString: string) => {
    if (!dobString) return 'N/A';
    try {
      const date = new Date(dobString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Handle back button click
  const handleBackClick = () => {
    window.history.back();
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here
      console.log('Copied to clipboard:', text);
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="dark:bg-background-dark text-text-light dark:text-text-dark flex overflow-hidden bg-white/50">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-8">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Loading client profile...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state or no client ID
  if (isError || !clientData || !clientId) {
    return (
      <div className="dark:bg-background-dark text-text-light dark:text-text-dark flex overflow-hidden bg-white/50">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-8">
            <div className="rounded-lg bg-red-50 p-8 dark:bg-red-900/20">
              <div className="flex flex-col items-center justify-center text-center">
                <MdCancel className="mb-4 text-4xl text-red-500" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                  {!clientId
                    ? 'No Client ID Provided'
                    : 'Error Loading Client Profile'}
                </h3>
                <p className="mt-2 text-red-600 dark:text-red-400">
                  {!clientId
                    ? 'Please select a client from the client list.'
                    : error?.message ||
                      'Client not found or error loading data.'}
                </p>
                <div className="mt-4 text-sm">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Debug Info:
                  </p>
                  <p className="font-mono bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs">
                    Client ID: {clientId || 'Not provided'}
                    <br />
                    Error: {error?.message || 'None'}
                  </p>
                </div>
                <button
                  onClick={handleBackClick}
                  className="mt-6 flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <MdArrowBack className="text-sm" />
                  Go Back to Clients
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dark:bg-background-dark text-text-light dark:text-text-dark flex overflow-hidden bg-white/50">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-8">
          {/* Breadcrumb */}
          <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-1 transition-colors hover:text-primary"
            >
              <MdArrowBack className="text-sm" />
              Back to Clients
            </button>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {userData?.fullname || 'Client Profile'}
            </span>
          </div>

          {/* Main Header Card */}
          <div className="dark:bg-surface-dark dark:border-border-dark rounded-xl border border-stroke bg-white p-6 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-6 xl:flex-row xl:items-center">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="dark:from-gray-700 dark:to-gray-800 dark:border-gray-800 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-neutral-200 shadow-sm">
                    {clientData.photo ? (
                      <img
                        src={clientData.photo}
                        alt={userData?.fullname || 'Client'}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallbackIcon = document.createElement('div');
                            fallbackIcon.className =
                              'flex items-center justify-center h-full w-full';
                            fallbackIcon.innerHTML =
                              '<MdPerson class="text-gray-400 dark:text-gray-500 text-5xl" />';
                            parent.appendChild(fallbackIcon);
                          }
                        }}
                      />
                    ) : (
                      <MdPerson className="text-gray-400 dark:text-gray-500 text-5xl" />
                    )}
                  </div>
                  <div
                    className={`dark:border-gray-800 absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${userData?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                  ></div>
                </div>

                <div>
                  <h2 className="text-text-light dark:text-text-dark text-2xl font-bold">
                    {userData?.fullname || 'Unknown Client'}
                  </h2>
                  <div className="text-subtext-light dark:text-subtext-dark mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span className="flex items-center gap-1">
                      Account ID:{' '}
                      <span className="font-mono text-text-light dark:text-text-dark font-medium">
                        {clientData.accountNumber || 'N/A'}
                      </span>
                    </span>
                    <span className="bg-gray-300 dark:bg-gray-600 hidden h-1 w-1 rounded-full sm:inline"></span>
                    <span className="flex items-center gap-1">
                      <MdCalendarToday className="text-xs" />
                      Registered: {formatDate(clientData.createdAt)}
                    </span>
                    <span className="bg-gray-300 dark:bg-gray-600 hidden h-1 w-1 rounded-full sm:inline"></span>
                    <span className="flex items-center gap-1">
                      Mobile: {userData?.phoneNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${userData?.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${userData?.isActive ? 'bg-green-500' : 'bg-gray-500'}`}
                      ></span>
                      {userData?.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {userData?.isVerified && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        <MdCheckCircle className="text-xs" />
                        Verified
                      </span>
                    )}
                    {userData?.isRejected && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <MdCancel className="text-xs" />
                        Rejected
                      </span>
                    )}
                    {clientData.rejectedReason && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                        <MdInfo className="text-xs" />
                        Rejected with Reason
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex w-full flex-wrap items-center gap-3 xl:mt-0 xl:w-auto">
                <button className="text-text-light dark:text-text-dark dark:bg-gray-800 border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 flex-1 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 xl:flex-none">
                  See History
                </button>
                <button
                  className="text-text-light dark:text-text-dark dark:bg-gray-800 border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 flex-1 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 xl:flex-none"
                  onClick={() =>
                    navigate({to: `/client/transactionhistory/${clientId}`})
                  }
                >
                  View Transactions
                </button>

                <div className="bg-border-light dark:bg-border-dark mx-1 hidden h-8 w-px xl:block"></div>

                <label className="relative ml-auto inline-flex cursor-pointer items-center xl:ml-0">
                  <input
                    type="checkbox"
                    checked={userData?.isActive || false}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="bg-gray-200 dark:bg-gray-700 after:border-gray-300 peer h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30"></div>
                  <span className="text-text-light dark:text-text-dark ml-3 select-none text-sm font-medium">
                    {userData?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column (2/3) */}
            <div className="space-y-6 lg:col-span-2">
              {/* Personal Info */}
              <Card
                title="Personal & Contact Information"
                action={
                  <button className="hover:text-primary-hover flex items-center gap-1 text-sm font-medium text-primary transition-colors">
                    <MdEdit className="text-sm" />
                    Edit Details
                  </button>
                }
              >
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Full Legal Name
                    </label>
                    <p className="text-text-light dark:text-text-dark text-base font-medium">
                      {userData?.fullname || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Date of Birth
                    </label>
                    <p className="text-text-light dark:text-text-dark text-base font-medium">
                      {formatDOB(userData?.dob) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="group flex cursor-pointer items-center gap-2">
                      <MdEmail className="text-subtext-light dark:text-subtext-dark text-lg transition-colors group-hover:text-primary" />
                      <p className="text-text-light dark:text-text-dark text-base font-medium transition-colors group-hover:text-primary">
                        {userData?.email || 'N/A'}
                      </p>
                      <MdContentCopy
                        className="text-gray-400 cursor-pointer text-sm opacity-0 transition-all hover:text-primary group-hover:opacity-100"
                        onClick={() =>
                          handleCopyToClipboard(userData?.email || '')
                        }
                        title="Copy email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <div className="group flex cursor-pointer items-center gap-2">
                      <MdPhone className="text-subtext-light dark:text-subtext-dark text-lg transition-colors group-hover:text-primary" />
                      <p className="text-text-light dark:text-text-dark text-base font-medium transition-colors group-hover:text-primary">
                        {userData?.phoneNumber || 'N/A'}
                      </p>
                      <MdContentCopy
                        className="text-gray-400 cursor-pointer text-sm opacity-0 transition-all hover:text-primary group-hover:opacity-100"
                        onClick={() =>
                          handleCopyToClipboard(userData?.phoneNumber || '')
                        }
                        title="Copy phone number"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Residential Address
                    </label>
                    <div className="flex items-start gap-2">
                      <MdPlace className="text-subtext-light dark:text-subtext-dark mt-0.5 flex-shrink-0 text-lg" />
                      <p className="text-text-light dark:text-text-dark text-base font-medium">
                        {clientData.address || 'N/A'}
                        {clientData.city && `, ${clientData.city}`}
                        {clientData.state && `, ${clientData.state}`}
                        {clientData.country && `, ${clientData.country}`}
                        {clientData.pincode && ` - ${clientData.pincode}`}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Account Created
                    </label>
                    <p className="text-text-light dark:text-text-dark text-base font-medium">
                      {formatDate(clientData.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-subtext-light dark:text-subtext-dark mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                      Last Updated
                    </label>
                    <p className="text-text-light dark:text-text-dark text-base font-medium">
                      {formatDate(clientData.updatedAt)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Docs & Bank - Split Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card
                  title="Identity Documents"
                  className="h-full"
                  action={
                    userData?.isVerified ? (
                      <MdVerified
                        className="text-xl text-green-500"
                        title="All documents verified"
                      />
                    ) : (
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        {userData?.isRejected
                          ? 'Rejected'
                          : 'Pending Verification'}
                      </span>
                    )
                  }
                >
                  <div className="space-y-4">
                    {clientData.passport && (
                      <div className="hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-4 rounded-lg p-2 transition-colors">
                        <div className="bg-gray-100 dark:bg-gray-800 border-border-light dark:border-border-dark flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border">
                          <MdImage className="text-gray-400 text-2xl" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-light dark:text-text-dark truncate text-sm font-bold">
                            Passport
                          </p>
                          <p className="text-subtext-light dark:text-subtext-dark truncate text-xs">
                            {clientData.passportNumber || 'Document uploaded'}
                          </p>
                        </div>
                        <a
                          href={clientData.passport}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 text-sm font-medium text-primary hover:underline"
                        >
                          View
                        </a>
                      </div>
                    )}

                    {clientData.aadharCard && (
                      <div className="hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-4 rounded-lg p-2 transition-colors">
                        <div className="bg-gray-100 dark:bg-gray-800 border-border-light dark:border-border-dark flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border">
                          <MdDescription className="text-gray-400 text-2xl" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-light dark:text-text-dark truncate text-sm font-bold">
                            Aadhar Card
                          </p>
                          <p className="text-subtext-light dark:text-subtext-dark truncate text-xs">
                            {clientData.aadharCardNumber || 'Document uploaded'}
                          </p>
                        </div>
                        <a
                          href={clientData.aadharCard}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 text-sm font-medium text-primary hover:underline"
                        >
                          View
                        </a>
                      </div>
                    )}

                    {clientData.panCard && (
                      <div className="hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-4 rounded-lg p-2 transition-colors">
                        <div className="bg-gray-100 dark:bg-gray-800 border-border-light dark:border-border-dark flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border">
                          <MdDescription className="text-gray-400 text-2xl" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-light dark:text-text-dark truncate text-sm font-bold">
                            PAN Card
                          </p>
                          <p className="text-subtext-light dark:text-subtext-dark truncate text-xs">
                            {clientData.panCardNumber || 'Document uploaded'}
                          </p>
                        </div>
                        <a
                          href={clientData.panCard}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 text-sm font-medium text-primary hover:underline"
                        >
                          View
                        </a>
                      </div>
                    )}

                    {!clientData.passport &&
                      !clientData.aadharCard &&
                      !clientData.panCard && (
                        <div className="py-8 text-center">
                          <MdImage className="text-gray-300 dark:text-gray-600 mx-auto mb-2 text-4xl" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No identity documents uploaded
                          </p>
                        </div>
                      )}
                  </div>
                </Card>

                <Card title="Account & Security Information" className="h-full">
                  <div className="space-y-5">
                    <div className="border-gray-200 dark:border-gray-800 flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        Account Number
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-text-light dark:text-text-dark font-mono text-right text-sm font-medium">
                          {clientData.accountNumber || 'N/A'}
                        </span>
                        <MdContentCopy
                          className="text-gray-400 cursor-pointer text-sm transition-colors hover:text-primary"
                          onClick={() =>
                            handleCopyToClipboard(
                              clientData.accountNumber || '',
                            )
                          }
                          title="Copy account number"
                        />
                      </div>
                    </div>
                    <div className="border-gray-200 dark:border-gray-800 flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        Customer ID
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-text-light dark:text-text-dark font-mono text-right text-sm font-medium">
                          {clientData.id?.slice(0, 8)}...
                        </span>
                        <MdContentCopy
                          className="text-gray-400 cursor-pointer text-sm transition-colors hover:text-primary"
                          onClick={() =>
                            handleCopyToClipboard(clientData.id || '')
                          }
                          title="Copy customer ID"
                        />
                      </div>
                    </div>
                    <div className="border-gray-200 dark:border-gray-800 flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        Country
                      </span>
                      <span className="text-text-light dark:text-text-dark text-right text-sm font-medium">
                        {clientData.country || 'N/A'}
                      </span>
                    </div>
                    <div className="border-gray-200 dark:border-gray-800 flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        City/State
                      </span>
                      <span className="text-text-light dark:text-text-dark text-right text-sm font-medium">
                        {clientData.city || 'N/A'}
                        {clientData.state ? `, ${clientData.state}` : ''}
                      </span>
                    </div>
                    <div className="border-gray-200 dark:border-gray-800 flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        Pincode
                      </span>
                      <span className="text-text-light dark:text-text-dark font-mono text-right text-sm font-medium">
                        {clientData.pincode || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-subtext-light dark:text-subtext-dark text-sm">
                        Registration Date
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-text-light dark:text-text-dark font-mono text-sm font-medium">
                          {formatDate(clientData.createdAt)}
                        </span>
                        <MdCalendarToday
                          className="text-gray-400 cursor-pointer text-sm transition-colors hover:text-primary"
                          title="Registration Date"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            {/* Right Column (1/3) */}
            <div className="space-y-6 lg:col-span-1">
              <Card
                title="Account Balances & Activity"
                action={
                  <button className="hover:bg-gray-100 dark:hover:bg-gray-800 text-subtext-light dark:text-subtext-dark rounded p-1 transition-colors">
                    <MdMoreHoriz className="text-xl" />
                  </button>
                }
                className="h-full"
              >
                <div className="space-y-6">
                  {/* Dark Card - Private Balance */}
                  <div className="to-gray-800 group relative overflow-hidden rounded-2xl bg-black via-[#1a2332] p-6 text-white shadow-xl">
                    <div className="absolute right-[-10px] top-[-10px] rotate-12 transform p-4 opacity-[0.08] transition-transform duration-500 group-hover:rotate-0">
                      <MdAccountBalance className="text-9xl" />
                    </div>

                    <div className="relative z-10">
                      <div className="mb-6 flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            Private Account Balance
                          </p>
                          <p className="text-gray-500 font-mono mt-1 text-xs tracking-wide">
                            {clientData.accountNumber || 'N/A'}
                          </p>
                        </div>
                        <span
                          className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            userData?.isActive
                              ? 'border-green-500/30 bg-green-500/20 text-green-300'
                              : 'border-gray-500/30 bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {userData?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="mb-2">
                        <h4 className="text-3xl font-bold tracking-tight text-white">
                          {formatCurrency(eprivateAccountBalance)}
                        </h4>
                      </div>

                      <div className="mb-6 flex items-center gap-1 text-xs font-medium text-green-400">
                        <span className="rounded bg-green-400/10 p-0.5">
                          <MdArrowUpward className="text-sm" />
                        </span>
                        <span>
                          {/* You can add transaction count here if available */}
                          Account Balance
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 rounded-lg bg-white/10 py-2.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 active:bg-white/30">
                          Add Funds
                        </button>
                        <button className="hover:bg-primary-hover flex-1 rounded-lg bg-primary py-2.5 text-xs font-medium text-white shadow-lg shadow-orange-900/20 transition-all active:bg-orange-700">
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Account - Temp Balance */}
                  <div className="dark:bg-gray-800/50 dark:border-border-dark rounded-2xl border border-stroke bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-text-light dark:text-text-dark text-sm font-semibold">
                          Temporary Account Balance
                        </p>
                        <p className="text-subtext-light dark:text-subtext-dark font-mono mt-1 text-xs">
                          {clientData.accountNumber?.slice(0, 4)} ****{' '}
                          {clientData.accountNumber?.slice(-4) || 'XXXX'}
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full p-2">
                        <MdSavings className="text-xl" />
                      </div>
                    </div>

                    <div className="mb-1">
                      <h4 className="text-text-light dark:text-text-dark text-2xl font-bold tracking-tight">
                        {formatCurrency(temporyAccountBalance)}
                      </h4>
                    </div>
                    <p className="text-subtext-light dark:text-subtext-dark text-xs">
                      Available for immediate transfer
                    </p>

                    <div className="border-border-light dark:border-border-dark mt-4 flex items-center justify-between border-t border-dashed pt-4">
                      <span className="text-subtext-light dark:text-subtext-dark text-xs font-medium">
                        Last activity: {formatDate(clientData.updatedAt)}
                      </span>
                      <button className="text-xs font-semibold text-primary hover:underline">
                        View details
                      </button>
                    </div>
                  </div>

                  {/* Activity Summary */}
                  {/* Remove or update this section since we don't have transaction data in the response */}
                  {/*
                  <div className="dark:bg-gray-800/50 dark:border-border-dark rounded-2xl border border-stroke bg-white p-5 shadow-sm">
                    <h4 className="text-text-light dark:text-text-dark mb-4 text-sm font-semibold">
                      Transaction Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-subtext-light dark:text-subtext-dark text-sm">
                          Total Transactions
                        </span>
                        <span className="text-text-light dark:text-text-dark text-sm font-medium">
                          {clientData.totalTransactions || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-subtext-light dark:text-subtext-dark text-sm">
                          Transaction Volume
                        </span>
                        <span className="text-text-light dark:text-text-dark text-sm font-medium">
                          {formatCurrency(clientData.transactionVolume || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-subtext-light dark:text-subtext-dark text-sm">
                          Average Transaction
                        </span>
                        <span className="text-text-light dark:text-text-dark text-sm font-medium">
                          {formatCurrency(
                            (clientData.transactionVolume || 0) /
                            Math.max(clientData.totalTransactions || 1, 1)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  */}

                  {/* Alert Box for Rejected Status */}
                  {clientData.rejectedReason && (
                    <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/10">
                      <MdInfo className="mt-0.5 flex-shrink-0 text-xl text-red-600 dark:text-red-500" />
                      <div>
                        <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                          Account Rejected
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-red-700 dark:text-red-300">
                          Reason: {clientData.rejectedReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Alert Box for Pending Verification */}
                  {!userData?.isVerified && !userData?.isRejected && (
                    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/10">
                      <MdInfo className="mt-0.5 flex-shrink-0 text-xl text-amber-600 dark:text-amber-500" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                          Pending Verification
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                          Account verification is pending. Please review
                          submitted documents.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientProfile;
