// import {UserRequest} from '@/types/approval';
// import {useNavigate} from '@tanstack/react-router';
// import React from 'react';
// import {
//   MdSearch,
//   MdNotifications,
//   MdArrowForward,
//   MdWarning,
//   MdSchedule,
//   MdBlock,
//   MdCheckCircle,
// } from 'react-icons/md';

// interface RequestListProps {
//   requests: UserRequest[];
//   onSelect: (request: UserRequest) => void;
//   selectedId: string;
// }

// const RequestList: React.FC<RequestListProps> = ({
//   requests,
//   onSelect,
//   selectedId,
// }) => {
//   console.log('requests', requests);
//   // const todayRequests = requests.filter((r) => r?.user?.isVerified === false);
//   // const yesterdayRequests = requests.filter(
//   //   (r) => r?.user?.isRejected === true,
//   // );
//   const navigate = useNavigate();

//   return (
//     <div className="h-full flex-1 overflow-y-auto p-4 md:p-8">
//       <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
//         <div>
//           <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
//             Admin Console
//           </p>
//           <h1 className="mt-1 text-2xl font-bold text-black md:text-3xl">
//             Verification Dashboard
//           </h1>
//         </div>
//         <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
//           <div className="text-gray-600 flex items-center gap-2 text-sm">
//             <input
//               type="date"
//               className="text-gray-900 block w-36 rounded-lg border border-stroke bg-white py-2 pl-3 pr-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
//               placeholder="From Date"
//             />
//             <span className="text-gray-400">-</span>
//             <input
//               type="date"
//               className="text-gray-900 block w-36 rounded-lg border border-stroke bg-white py-2 pl-3 pr-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
//               placeholder="To Date"
//             />
//           </div>
//           <div className="relative w-full md:w-64">
//             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//               <MdSearch className="text-gray-400 text-xl" />
//             </div>
//             <input
//               type="text"
//               className="text-gray-900 placeholder-gray-500 block w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-3 transition duration-150 ease-in-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
//               placeholder="Search..."
//             />
//           </div>
//           <button className="text-gray-400 hover:text-gray-500 relative hidden p-2 focus:outline-none md:block">
//             <MdNotifications size={24} />
//             <span className="absolute right-2 top-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-stroke pb-1">
//         <FilterButton label="All Requests" count={24} active />
//         <FilterButton label="Pending" count={12} variant="orange" />
//         <FilterButton label="Approved" count={8} variant="green" />
//         <FilterButton label="Rejected" count={4} variant="red" />
//       </div>

//       {/* Today Section */}
//       <div className="mb-8">
//         {/* <h2 className="text-gray-500 mb-4 text-xs font-bold uppercase tracking-wider">
//           Today
//         </h2> */}
//         <div className="grid gap-4">
//           {requests.map((req) => (
//             <RequestCard
//               key={req.id}
//               request={req}
//               onClick={() => {
//                 onSelect(req);
//                 navigate({to: `/Approval/registrationDetails/${req.id}`});
//               }}
//               isSelected={selectedId === req.id}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Yesterday Section */}
//       {/* <div className="mb-8">
//         <h2 className="text-gray-500 mb-4 text-xs font-bold uppercase tracking-wider">
//           Yesterday
//         </h2>
//         <div className="grid gap-4">
//           {yesterdayRequests.map((req) => (
//             <RequestCard
//               key={req.id}
//               request={req}
//               onClick={() => {
//                 onSelect(req);
//                 navigate({to: `/Approval/registrationDetails/${req.id}`});
//               }}
//               isSelected={selectedId === req.id}
//             />
//           ))}
//         </div>
//       </div> */}

//       <div className="mt-8 flex justify-center pb-16">
//         <a
//           href="#"
//           className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-orange-700"
//         >
//           View All History
//           <MdArrowForward />
//         </a>
//       </div>
//     </div>
//   );
// };

// // Sub-components for cleaner code
// interface FilterButtonProps {
//   label: string;
//   count: number;
//   active?: boolean;
//   variant?: 'gray' | 'orange' | 'green' | 'red';
// }

// const FilterButton: React.FC<FilterButtonProps> = ({
//   label,
//   count,
//   active,
//   variant = 'gray',
// }) => {
//   const baseClasses =
//     'px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors border';
//   let classes = '';
//   let badgeClasses = 'text-xs px-2 py-0.5 rounded-full';

