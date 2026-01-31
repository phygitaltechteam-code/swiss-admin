// /*eslint-disable*/
// import React, {useState, useMemo, useRef} from 'react';
// import {useAuthContext} from '@/context/AuthContext';
// import {useOccasions} from '@/lib/api/occassionApi';
// import {useReactToPrint} from 'react-to-print';
// import {FaFile, FaFileAlt, FaFileArchive} from 'react-icons/fa';
// import {FaFileArrowDown} from 'react-icons/fa6';

// const BookingReport = () => {
//   const {user} = useAuthContext();
//   const {data: occasions = []} = useOccasions(user?.roleId);

//   const [filters, setFilters] = useState({
//     startDate: '',
//     endDate: '',
//     status: '',
//   });

//   // Filter logic
//   const filteredOccasions = useMemo(() => {
//     return occasions.filter((item: any) => {
//       const itemStart = new Date(item.startDate);
//       const filterStart = filters.startDate
//         ? new Date(filters.startDate)
//         : null;
//       const filterEnd = filters.endDate ? new Date(filters.endDate) : null;

//       const matchesStatus =
//         filters.status === '' || item.status === filters.status;

//       const matchesDate =
//         (!filterStart || itemStart >= filterStart) &&
//         (!filterEnd || itemStart <= filterEnd);

//       return matchesStatus && matchesDate;
//     });
//   }, [occasions, filters]);

//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case 'ENQUIRY':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'BOOKED':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const printRef = useRef(null);
//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: `QR-${Math.random().toString(36).substring(7)}`,
//     pageStyle: `
//       @page { size: A4; margin: 0; }
//       body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white !important; display: flex; align-items: center; justify-content: center; }
//     `,
//   });

//   return (
//     <div className="bg-gray-50 p- mt-5 bg-white p-7 dark:bg-boxdark dark:text-white">
//       <div className="mx-auto">
//         {/* Header */}
//         <div className="">
//           <h2 className="text-gray-900 text-2xl font-bold">Booking Report</h2>
//         </div>

//         {/* Filters Card */}
//         <div className="py-2">
//           <h3 className="text-gray-900 mb-2 text-lg font-semibold">Filters</h3>
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             <div>
//               <label className="text-gray-700 mb-2 block text-sm font-medium">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                 value={filters.startDate}
//                 onChange={(e) =>
//                   setFilters({...filters, startDate: e.target.value})
//                 }
//               />
//             </div>

//             <div>
//               <label className="text-gray-700 mb-2 block text-sm font-medium">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                 value={filters.endDate}
//                 onChange={(e) =>
//                   setFilters({...filters, endDate: e.target.value})
//                 }
//               />
//             </div>

//             <div>
//               <label className="text-gray-700 mb-2 block text-sm font-medium">
//                 Status
//               </label>
//               <select
//                 className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                 value={filters.status}
//                 onChange={(e) =>
//                   setFilters({...filters, status: e.target.value})
//                 }
//               >
//                 <option value="">All Status</option>
//                 <option value="ENQUIRY">ENQUIRY</option>
//                 <option value="BOOKED">BOOKED</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Results Summary */}
//         <div className="mb-4 flex items-center justify-between">
//           <p className="text-gray-600 text-sm">
//             Showing{' '}
//             <span className="font-semibold">{filteredOccasions.length}</span>{' '}
//             results
//           </p>
//           <button
//             className="mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
//             onClick={handlePrint}
//           >
//             <FaFileAlt className="text-lg text-white" />
//             <span>Download</span>
//           </button>
//         </div>

