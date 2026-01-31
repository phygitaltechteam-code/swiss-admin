// import React, {useEffect} from 'react';
// import toast from 'react-hot-toast';
// import {useUpdateOccasion} from '@/lib/api/occassionApi'; // Assuming you have a useUpdateOccasion hook
// import {useAuthContext} from '@/context/AuthContext'; // To get roleId

// const UpdateEventModal = ({
//   showModal,
//   setShowModal,
//   selectedOccasion, // The occasion object to be updated
//   eventName,
//   setEventName,
//   selectedDate,
//   setSelectedDate,
//   endDate,
//   setEndDate,
//   startTime,
//   setStartTime,
//   endTime,
//   setEndTime,
//   search, // for customer search
//   setSearch, // for customer search
//   selectedCustomer,
//   setSelectedCustomer,
//   showOptions, // for customer search
//   setShowOptions, // for customer search
//   filteredCustomers, // for customer search
//   navigate, // for creating new client
// }) => {
//   // --- HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP LEVEL ---
//   const {user} = useAuthContext();
//   const {mutateAsync: updateOccasion, isSuccess: isUpdateSuccess} =
//     useUpdateOccasion(user?.roleId);

//   // Effect to populate form fields when selectedOccasion changes (i.e., when modal opens)
//   useEffect(() => {
//     if (showModal && selectedOccasion) {
//       setEventName(selectedOccasion.name);
//       setSelectedDate(
//         new Date(selectedOccasion.startDate).toISOString().slice(0, 10),
//       );
//       setEndDate(new Date(selectedOccasion.endDate).toISOString().slice(0, 10));
//       setStartTime(
//         new Date(selectedOccasion.startDate).toTimeString().slice(0, 5),
//       );
//       setEndTime(new Date(selectedOccasion.endDate).toTimeString().slice(0, 5));
//       setSelectedCustomer(selectedOccasion.client);
//       setSearch(selectedOccasion.client?.user.fullname || '');
//     }
//   }, [
//     showModal,
//     selectedOccasion,
//     setEventName,
//     setSelectedDate,
//     setEndDate,
//     setStartTime,
//     setEndTime,
//     setSelectedCustomer,
//     setSearch,
//   ]);

//   // Effect to handle success after update
//   useEffect(() => {
//     if (isUpdateSuccess) {
//       setShowModal(false);
//       // Reset form states in Calendar.tsx after successful update
//       setEventName('');
//       setSelectedDate(null);
//       setEndDate('');
//       setSelectedCustomer(null);
//       setSearch('');
//       setStartTime('09:00');
//       setEndTime('17:00');
//     }
//   }, [
//     isUpdateSuccess,
//     setShowModal,
//     setEventName,
//     setSelectedDate,
//     setEndDate,
//     setSelectedCustomer,
//     setSearch,
//     setStartTime,
//     setEndTime,
//   ]);