//   if (active) {
//     classes = `${baseClasses} bg-black text-white border-black shadow-sm`;
//     badgeClasses += ' bg-gray-700 text-white';
//   } else {
//     classes = `${baseClasses} bg-white border-stroke text-gray-600 hover:bg-gray-50`;
//     if (variant === 'orange') badgeClasses += ' bg-orange-100 text-orange-600';
//     if (variant === 'green') badgeClasses += ' bg-green-100 text-green-600';
//     if (variant === 'red') badgeClasses += ' bg-red-100 text-red-600';
//     if (variant === 'gray') badgeClasses += ' bg-gray-100 text-gray-600';
//   }

//   return (
//     <button className={classes}>
//       {label}
//       <span className={badgeClasses}>{count}</span>
//     </button>
//   );
// };

// interface RequestCardProps {
//   request: UserRequest;
//   onClick: () => void;
//   isSelected: boolean;
// }

// const RequestCard: React.FC<RequestCardProps> = ({
//   request,
//   onClick,
//   isSelected,
// }) => {
//   const isRejected = request?.user?.isRejected === true;
//   const isPending =
//     request?.user?.isRejected !== true && request?.user?.isVerified !== true;
//   const isApproved = request?.user?.isVerified === true;

//   const status = isRejected ? 'Rejected' : isApproved ? 'Approved' : 'Pending';

//   console.log('statusss', status);
//   const statusColors: Record<string, string> = {
//     Pending: 'bg-orange-50 text-orange-600 border-orange-100',
//     Approved: 'bg-green-50 text-green-600 border-green-100',
//     Rejected: 'bg-red-50 text-red-600 border-red-100',
//   };

//   return (
//     <div
//       onClick={onClick}
//       className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${isSelected ? 'ring-0.5 border-primary/50 ring-primary/50' : 'border-stroke'} ${request.status === 'Approved' ? 'opacity-75 hover:opacity-100' : ''} `}
//     >
//       <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
//         <div className="flex items-start gap-4 md:items-center">
//           {request?.photo ? (
//             <img
//               alt={request?.user?.fullname}
//               className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
//               src={request?.photo}
//             />
//           ) : (
//             <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-green-100 text-xl font-bold text-green-600">
//               {request?.user?.fullname
//                 .split(' ')
//                 .map((n) => n[0])
//                 .join('')}
//             </div>
//           )}
//           <div>
//             <h3 className="text-gray-900 text-lg font-bold">
//               {request?.user?.fullname}
//             </h3>
//             <div className="text-gray-500 mt-1 flex flex-wrap gap-x-3 text-sm">
//               <span>
//                 SWIFTBIC: <span className="font-mono">{request?.SWIFTBIC}</span>
//               </span>
//               {/* <span className="text-gray-300 hidden md:inline">•</span>
//               <span>Reg: {request.regDate}</span> */}
//             </div>

//             {/* Rejection Reason Block */}
//             {request?.rejectedReason && (
//               <div className="mt-2 inline-block w-full max-w-xl rounded-md border border-red-100 bg-red-50 p-2 md:w-auto">
//                 <p className="mb-0.5 text-xs font-semibold text-red-700">
//                   Rejection Reason:
//                 </p>
//                 <p className="text-gray-700 text-sm">
//                   {request?.rejectedReason}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center self-start md:self-center">
//           <span
//             className={`rounded-md border px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusColors[status]}`}
//           >
//             {status}
//           </span>
//         </div>
//       </div>

//       <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-stroke pt-4 md:flex-row">
//         <div className="text-gray-600 flex w-full items-center gap-2 text-sm md:w-auto">
//           {status === 'Pending' && (
//             <>
//               <MdWarning className="text-base text-primary" />
//               <span>Document Uploaded - Needs Review</span>
//             </>
//           )}

//           {status === 'Rejected' && (
//             <>
//               <MdBlock className="text-base text-red-500" />
//               <span>Application Declined</span>
//             </>
//           )}
//           {status === 'Approved' && (
//             <>
//               <MdCheckCircle className="text-base text-green-500" />
//               <span>Verification Complete</span>
//             </>
//           )}
//         </div>

//         {status === 'Pending' && (
//           <button className="w-full rounded-lg bg-primary px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-orange-600 md:w-auto">
//             Review Application
//           </button>
//         )}
//         {/* {status === 'Pending' && request?.assignedToYou && (
//           <button className="w-full rounded-lg bg-primary px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-orange-600 md:w-auto">
//             Resume Review
//           </button>
//         )} */}
//         {status === 'Rejected' && (
//           <button className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full rounded-lg border bg-white px-6 py-2 font-medium shadow-sm transition-colors md:w-auto">
//             View Details
//           </button>
//         )}
//         {status === 'Approved' && (
//           <button className="flex w-full items-center justify-center gap-1 text-sm font-medium text-primary hover:text-orange-700 md:w-auto md:justify-end">
//             View History <MdArrowForward />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RequestList;

