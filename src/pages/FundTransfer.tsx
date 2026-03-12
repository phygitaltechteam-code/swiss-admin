// import {useGetClients, useTransferFund} from '@/lib/react-query/client';
// import React, {useState} from 'react';
// import {motion} from 'framer-motion';
// import {ChevronDown, Send, AlertCircle, CheckCircle} from 'lucide-react';
// import clsx from 'clsx';
// import { useNavigate } from '@tanstack/react-router';
// import { MdArrowBack } from 'react-icons/md';
// import {Route} from '@/routes/_app/fundtransfer.$id';
// interface Client {
//   id: string;
//   userId: string;
//   passport: string | null;
//   aadharCard: string | null;
//   panCard: string | null;
//   passportNumber: string | null;
//   aadharCardNumber: string | null;
//   panCardNumber: string | null;
//   accountNumber: string;
//   address: string;
//   city: string;
//   photo: string;
//   state: string;
//   country: string;
//   pincode: string;
//   securityPin: string;
//   rejectedReason: string | null;
//   createdAt: string;
//   updatedAt: string;
//   user: {
//     fullname: string;
//     email: string;
//     phoneNumber: string;
//     isActive: boolean;
//     dob: string | null;
//     isVerified: boolean;
//     isRejected: boolean;
//   };
//   wallets: Array<{
//     eprivateAccount: number;
//     temporyAccount: number;
//   }>;
//   _count: {
//     senderTransactions: number;
//   };
// }

// interface TransferData {
//   id: string;
//   amount: number;
// }

// const FundTransfer = () => {
//   const navigate = useNavigate();
//    const {id} = Route.useParams();
//   const {
//     data: apiResponse,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useGetClients();

//   const {mutate: transferFund, isPending: isTransferring} = useTransferFund();

//   const [selectedClientId, setSelectedClientId] = useState<string>('');
//   const [amount, setAmount] = useState<string>('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
//   const [transferStatus, setTransferStatus] = useState<
//     'idle' | 'loading' | 'success' | 'error'
//   >('idle');
//   const [validationError, setValidationError] = useState<string>('');
//   const [successMessage, setSuccessMessage] = useState<string>('');

//   // Extract clients array from API response
//   const clients: Client[] = apiResponse || [];

//   // Find selected client
//   const selectedClient = clients.find(
//     (client) => client.id === selectedClientId,
//   );

//   // Get client display name
//   const getClientDisplayName = (client: Client) => {
//     return client.user?.fullname || 'Unknown Client';
//   };

//   // Handle client selection
//   const handleClientSelect = (clientId: string) => {
//     setSelectedClientId(clientId);
//     setIsDropdownOpen(false);
//     setTransferStatus('idle');
//     setValidationError('');
//     setSuccessMessage('');
//   };

//   // Handle amount change
//   const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;

//     if (value === '' || /^\d*\.?\d*$/.test(value)) {
//       setAmount(value);
//       setTransferStatus('idle');
//       setValidationError('');
//       setSuccessMessage('');
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setValidationError('');
//     setSuccessMessage('');

//     if (!selectedClientId) {
//       setValidationError('Please select a client');
//       return;
//     }

//     if (!amount || parseFloat(amount) <= 0) {
//       setValidationError('Please enter a valid amount');
//       return;
//     }

//     setTransferStatus('loading');

//     const transferData: TransferData = {
//       id: selectedClientId,
//       amount: parseFloat(amount),
//     };

//     transferFund(transferData, {
//       onSuccess: (data) => {
//         // Clear form fields on success
//         setSelectedClientId('');
//         setAmount('');
//         setTransferStatus('success');
//         setSuccessMessage(
//           `Successfully transferred ${new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//           }).format(parseFloat(amount))}`,
//         );

//         // Optional: Refetch clients to update wallet balances
//         refetch();

//         // Clear success message after 5 seconds
//         setTimeout(() => {
//           setSuccessMessage('');
//           setTransferStatus('idle');
//         }, 5000);
//       },
//       onError: (error) => {
//         setTransferStatus('error');
//         setValidationError(
//           error?.message || 'Transfer failed. Please try again.',
//         );