//         {/* Table Card */}
//         <div className="overflow-hidden bg-white dark:bg-boxdark">
//           <div className="overflow-x-auto" ref={printRef}>
//             <table className="divide-gray-200 min-w-full divide-y divide-stroke dark:divide-strokedark">
//               <thead className="bg-neutral-100 dark:bg-meta-4 dark:text-white">
//                 <tr>
//                   <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
//                     Event
//                   </th>
//                   <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
//                     Banquet
//                   </th>
//                   <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
//                     Start Date
//                   </th>
//                   <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
//                     End Date
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-gray-200 divide-y divide-stroke bg-white dark:divide-strokedark dark:bg-boxdark dark:text-white">
//                 {filteredOccasions.length > 0 ? (
//                   filteredOccasions.map((item: any) => (
//                     <tr
//                       key={item.id}
//                       className="hover:bg-gray-50 transition-colors duration-150"
//                     >
//                       <td className="whitespace-nowrap px-6 py-4">
//                         <div className="text-gray-900 text-sm font-medium">
//                           {item.name}
//                         </div>
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-4">
//                         <div className="text-gray-900 text-sm">
//                           {item.banquet?.name}
//                         </div>
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-4">
//                         <div className="text-gray-900 text-sm">
//                           {item.customer?.fullname}
//                         </div>
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-4">
//                         <div className="text-gray-600 text-sm">
//                           {item.customer?.phoneNumber}
//                         </div>
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-4">
//                         <span
//                           className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(item.status)}`}
//                         >
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-4">
//                         <div className="text-gray-900 text-sm">
//                           {new Date(item.startDate).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-4">
//                         <div className="text-gray-900 text-sm">
//                           {new Date(item.endDate).toLocaleDateString()}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td className="px-6 py-12 text-center" colSpan={7}>
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="text-gray-400 mb-2">
//                           <svg
//                             className="h-12 w-12"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={1}
//                               d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                         </div>
//                         <p className="text-gray-500 text-lg font-medium">
//                           No records found
//                         </p>
//                         <p className="text-gray-400 mt-1 text-sm">
//                           Try adjusting your filters to find what you're looking
//                           for.
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingReport;

/*eslint-disable*/
import React, {useState, useMemo, useRef} from 'react';
import {useAuthContext} from '@/context/AuthContext';
import {useOccasions} from '@/lib/api/occassionApi';
import {useReactToPrint} from 'react-to-print';
import {FaFile, FaFileAlt, FaFileArchive} from 'react-icons/fa';
import {FaFileArrowDown} from 'react-icons/fa6';

