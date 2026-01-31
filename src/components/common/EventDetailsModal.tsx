// import {useAuthContext} from '@/context/AuthContext';
// import {useDeleteOccasion} from '@/lib/api/occassionApi';
// import React from 'react';
// import toast from 'react-hot-toast';

// const EventDetailsModal = ({
//   showDetailsModal,
//   setShowDetailsModal,
//   selectedOccasion,
//   setSelectedOccasion,
//   navigate,
//   setShowUpdateModal, // New prop to open UpdateEventModal
//   setEventName,
//   setSelectedDate,
//   setEndDate,
//   setSelectedCustomer,
//   setStartTime,
//   setEndTime,
// }) => {
//   const {user} = useAuthContext();
//   const {mutateAsync: deleteoccassion} = useDeleteOccasion(user?.roleId);
//   if (!showDetailsModal || !selectedOccasion) return null;

//   const handleEditClick = () => {
//     // Populate the form fields in Calendar's state
//     setEventName(selectedOccasion.name);
//     setSelectedDate(
//       new Date(selectedOccasion.startDate).toISOString().slice(0, 10),
//     );
//     setEndDate(new Date(selectedOccasion.endDate).toISOString().slice(0, 10));
//     setSelectedCustomer(selectedOccasion.client);
//     setStartTime(
//       new Date(selectedOccasion.startDate).toTimeString().slice(0, 5),
//     );
//     setEndTime(new Date(selectedOccasion.endDate).toTimeString().slice(0, 5));

//     setShowDetailsModal(false); // Close details modal
//     setShowUpdateModal(true); // Open update modal
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity duration-300"
//         onClick={() => setShowDetailsModal(false)}
//       ></div>

//       <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 transition-all duration-300 ease-out dark:bg-slate-800 dark:ring-slate-700">
//         <div className="relative border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-700">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
//                 <svg
//                   className="h-6 w-6 text-primary"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
//                   Event Details
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//                   Manage and view event information
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowDetailsModal(false)}
//               className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:hover:bg-slate-700 dark:hover:text-slate-300"
//             >
//               <svg
//                 className="h-5 w-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="px-8 py-6">
//           <div className="mb-8">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
//                   {selectedOccasion.name}
//                 </h3>
//                 <div className="mt-2 flex items-center space-x-2">
//                   <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
//                     <svg
//                       className="mr-1 h-3 w-3"
//                       fill="currentColor"
//                       viewBox="0 0 8 8"
//                     >
//                       <circle cx="4" cy="4" r="3" />
//                     </svg>
//                     Active Event
//                   </span>
//                   <span className="text-sm text-slate-500 dark:text-slate-400">
//                     ID: #{selectedOccasion.id}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid gap-6 lg:grid-cols-2">
//             <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:bg-slate-800">
//               <div className="flex items-start space-x-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
//                   <svg
//                     className="h-5 w-5 text-blue-600 dark:text-blue-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
//                     Client Information
//                   </h4>
//                   <div className="mt-2 space-y-1">
//                     <p className="text-base font-medium text-slate-700 dark:text-slate-300">
//                       {selectedOccasion.customer?.user?.fullname ||
//                         'No client assigned'}
//                     </p>
//                     {selectedOccasion.customer?.user?.phoneNumber && (
//                       <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
//                         <svg
//                           className="h-4 w-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                           />
//                         </svg>
//                         <span>
//                           {selectedOccasion.customer.user.phoneNumber}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:bg-slate-800">
//               <div className="flex items-start space-x-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
//                   <svg
//                     className="h-5 w-5 text-purple-600 dark:text-purple-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
//                     Event Duration
//                   </h4>
//                   <div className="mt-2">
//                     <p className="text-sm text-slate-600 dark:text-slate-400">
//                       {(() => {
//                         const start = new Date(selectedOccasion.startDate);
//                         const end = new Date(selectedOccasion.endDate);
//                         const diffMs = end - start;
//                         const diffDays = Math.floor(
//                           diffMs / (1000 * 60 * 60 * 24),
//                         );
//                         const diffHours = Math.floor(
//                           (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
//                         );