//         // Clear error message after 5 seconds
//         setTimeout(() => {
//           setValidationError('');
//           setTransferStatus('idle');
//         }, 5000);
//       },
//     });
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex min-h-[400px] w-full items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
//           <p className="text-sm text-slate-500">Loading clients...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (isError) {
//     return (
//       <div className="flex min-h-[400px] w-full items-center justify-center px-4">
//         <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
//           <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
//           <h3 className="mb-2 text-lg font-bold text-red-700">
//             Failed to Load Clients
//           </h3>
//           <p className="mb-4 text-sm text-red-600">
//             {error?.message || 'An error occurred'}
//           </p>
//           <button
//             onClick={() => refetch()}
//             className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{opacity: 0, y: 20}}
//       animate={{opacity: 1, y: 0}}
//       className="mx-auto w-full max-w-2xl p-4 sm:p-6 md:p-8"
//     >
//        <div className="p-2">
//           <button
//             onClick={() => navigate({to: `/client/profile?id=${id}`})}
//             className="flex items-center gap-1 text-sm transition-colors hover:text-primary"
//           >
//             <MdArrowBack className="text-sm" />
//             Back to Profile
//           </button>
//         </div>
//       <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//         {/* Header */}
//         <div className="border-b border-slate-100 p-6">
//           <h2 className="text-xl font-bold text-slate-900">Fund Transfer</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Transfer funds to client accounts securely
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6 p-6">
//           {/* Client Selection Dropdown */}
//           <div className="space-y-2">
//             <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
//               Select Client <span className="text-rose-500">*</span>
//             </label>