import {UserRequest} from '@/types/approval';
import {useNavigate} from '@tanstack/react-router';
import React from 'react';
import {MdSearch, MdNotifications, MdArrowForward} from 'react-icons/md';
import RequestCard from './RequestCard';
import {getRequestStatus} from './methods';

interface RequestListProps {
  requests: UserRequest[];
  onSelect: (request: UserRequest) => void;
  selectedId: string;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  onSelect,
  selectedId,
}) => {
  console.log('requests', requests);
  const [activeFilter, setActiveFilter] = React.useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('ALL');

  const navigate = useNavigate();

  const filteredRequests = React.useMemo(() => {
    if (activeFilter === 'ALL') return requests;

    return requests.filter((r) => getRequestStatus(r) === activeFilter);
  }, [requests, activeFilter]);

  return (
    <div className="h-full flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Admin Console
          </p>
          <h1 className="mt-1 text-2xl font-bold text-black md:text-3xl">
            Verification Dashboard
          </h1>
        </div>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="text-gray-600 flex items-center gap-2 text-sm">
            <input
              type="date"
              className="text-gray-900 block w-36 rounded-lg border border-stroke bg-white py-2 pl-3 pr-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="From Date"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              className="text-gray-900 block w-36 rounded-lg border border-stroke bg-white py-2 pl-3 pr-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="To Date"
            />
          </div>
          <div className="relative w-full md:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdSearch className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              className="text-gray-900 placeholder-gray-500 block w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-3 transition duration-150 ease-in-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
              placeholder="Search..."
            />
          </div>
          <button className="text-gray-400 hover:text-gray-500 relative hidden p-2 focus:outline-none md:block">
            <MdNotifications size={24} />
            <span className="absolute right-2 top-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-stroke pb-1">
        <FilterButton
          label="All Requests"
          count={requests.length}
          active={activeFilter === 'ALL'}
          onClick={() => setActiveFilter('ALL')}
        />

        <FilterButton
          label="Pending"
          count={
            requests.filter((r) => getRequestStatus(r) === 'PENDING').length
          }
          variant="orange"
          active={activeFilter === 'PENDING'}
          onClick={() => setActiveFilter('PENDING')}
        />

        <FilterButton
          label="Approved"
          count={
            requests.filter((r) => getRequestStatus(r) === 'APPROVED').length
          }
          variant="green"
          active={activeFilter === 'APPROVED'}
          onClick={() => setActiveFilter('APPROVED')}
        />

        <FilterButton
          label="Rejected"
          count={
            requests.filter((r) => getRequestStatus(r) === 'REJECTED').length
          }
          variant="red"
          active={activeFilter === 'REJECTED'}
          onClick={() => setActiveFilter('REJECTED')}
        />
      </div>

      <div className="mb-8">
        <div className="grid gap-4">
          {filteredRequests?.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onClick={() => {
                onSelect(req);
              }}
              isSelected={selectedId === req.id}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center pb-16">
        <a
          href="#"
          className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-orange-700"
        >
          View All History
          <MdArrowForward />
        </a>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
interface FilterButtonProps {
  label: string;
  count: number;
  active?: boolean;
  variant?: 'gray' | 'orange' | 'green' | 'red';
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  count,
  active,
  variant = 'gray',
  onClick,
}) => {
  const baseClasses =
    'px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors border';
  let classes = '';
  let badgeClasses = 'text-xs px-2 py-0.5 rounded-full';

  if (active) {
    classes = `${baseClasses} bg-black text-white border-black shadow-sm`;
    badgeClasses += ' bg-gray-700 text-white';
  } else {
    classes = `${baseClasses} bg-white border-stroke text-gray-600 hover:bg-gray-50`;
    if (variant === 'orange') badgeClasses += ' bg-orange-100 text-orange-600';
    if (variant === 'green') badgeClasses += ' bg-green-100 text-green-600';
    if (variant === 'red') badgeClasses += ' bg-red-100 text-red-600';
    if (variant === 'gray') badgeClasses += ' bg-gray-100 text-gray-600';
  }

  return (
    <button className={classes} onClick={onClick}>
      {label}
      <span className={badgeClasses}>{count}</span>
    </button>
  );
};

export default RequestList;