//                         if (diffDays > 0) {
//                           return `${diffDays} day${diffDays > 1 ? 's' : ''} ${
//                             diffHours > 0
//                               ? `${diffHours} hour${diffHours > 1 ? 's' : ''}`
//                               : ''
//                           }`;
//                         } else if (diffHours > 0) {
//                           return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
//                         } else {
//                           const diffMinutes = Math.floor(diffMs / (1000 * 60));
//                           return `${diffMinutes} minute${
//                             diffMinutes > 1 ? 's' : ''
//                           }`;
//                         }
//                       })()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6">
//             <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
//               Schedule Details
//             </h4>
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="flex items-center space-x-4 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-900/10">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
//                   <svg
//                     className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 3v9l4 4"
//                     />
//                   </svg>
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
//                     Start Time
//                   </p>
//                   <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
//                     {new Intl.DateTimeFormat('en-GB', {
//                       weekday: 'short',
//                       year: 'numeric',
//                       month: 'short',
//                       day: '2-digit',
//                       hour: '2-digit',
//                       minute: '2-digit',
//                       hour12: true,
//                       timeZone: 'UTC',
//                     }).format(new Date(selectedOccasion.startDate))}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4 rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-900/10">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
//                   <svg
//                     className="h-4 w-4 text-red-600 dark:text-red-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 9v6m6-3H6"
//                     />
//                   </svg>
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
//                     End Time
//                   </p>
//                   <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
//                     {new Intl.DateTimeFormat('en-GB', {
//                       weekday: 'short',
//                       year: 'numeric',
//                       month: 'short',
//                       day: '2-digit',
//                       hour: '2-digit',
//                       minute: '2-digit',
//                       hour12: true,
//                       timeZone: 'UTC',
//                     }).format(new Date(selectedOccasion.endDate))}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-slate-200 bg-slate-50/50 px-8 py-6 dark:border-slate-700 dark:bg-slate-800/50">
//           <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
//             <button
//               onClick={() => {
//                 navigate({to: `/events/${selectedOccasion.id}`});
//               }}
//               className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700"
//             >
//               <svg
//                 className="mr-2 h-4 w-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                 />
//               </svg>
//               View Details
//             </button>

//             <button
//               onClick={handleEditClick} // Call the new handler
//               className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
//             >
//               <svg
//                 className="mr-2 h-4 w-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                 />
//               </svg>
//               Edit Event
//             </button>

//             <button
//               onClick={() => {
//                 if (
//                   window.confirm(
//                     '⚠️ Are you sure you want to delete this event?\n\nThis action cannot be undone and will permanently remove all event data.',
//                   )
//                 ) {
//                   deleteoccassion(selectedOccasion.id);
//                   setShowDetailsModal(false);
//                 }
//               }}
//               className="inline-flex flex-1 items-center justify-center rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition-all hover:border-red-400 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
//             >
//               <svg
//                 className="mr-2 h-4 w-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 2 0 00-1 1v3M4 7h16"
//                 />
//               </svg>
//               Delete Event
//             </button>
//           </div>

//           <div className="mt-4 text-center">
//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               Last updated:{' '}
//               {new Intl.DateTimeFormat('en-GB', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: '2-digit',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 timeZone: 'UTC',
//               }).format(
//                 new Date(
//                   selectedOccasion.updatedAt || selectedOccasion.startDate,
//                 ),
//               )}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import {useAuthContext} from '@/context/AuthContext';
import {useDeleteOccasion} from '@/lib/api/occassionApi';
import {Link} from '@tanstack/react-router';
import {Building} from 'lucide-react';
import React, {useState} from 'react';
import toast from 'react-hot-toast';
import {FiCalendar, FiInfo} from 'react-icons/fi';