//   // --- CONDITIONAL RETURN AFTER ALL HOOKS ARE CALLED ---
//   if (!showModal || !selectedOccasion) {
//     return null;
//   }

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     if (!selectedDate || !endDate) {
//       toast.error('Please select start and end dates');
//       return;
//     }

//     const startDateTime = new Date(`${selectedDate}T${startTime}`);
//     const endDateTime = new Date(`${endDate}T${endTime}`);

//     const updatedFormData = {
//       occasionId: selectedOccasion.id,
//       name: eventName,
//       clientId: selectedCustomer?.id,
//       startDate: startDateTime.toISOString(),
//       endDate: endDateTime.toISOString(),
//     };

//     try {
//       await updateOccasion({
//         occasionId: selectedOccasion.id,
//         data: updatedFormData,
//       });
//       setEventName('');
//       setSelectedDate(null);
//       setEndDate('');
//       setSelectedCustomer(null);
//       setSearch('');
//       setStartTime('09:00');
//       setEndTime('17:00');
//       console.log(updatedFormData);
//       // Success toast and modal closing are now handled by the isUpdateSuccess useEffect
//     } catch (error) {
//       console.error('Error updating occasion:', error);
//       toast.error('Failed to update event.');
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-black dark:text-white">
//             Update Event
//           </h2>
//           <button
//             className="rounded bg-primary p-3 text-white"
//             onClick={() => navigate({to: '/manager/customer'})}
//           >
//             Create Client
//           </button>
//         </div>
//         <form onSubmit={handleUpdate}>
//           <div className="mb-4">
//             <label className="mb-1 block font-medium text-black dark:text-white">
//               Event Name
//             </label>
//             <input
//               className="w-full rounded border p-2"
//               type="text"
//               placeholder="Event Name"
//               value={eventName}
//               onChange={(e) => setEventName(e.target.value)}
//               required
//             />
//           </div>

//           <div className="relative mb-4">
//             <label className="mb-1 block font-medium text-black dark:text-white">
//               Customer Name
//             </label>
//             <input
//               type="text"
//               value={selectedCustomer?.user.fullname || search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setSelectedCustomer(null);
//                 setShowOptions(true);
//               }}
//               onFocus={() => setShowOptions(true)}
//               onBlur={() => setTimeout(() => setShowOptions(false), 200)}
//               placeholder="Search Customer"
//               className="w-full rounded border p-2"
//               required
//             />
//             {showOptions && (
//               <ul className="border-gray-300 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow-lg">
//                 {filteredCustomers.length > 0 ? (
//                   filteredCustomers.map((c) => (
//                     <li
//                       key={c.id}
//                       onClick={() => {
//                         setSelectedCustomer(c);
//                         setSearch(c.user.fullname);
//                         setShowOptions(false);
//                       }}
//                       className="hover:bg-gray-100 cursor-pointer px-4 py-2"
//                     >
//                       {c.user.fullname}
//                     </li>
//                   ))
//                 ) : (
//                   <li className="text-gray-500 px-4 py-2">
//                     No customers found
//                   </li>
//                 )}
//               </ul>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="mb-1 block font-medium text-black dark:text-white">
//               Start Date
//             </label>
//             <input
//               type="date"
//               className="w-full rounded border p-2"
//               value={selectedDate || ''}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="mb-1 block font-medium text-black dark:text-white">
//               End Date
//             </label>
//             <input
//               type="date"
//               className="w-full rounded border p-2"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-4 flex gap-2">
//             <div className="flex-1">
//               <label className="mb-1 block font-medium text-black dark:text-white">
//                 Start Time
//               </label>
//               <input
//                 type="time"
//                 className="w-full rounded border p-2"
//                 value={startTime}
//                 onChange={(e) => setStartTime(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="flex-1">
//               <label className="mb-1 block font-medium text-black dark:text-white">
//                 End Time
//               </label>
//               <input
//                 type="time"
//                 className="w-full rounded border p-2"
//                 value={endTime}
//                 onChange={(e) => setEndTime(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full rounded bg-primary p-2 text-white"
//           >
//             Update Event
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateEventModal;

import React, {useEffect} from 'react';
import toast from 'react-hot-toast';
import {useUpdateOccasion} from '@/lib/api/occassionApi'; // Assuming you have a useUpdateOccasion hook
import {useAuthContext} from '@/context/AuthContext'; // To get roleId

const UpdateEventModal = ({
  showModal,
  setShowModal,
  selectedOccasion, // The occasion object to be updated
  eventName,
  setEventName,
  selectedDate,
  setSelectedDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  search, // for customer search
  setSearch, // for customer search
  selectedCustomer,
  setSelectedCustomer,
  showOptions, // for customer search
  setShowOptions, // for customer search

  navigate, // for creating new client
}) => {
  // --- HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP LEVEL ---
  const {user} = useAuthContext();
  const {mutateAsync: updateOccasion, isSuccess: isUpdateSuccess} =
    useUpdateOccasion(user?.roleId);

  console.log('selevtedddd', selectedCustomer);

  // Effect to populate form fields when selectedOccasion changes (i.e., when modal opens)
  useEffect(() => {
    if (showModal && selectedOccasion) {
      setEventName(selectedOccasion.name);
      setSelectedDate(
        new Date(selectedOccasion.startDate).toISOString().slice(0, 10),
      );
      setEndDate(new Date(selectedOccasion.endDate).toISOString().slice(0, 10));
      setStartTime(
        new Date(selectedOccasion.startDate).toTimeString().slice(0, 5),
      );
      setEndTime(new Date(selectedOccasion.endDate).toTimeString().slice(0, 5));
      setSelectedCustomer(selectedOccasion.client);
      setSearch(selectedOccasion.client?.user.fullname || '');
    }
  }, [
    showModal,
    selectedOccasion,
    setEventName,
    setSelectedDate,
    setEndDate,
    setStartTime,
    setEndTime,
    setSelectedCustomer,
    setSearch,
  ]);

  // Effect to handle success after update
  useEffect(() => {
    if (isUpdateSuccess) {
      setShowModal(false);
      // Reset form states in Calendar.tsx after successful update
      setEventName('');
      setSelectedDate(null);
      setEndDate('');
      setSelectedCustomer(null);
      setSearch('');
      setStartTime('09:00');
      setEndTime('17:00');
    }
  }, [
    isUpdateSuccess,
    setShowModal,
    setEventName,
    setSelectedDate,
    setEndDate,
    setSelectedCustomer,
    setSearch,
    setStartTime,
    setEndTime,
  ]);

  // --- CONDITIONAL RETURN AFTER ALL HOOKS ARE CALLED ---
  if (!showModal || !selectedOccasion) {
    return null;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    const startDateTime = new Date(`${selectedDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    const updatedFormData = {
      occasionId: selectedOccasion.id,
      name: eventName,
      clientId: selectedCustomer?.id,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    };

    try {
      await updateOccasion({
        occasionId: selectedOccasion.id,
        data: updatedFormData,
      });
      setEventName('');
      setSelectedDate(null);
      setEndDate('');
      setSelectedCustomer(null);
      setSearch('');
      setStartTime('09:00');
      setEndTime('17:00');
      console.log(updatedFormData);
      // Success toast and modal closing are now handled by the isUpdateSuccess useEffect
    } catch (error) {
      console.error('Error updating occasion:', error);
      toast.error('Failed to update event.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setShowModal(false)}
      ></div>

      <div className="relative max-h-[95vh] w-full max-w-md transform overflow-hidden overflow-y-auto rounded-lg bg-white shadow-2xl ring-1 ring-slate-200 transition-all duration-300 ease-out dark:bg-slate-800 dark:ring-slate-700 sm:rounded-2xl">
        {/* Header */}
        <div className="relative border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-700 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <svg
                  className="h-5 w-5 text-primary"
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
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  Update Event
                </h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Modify event details and schedule
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
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

        {/* Form Content */}
        <div className="px-4 py-4 sm:px-6 sm:py-6">
          {/* Create Client Button */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => navigate({to: '/manager/customer'})}
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Client
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-5">
            {/* Event Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                Event Name
              </label>
              <input
                type="text"
                placeholder="Enter event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-primary"
              />
            </div>

            {/* Customer Search */}
            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                Customer Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedCustomer?.name || search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedCustomer(null);
                    setShowOptions(true);
                  }}
                  onFocus={() => setShowOptions(true)}
                  onBlur={() => setTimeout(() => setShowOptions(false), 200)}
                  placeholder="Search for a customer"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-500 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-primary"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* {showOptions && (
                <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg ring-1 ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:ring-slate-700">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCustomer(c);
                          setSearch(c?.name);
                          setShowOptions(false);
                        }}
                        className="cursor-pointer border-b border-slate-100 px-4 py-3 text-sm text-slate-900 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <svg
                              className="h-4 w-4 text-primary"
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
                          <span className="font-medium">{c?.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-3">
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <span>No customers found</span>
                      </div>
                    </div>
                  )}
                </div>
              )} */}
            </div>

            {/* Date Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                  Start Date
                </label>
                <input
                  type="date"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            {/* Time Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Update Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateEventModal;