const BookingReport = () => {
  const {user} = useAuthContext();
  const {data: occasions = []} = useOccasions(user?.roleId);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  // Filter logic
  const filteredOccasions = useMemo(() => {
    return occasions.filter((item: any) => {
      const itemStart = new Date(item.startDate);
      const filterStart = filters.startDate
        ? new Date(filters.startDate)
        : null;
      const filterEnd = filters.endDate ? new Date(filters.endDate) : null;

      const matchesStatus =
        filters.status === '' || item.status === filters.status;

      const matchesDate =
        (!filterStart || itemStart >= filterStart) &&
        (!filterEnd || itemStart <= filterEnd);

      return matchesStatus && matchesDate;
    });
  }, [occasions, filters]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ENQUIRY':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BOOKED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Booking-Report-${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page { 
        size: A4; 
        margin: 0.5in;
        @top-center {
          content: "Booking Report";
          font-size: 16px;
          font-weight: bold;
          color: #1f2937;
        }
        @bottom-center {
          content: "Page " counter(page) " of " counter(pages);
          font-size: 12px;
          color: #6b7280;
        }
      }
      body { 
        -webkit-print-color-adjust: exact !important; 
        print-color-adjust: exact !important; 
        background: white !important;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
    `,
  });

  // PDF-specific component
  const PDFView = () => (
    <div style={{display: 'none'}}>
      <div ref={printRef} className="bg-white p-8">
        {/* PDF Header */}
        <div className="border-gray-300 mb-8 border-b-2 pb-6 text-center">
          <h1 className="text-gray-800 mb-2 text-3xl font-bold">
            Booking Report
          </h1>
          <div className="text-gray-600 flex justify-center gap-8 text-sm">
            <div>
              <span className="font-semibold">Generated: </span>
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div>
              <span className="font-semibold">Total Records: </span>
              {filteredOccasions.length}
            </div>
          </div>
          {filters.startDate || filters.endDate || filters.status ? (
            <div className="mt-4 flex justify-center gap-6 text-xs">
              {filters.startDate && (
                <span>
                  <strong>From:</strong>{' '}
                  {new Date(filters.startDate).toLocaleDateString()}
                </span>
              )}
              {filters.endDate && (
                <span>
                  <strong>To:</strong>{' '}
                  {new Date(filters.endDate).toLocaleDateString()}
                </span>
              )}
              {filters.status && (
                <span>
                  <strong>Status:</strong> {filters.status}
                </span>
              )}
            </div>
          ) : null}
        </div>

        {/* PDF Table */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 border-b border-stroke text-neutral-700">
              <th className="px-4 py-3 text-left font-semibold">Event</th>
              <th className="px-4 py-3 text-left font-semibold">Banquet</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Start Date</th>
              <th className="px-4 py-3 text-left font-semibold">End Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOccasions.map((item: any, index: number) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="text-gray-900 border-b border-stroke px-4 py-3 font-medium">
                  {item.name}
                </td>
                <td className="text-gray-700 border-b border-b-stroke px-4 py-3">
                  {item.banquet?.name}
                </td>
                <td className="text-gray-700 border-b border-b-stroke px-4 py-3">
                  {item.customer?.fullname}
                </td>
                <td className="text-gray-700 border-b border-b-stroke px-4 py-3">
                  {item.customer?.phoneNumber}
                </td>
                <td className="border-b border-b-stroke px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === 'BOOKED'
                        ? 'border border-green-200 bg-green-100 text-green-800'
                        : item.status === 'ENQUIRY'
                          ? 'border border-blue-200 bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 border-gray-200 border'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="text-gray-700 border-b border-stroke px-4 py-3">
                  {new Date(item.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="text-gray-700 border-b border-stroke px-4 py-3">
                  {new Date(item.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOccasions.length === 0 && (
          <div className="mt-4 border-b border-stroke py-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No records found
            </p>
            <p className="text-gray-400 mt-1 text-sm">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* PDF Footer */}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p- mt-5 bg-white p-7 dark:bg-boxdark dark:text-white">
      <div className="mx-auto">
        {/* Header */}
        <div className="">
          <h2 className="text-gray-900 text-2xl font-bold">Booking Report</h2>
        </div>

        {/* Filters Card */}
        <div className="py-2">
          <h3 className="text-gray-900 mb-2 text-lg font-semibold">Filters</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Start Date
              </label>
              <input
                type="date"
                className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({...filters, startDate: e.target.value})
                }
              />
            </div>

            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                End Date
              </label>
              <input
                type="date"
                className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({...filters, endDate: e.target.value})
                }
              />
            </div>

            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Status
              </label>
              <select
                className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={filters.status}
                onChange={(e) =>
                  setFilters({...filters, status: e.target.value})
                }
              >
                <option value="">All Status</option>
                <option value="ENQUIRY">ENQUIRY</option>
                <option value="BOOKED">BOOKED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            Showing{' '}
            <span className="font-semibold">{filteredOccasions.length}</span>{' '}
            results
          </p>
          <button
            className="mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
            onClick={handlePrint}
          >
            <FaFileAlt className="text-lg text-white" />
            <span>Download</span>
          </button>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden bg-white dark:bg-boxdark">
          <div className="overflow-x-auto">
            <table className="divide-gray-200 min-w-full divide-y divide-stroke dark:divide-strokedark">
              <thead className="bg-neutral-100 dark:bg-meta-4 dark:text-white">
                <tr>
                  <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Event
                  </th>
                  <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Banquet
                  </th>
                  <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="text-gray-500 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    End Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-gray-200 divide-y divide-stroke bg-white dark:divide-strokedark dark:bg-boxdark dark:text-white">
                {filteredOccasions.length > 0 ? (
                  filteredOccasions.map((item: any) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-gray-900 text-sm font-medium">
                          {item.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-gray-900 text-sm">
                          {item.banquet?.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-gray-900 text-sm">
                          {item.customer?.fullname}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-gray-600 text-sm">
                          {item.customer?.phoneNumber}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-gray-900 text-sm">
                          {new Date(item.startDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-gray-900 text-sm">
                          {new Date(item.endDate).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan={7}>
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                          <svg
                            className="h-12 w-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">
                          No records found
                        </p>
                        <p className="text-gray-400 mt-1 text-sm">
                          Try adjusting your filters to find what you're looking
                          for.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hidden PDF View */}
        <PDFView />
      </div>
    </div>
  );
};

export default BookingReport;