const EventDetailsModal = ({
  showDetailsModal,
  setShowDetailsModal,
  selectedOccasion,
  setSelectedOccasion,
  navigate,
  setShowUpdateModal,
  setEventName,
  setSelectedDate,
  setEndDate,
  setSelectedCustomer,
  setStartTime,
  setEndTime,
}) => {
  const {user} = useAuthContext();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isManager = user?.role === 'MANAGER';
  const {mutateAsync: deleteoccassion} = useDeleteOccasion(user?.roleId);
  if (!showDetailsModal || !selectedOccasion) return null;

  // Add payment information
  const paidAmount = selectedOccasion?.paid || 0;
  const pendingAmount = selectedOccasion?.pending || 0;
  const totalAmount = selectedOccasion?.amount || 0;

  const roomsByCategory = selectedOccasion?.roomFunctionOcupied?.reduce(
    (acc, room) => {
      const categoryName = room.room?.roomCategory?.name || 'Uncategorized';
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(room.room.No);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  console.log('roommmmm', roomsByCategory);

  const handleEditClick = () => {
    setEventName(selectedOccasion.name);
    setSelectedDate(
      new Date(selectedOccasion.startDate).toISOString().slice(0, 10),
    );
    setEndDate(new Date(selectedOccasion.endDate).toISOString().slice(0, 10));
    setSelectedCustomer(selectedOccasion.client);
    setStartTime(
      new Date(selectedOccasion.startDate).toTimeString().slice(0, 5),
    );
    setEndTime(new Date(selectedOccasion.endDate).toTimeString().slice(0, 5));
    setShowDetailsModal(false);
    setShowUpdateModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setShowDetailsModal(false)}
      ></div>

      <div className="relative max-h-[95vh] w-full max-w-2xl transform overflow-hidden overflow-y-auto rounded-lg bg-white shadow-2xl ring-1 ring-slate-200 transition-all duration-300 ease-out dark:bg-slate-800 dark:ring-slate-700 sm:rounded-2xl">
        <div className="relative border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-700 sm:px-8 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 sm:h-12 sm:w-12">
                <svg
                  className="h-5 w-5 text-primary sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                  Project Details
                </h2>
              </div>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-4 py-4 pt-6 sm:px-8 sm:py-6 sm:pt-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="break-words text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  {selectedOccasion.name}
                </h3>
                <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                  <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <svg
                      className="mr-1 h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Active Event
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-1">
            {/* <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:bg-slate-800 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 sm:h-10 sm:w-10">
                  <svg
                    className="h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Client Information
                  </h4>
                  <div className="mt-2 space-y-1">
                    <p className="break-words text-sm font-medium text-slate-700 dark:text-slate-300 sm:text-base">
                      {selectedOccasion?.customer?.fullname ||
                        'No client assigned'}
                    </p>
                    {selectedOccasion?.customer?.phoneNumber && (
                      <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                        <svg
                          className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="break-all">
                          {selectedOccasion?.customer?.phoneNumber}
                        </span>
                      </div>
                    )}
                 
                 
                  </div>
                </div>
              </div>
            </div> */}

            {/* Event Duration */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:bg-slate-800 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 sm:h-10 sm:w-10">
                  <svg
                    className="h-4 w-4 text-purple-600 dark:text-purple-400 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Project Duration
                  </h4>
                  <div className="mt-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                      {(() => {
                        const start = new Date(selectedOccasion.startDate);
                        const end = new Date(selectedOccasion.endDate);
                        const diffMs = end - start;
                        const diffDays = Math.floor(
                          diffMs / (1000 * 60 * 60 * 24),
                        );
                        const diffHours = Math.floor(
                          (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                        );
                        if (diffDays > 0) {
                          return `${diffDays} day${diffDays > 1 ? 's' : ''} ${
                            diffHours > 0
                              ? `${diffHours} hour${diffHours > 1 ? 's' : ''}`
                              : ''
                          }`;
                        } else if (diffHours > 0) {
                          return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
                        } else {
                          const diffMinutes = Math.floor(diffMs / (1000 * 60));
                          return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
                        }
                      })()}
                    </p>
                  </div>
                  <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Paid
                        </p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{paidAmount?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Pending
                        </p>
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                          ₹{pendingAmount?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Total
                        </p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          ₹{totalAmount?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:mb-4 sm:text-sm">
              Schedule Details
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex items-center space-x-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-900/10 sm:space-x-4 sm:p-4">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 sm:h-8 sm:w-8">
                  <svg
                    className="h-3 w-3 text-emerald-600 dark:text-emerald-400 sm:h-4 sm:w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v9l4 4"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Start Time
                  </p>
                  <p className="mt-1 break-words text-xs font-semibold text-slate-900 dark:text-white sm:text-sm">
                    {new Intl.DateTimeFormat('en-GB', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'UTC',
                    }).format(new Date(selectedOccasion.startDate))}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800 dark:bg-red-900/10 sm:space-x-4 sm:p-4">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:h-8 sm:w-8">
                  <svg
                    className="h-3 w-3 text-red-600 dark:text-red-400 sm:h-4 sm:w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v6m6-3H6"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
                    End Time
                  </p>
                  <p className="mt-1 break-words text-xs font-semibold text-slate-900 dark:text-white sm:text-sm">
                    {new Intl.DateTimeFormat('en-GB', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'UTC',
                    }).format(new Date(selectedOccasion.endDate))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/50 sm:px-8 sm:py-6">
          <div className="flex flex-col space-y-2 sm:space-y-3 md:flex-row md:space-x-3 md:space-y-0">
            <button
              onClick={() => {
                navigate({to: `/manager/occassion/${selectedOccasion.id}`});
                sessionStorage.setItem('occassionName', selectedOccasion.name);
                sessionStorage.setItem('startDate', selectedOccasion.startDate);
                sessionStorage.setItem('endDate', selectedOccasion.endDate);
              }}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <svg
                className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">View</span>
            </button>
            {!isManager && (
              <button
                onClick={handleEditClick}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <svg
                  className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="hidden sm:inline">Edit Project</span>
                <span className="sm:hidden">Edit</span>
              </button>
            )}

            {!isManager && (
              <>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="z-[9999] inline-flex flex-1 items-center justify-center rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 shadow-sm transition-all hover:border-red-400 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <svg
                    className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span className="hidden sm:inline">Delete Project</span>
                  <span className="sm:hidden">Delete</span>
                </button>

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                  <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4 backdrop-blur-0">
                    <div className="dark:bg-gray-800 w-full max-w-sm rounded-lg bg-neutral-100 p-2 shadow-lg">
                      <h2 className="mb-4 text-lg font-semibold text-red-600">
                        ⚠️ Confirm Delete
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
                        Are you sure you want to delete this event? This action
                        cannot be undone and will permanently remove all event
                        data.
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setIsDeleteModalOpen(false)}
                          className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded border px-3 py-1.5 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            deleteoccassion(selectedOccasion.id);
                            setShowDetailsModal(false);
                            setIsDeleteModalOpen(false);
                          }}
                          className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mt-3 text-center sm:mt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated:{' '}
              {new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC',
              }).format(
                new Date(
                  selectedOccasion.updatedAt || selectedOccasion.startDate,
                ),
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