//             {/* Custom Dropdown */}
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className={clsx(
//                   'w-full rounded-xl border px-4 py-3 text-left transition-all',
//                   'focus:outline-none focus:ring-2 focus:ring-orange-500/20',
//                   selectedClientId
//                     ? 'border-slate-200 bg-white'
//                     : 'border-slate-200 bg-slate-50 text-slate-400',
//                 )}
//               >
//                 <div className="flex items-center justify-between">
//                   <span
//                     className={
//                       selectedClientId ? 'text-slate-900' : 'text-slate-400'
//                     }
//                   >
//                     {selectedClient
//                       ? getClientDisplayName(selectedClient)
//                       : 'Choose a client to transfer funds'}
//                   </span>
//                   <ChevronDown
//                     className={clsx(
//                       'h-4 w-4 text-slate-400 transition-transform',
//                       isDropdownOpen && 'rotate-180',
//                     )}
//                   />
//                 </div>
//               </button>

//               {/* Dropdown Menu */}
//               {isDropdownOpen && (
//                 <motion.div
//                   initial={{opacity: 0, y: -10}}
//                   animate={{opacity: 1, y: 0}}
//                   exit={{opacity: 0, y: -10}}
//                   className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
//                 >
//                   {clients.length === 0 ? (
//                     <div className="p-4 text-center text-sm text-slate-500">
//                       No clients available
//                     </div>
//                   ) : (
//                     clients.map((client) => {
//                       const clientName = getClientDisplayName(client);
//                       return (
//                         <button
//                           key={client.id}
//                           type="button"
//                           onClick={() => handleClientSelect(client.id)}
//                           className={clsx(
//                             'w-full px-4 py-3 text-left transition-colors hover:bg-slate-50',
//                             'border-b border-slate-100 last:border-0',
//                             selectedClientId === client.id && 'bg-orange-50',
//                           )}
//                         >
//                           <div className="flex items-center gap-3">
//                             {/* Client Avatar/Initial */}
//                             <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
//                               <span className="text-xs font-bold text-orange-600">
//                                 {clientName.charAt(0).toUpperCase()}
//                               </span>
//                             </div>

//                             <div className="min-w-0 flex-1">
//                               <div className="flex items-center justify-between">
//                                 <span className="text-sm font-bold text-slate-900">
//                                   {clientName}
//                                 </span>
//                                 {client.wallets?.[0] && (
//                                   <span className="text-xs text-slate-400">
//                                     Bal: $
//                                     {client.wallets[0].eprivateAccount?.toLocaleString() ||
//                                       '0'}
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="flex items-center gap-2 text-xs text-slate-500">
//                                 <span>
//                                   Acc:{' '}
//                                   {client.accountNumber?.slice(-4) || 'N/A'}
//                                 </span>
//                                 <span>•</span>
//                                 <span>{client.user?.email || 'No email'}</span>
//                               </div>
//                               <div className="mt-1 text-[10px] text-slate-400">
//                                 ID: {client.id}
//                               </div>
//                             </div>
//                           </div>
//                         </button>
//                       );
//                     })
//                   )}
//                 </motion.div>
//               )}
//             </div>

//             {/* Selected Client Info (if any) */}
//             {selectedClient && (
//               <motion.div
//                 initial={{opacity: 0, height: 0}}
//                 animate={{opacity: 1, height: 'auto'}}
//                 className="mt-3 rounded-lg bg-slate-50 p-3 text-xs"
//               >
//                 <div className="flex items-center justify-between text-slate-600">
//                   <span>Account: {selectedClient.accountNumber}</span>
//                   <span>
//                     Available: $
//                     {selectedClient.wallets?.[0]?.eprivateAccount?.toLocaleString() ||
//                       '0'}
//                   </span>
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           {/* Amount Input */}
//           <div className="space-y-2">
//             <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
//               Amount <span className="text-rose-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={amount}
//                 onChange={handleAmountChange}
//                 placeholder="0.00"
//                 disabled={
//                   !selectedClientId ||
//                   isTransferring ||
//                   transferStatus === 'loading'
//                 }
//                 className={clsx(
//                   'w-full rounded-xl border py-3 pl-8 pr-4 transition-all',
//                   'focus:outline-none focus:ring-2 focus:ring-orange-500/20',
//                   (!selectedClientId || isTransferring) &&
//                     'cursor-not-allowed bg-slate-50 text-slate-400',
//                   selectedClientId &&
//                     !isTransferring &&
//                     'border-slate-200 bg-white',
//                 )}
//               />
//             </div>
//           </div>

//           {/* Success Message */}
//           {successMessage && (
//             <motion.div
//               initial={{opacity: 0, y: -10}}
//               animate={{opacity: 1, y: 0}}
//               className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700"
//             >
//               <CheckCircle className="h-4 w-4 flex-shrink-0" />
//               <span className="text-sm">{successMessage}</span>
//             </motion.div>
//           )}

//           {/* Validation Error Message */}
//           {validationError && (
//             <motion.div
//               initial={{opacity: 0, y: -10}}
//               animate={{opacity: 1, y: 0}}
//               className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700"
//             >
//               <AlertCircle className="h-4 w-4 flex-shrink-0" />
//               <span className="text-sm">{validationError}</span>
//             </motion.div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={
//               !selectedClientId ||
//               !amount ||
//               parseFloat(amount) <= 0 ||
//               isTransferring ||
//               transferStatus === 'loading'
//             }
//             className={clsx(
//               'w-full rounded-xl px-4 py-3 text-sm font-bold transition-all',
//               'flex items-center justify-center gap-2',
//               !selectedClientId ||
//                 !amount ||
//                 parseFloat(amount) <= 0 ||
//                 isTransferring ||
//                 transferStatus === 'loading'
//                 ? 'cursor-not-allowed bg-slate-100 text-slate-400'
//                 : 'bg-orange-500 text-white shadow-sm hover:bg-orange-600 hover:shadow',
//             )}
//           >
//             {isTransferring || transferStatus === 'loading' ? (
//               <>
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Send className="h-4 w-4" />
//                 Transfer Funds
//               </>
//             )}
//           </button>
//         </form>
//       </div>
//     </motion.div>
//   );
// };

// export default FundTransfer;

import {useGetClients, useTransferFund} from '@/lib/react-query/client';
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Send, AlertCircle, CheckCircle} from 'lucide-react';
import clsx from 'clsx';
import {useNavigate} from '@tanstack/react-router';
import {MdArrowBack} from 'react-icons/md';
import {Route} from '@/routes/_app/fundtransfer.$id';

interface Client {
  id: string;
  userId: string;
  passport: string | null;
  aadharCard: string | null;
  panCard: string | null;
  passportNumber: string | null;
  aadharCardNumber: string | null;
  panCardNumber: string | null;
  accountNumber: string;
  address: string;
  city: string;
  photo: string;
  state: string;
  country: string;
  pincode: string;
  securityPin: string;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    fullname: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    dob: string | null;
    isVerified: boolean;
    isRejected: boolean;
  };
  wallets: Array<{
    eprivateAccount: number;
    temporyAccount: number;
  }>;
  _count: {
    senderTransactions: number;
  };
}

interface TransferData {
  id: string;
  amount: number;
}

const FundTransfer = () => {
  const navigate = useNavigate();
  const {id} = Route.useParams();

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClients();

  const {mutate: transferFund, isPending: isTransferring} = useTransferFund();

  const [amount, setAmount] = useState<string>('');
  const [transferStatus, setTransferStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [validationError, setValidationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Extract clients array from API response
  const clients: Client[] = apiResponse || [];

  // Find and set the client from URL param
  useEffect(() => {
    if (clients.length > 0 && id) {
      const client = clients.find((client) => client.id === id);
      setSelectedClient(client || null);
    }
  }, [clients, id]);

  // Get client display name
  const getClientDisplayName = (client: Client | null) => {
    return client?.user?.fullname || 'Unknown Client';
  };

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setTransferStatus('idle');
      setValidationError('');
      setSuccessMessage('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError('');
    setSuccessMessage('');

    if (!selectedClient) {
      setValidationError('Client information not found');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setValidationError('Please enter a valid amount');
      return;
    }

    setTransferStatus('loading');

    const transferData: TransferData = {
      id: selectedClient.id,
      amount: parseFloat(amount),
    };

    transferFund(transferData, {
      onSuccess: (data) => {
        setAmount('');
        setTransferStatus('success');
        setSuccessMessage(
          `Successfully transferred ${new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(
            parseFloat(amount),
          )} to ${getClientDisplayName(selectedClient)}`,
        );

        refetch();

        setTimeout(() => {
          setSuccessMessage('');
          setTransferStatus('idle');
        }, 5000);
      },
      onError: (error) => {
        setTransferStatus('error');
        setValidationError(
          error?.message || 'Transfer failed. Please try again.',
        );

        setTimeout(() => {
          setValidationError('');
          setTransferStatus('idle');
        }, 5000);
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading client details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-bold text-red-700">
            Failed to Load Clients
          </h3>
          <p className="mb-4 text-sm text-red-600">
            {error?.message || 'An error occurred'}
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Client not found state
  if (!selectedClient) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-3 h-12 w-12 text-amber-500" />
          <h3 className="mb-2 text-lg font-bold text-amber-700">
            Client Not Found
          </h3>
          <p className="mb-4 text-sm text-amber-600">
            The requested client could not be found.
          </p>
          <button
            onClick={() => navigate({to: '/client/displayclient'})}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      className="mx-auto w-full max-w-2xl p-4 sm:p-6 md:p-8"
    >
      <div className="mb-4">
        <button
          onClick={() => navigate({to: `/client/profile?id=${id}`})}
          className="flex items-center gap-1 text-sm text-slate-600 transition-colors hover:text-orange-600"
        >
          <MdArrowBack className="text-sm" />
          Back to Profile
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Fund Transfer
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Transfer funds to client account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Client Name Field - Like an input but with client name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Client Name <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span className="flex-1 text-sm font-medium text-slate-900">
                  {getClientDisplayName(selectedClient)}
                </span>
                <span
                  className={clsx(
                    'ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    selectedClient.user?.isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600',
                  )}
                >
                  {selectedClient.user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Account Details - Single line */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Account Number
                </label>
                <div className="font-mono rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900">
                  {selectedClient.accountNumber}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Available Balance
                </label>
                <div className="font-mono rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
                  {formatCurrency(
                    selectedClient.wallets?.[0]?.eprivateAccount || 0,
                  )}
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Amount <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  disabled={isTransferring || transferStatus === 'loading'}
                  className={clsx(
                    'w-full rounded-lg border px-3 py-2.5 text-sm transition-all',
                    'focus:outline-none focus:ring-1 focus:ring-orange-500',
                    isTransferring
                      ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                      : 'border-slate-200 bg-white text-slate-900',
                  )}
                />
              </div>
            </div>

            {/* Messages */}
            {successMessage && (
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700"
              >
                <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {validationError && (
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
              >
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{validationError}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !selectedClient ||
                !amount ||
                parseFloat(amount) <= 0 ||
                isTransferring ||
                transferStatus === 'loading'
              }
              className={clsx(
                'mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                'flex items-center justify-center gap-2',
                !selectedClient ||
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  isTransferring ||
                  transferStatus === 'loading'
                  ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-orange-500 text-white hover:bg-orange-600',
              )}
            >
              {isTransferring || transferStatus === 'loading' ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Transfer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Helper function for formatting currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export default FundTransfer;
