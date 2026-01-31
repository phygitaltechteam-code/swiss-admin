// /*eslint-disable*/
// import {useGetAlloCCationIncome} from '@/lib/api/incomeExpenseApi';
// import React, {useRef, useState} from 'react';
// import {FaFileAlt} from 'react-icons/fa';
// import {useReactToPrint} from 'react-to-print';

// const IncomeReport = () => {
//   const {data: IncomeExpenseData} = useGetAlloCCationIncome();
//   const [statusFilter, setStatusFilter] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const filteredData = IncomeExpenseData?.filter((item) => {
//     const itemDate = new Date(item.date);
//     const isWithinDate =
//       (!startDate || itemDate >= new Date(startDate)) &&
//       (!endDate || itemDate <= new Date(endDate));

//     const matchesStatus =
//       !statusFilter || item.status?.toUpperCase() === statusFilter;

//     return isWithinDate && matchesStatus;
//   });
//   console.log('filterdd', filteredData);

//   const printRef = useRef(null);
//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: `QR-${Math.random().toString(36).substring(7)}`,
//     pageStyle: `
//         @page { size: A4; margin: 0; }
//         body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white !important; display: flex; align-items: center; justify-content: center; }
//       `,
//   });

//   return (
//     <div className="bg-gray-50 p- mt-5 bg-white p-7 dark:bg-boxdark dark:text-white">
//       <div className="mx-auto">
//         <div className="">
//           <h2 className="text-gray-900 text-2xl font-bold">Income Report</h2>
//         </div>

//         <div className="py-2">
//           <h3 className="text-gray-900 mb-2 text-lg font-semibold">Filters</h3>
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             <div>
//               <label className="text-gray-700 mb-2 block text-sm font-medium">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//               />
//             </div>

//             <div>
//               <label className="text-gray-700 mb-2 block text-sm font-medium">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//               />
//             </div>

//             <div>
//               <label className="text-gray-700 mb-2 block text-sm font-medium">
//                 Status
//               </label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//               >
//                 <option value="">All Status</option>
//                 <option value="INCOME">Income</option>
//                 <option value="RECEIVABLE">Pending</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="mb-4 flex items-center justify-between">
//           <p className="text-gray-600 text-sm">
//             Showing <span className="font-semibold">{filteredData?.length}</span>{' '}
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

//         {/* Table */}
//         <div
//           className="overflow-hidden rounded-lg border border-stroke shadow-sm dark:border-strokedark dark:bg-boxdark dark:text-white"
//           ref={printRef}
//         >
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50 border-b border-stroke dark:border-strokedark">
//                 <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
//                   Event
//                 </th>
//                 <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
//                   Bill No
//                 </th>
//                 <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
//                   Bank
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-stroke bg-white dark:divide-strokedark dark:bg-boxdark dark:text-white">
//               {filteredData?.length > 0 ? (
//                 filteredData.map((item) => (
//                   <tr
//                     key={item.id}
//                     className={`hover:bg-gray-50 transition-colors`}
//                   >
//                     <td className="text-gray-900 px-4 py-3 text-sm">
//                       {item?.oscassion?.name || '-'}
//                     </td>
//                     <td className="text-gray-900 px-4 py-3 text-sm">
//                       {item.billNo || '-'}
//                     </td>
//                     <td className="text-gray-900 px-4 py-3 text-sm font-medium">
//                       {typeof item.amount === 'number'
//                         ? `$${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
//                         : item.amount}
//                     </td>
//                     <td className="text-gray-600 px-4 py-3 text-sm">
//                       {new Date(item.date).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric',
//                       })}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                           item.status === 'INCOME'
//                             ? 'bg-green-100 text-green-800'
//                             : item.status === 'RECEIVABLE'
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : 'bg-gray-100 text-gray-800'
//                         }`}
//                       >
//                         {item.status === 'RECEIVABLE' ? 'PENDING' : item.status}
//                       </span>
//                     </td>

//                     <td className="text-gray-600 px-4 py-3 text-sm">
//                       {item.bankName || '-'}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="px-4 py-8 text-center">
//                     <div className="text-gray-500 flex flex-col items-center justify-center">
//                       <svg
//                         className="text-gray-400 mb-3 h-12 w-12"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={1.5}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                       <p className="text-lg font-medium">No records found</p>
//                       <p className="mt-1 text-sm">
//                         Try adjusting your filters to find what you're looking
//                         for.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IncomeReport;

/*eslint-disable*/
import {useGetAlloCCationIncome} from '@/lib/api/incomeExpenseApi';
import React, {useRef, useState} from 'react';
import {FaFileAlt} from 'react-icons/fa';
import {useReactToPrint} from 'react-to-print';

const IncomeReport = () => {
  const {data: IncomeExpenseData} = useGetAlloCCationIncome();
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = IncomeExpenseData?.filter((item) => {
    const itemDate = new Date(item.date);
    const isWithinDate =
      (!startDate || itemDate >= new Date(startDate)) &&
      (!endDate || itemDate <= new Date(endDate));

    const matchesStatus =
      !statusFilter || item.status?.toUpperCase() === statusFilter;

    return isWithinDate && matchesStatus;
  });
  console.log('filterdd', filteredData);

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Income-Report-${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
        @page { 
          size: A4; 
          margin: 0.5in;
          @top-center {
            content: "Income Report";
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
            Income Report
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
              {filteredData?.length}
            </div>
          </div>
          {(startDate || endDate || statusFilter) && (
            <div className="mt-4 flex justify-center gap-6 text-xs">
              {startDate && (
                <span>
                  <strong>From:</strong>{' '}
                  {new Date(startDate).toLocaleDateString()}
                </span>
              )}
              {endDate && (
                <span>
                  <strong>To:</strong> {new Date(endDate).toLocaleDateString()}
                </span>
              )}
              {statusFilter && (
                <span>
                  <strong>Status:</strong>{' '}
                  {statusFilter === 'RECEIVABLE' ? 'PENDING' : statusFilter}
                </span>
              )}
            </div>
          )}
        </div>

        {/* PDF Table */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-neutral-600">
              <th className="border-b border-stroke px-4 py-3 text-left font-semibold">
                Event
              </th>
              <th className="border-b border-stroke px-4 py-3 text-left font-semibold">
                Bill No
              </th>
              <th className="border-b border-stroke px-4 py-3 text-left font-semibold">
                Amount
              </th>
              <th className="border-b border-stroke px-4 py-3 text-left font-semibold">
                Date
              </th>
              <th className="border-b border-stroke px-4 py-3 text-left font-semibold">
                Status
              </th>
              <th className="border-b border-stroke px-4 py-3 text-left font-semibold">
                Bank
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="text-gray-700 border-b border-stroke px-4 py-3">
                    {item?.oscassion?.name || '-'}
                  </td>
                  <td className="text-gray-700 border-b border-stroke px-4 py-3">
                    {item.billNo || '-'}
                  </td>
                  <td className="text-gray-900 border-b border-stroke px-4 py-3 font-medium">
                    {typeof item.amount === 'number'
                      ? `$${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                      : item.amount}
                  </td>
                  <td className="text-gray-700 border-b border-stroke px-4 py-3">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="border-b border-stroke px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'INCOME'
                          ? 'border border-green-200 bg-green-100 text-green-800'
                          : item.status === 'RECEIVABLE'
                            ? 'border border-yellow-200 bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800 border-gray-200 border'
                      }`}
                    >
                      {item.status === 'RECEIVABLE' ? 'PENDING' : item.status}
                    </span>
                  </td>
                  <td className="text-gray-700 border-b border-stroke px-4 py-3">
                    {item.bankName || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="border-b border-stroke px-4 py-8 text-center"
                >
                  <div className="text-gray-500 flex flex-col items-center justify-center">
                    <svg
                      className="text-gray-400 mb-3 h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No records found</p>
                    <p className="mt-1 text-sm">
                      Try adjusting your filters to find what you're looking
                      for.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PDF Footer */}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p- mt-5 bg-white p-7 dark:bg-boxdark dark:text-white">
      <div className="mx-auto">
        <div className="">
          <h2 className="text-gray-900 text-2xl font-bold">Income Report</h2>
        </div>

        <div className="py-2">
          <h3 className="text-gray-900 mb-2 text-lg font-semibold">Filters</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-2.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">All Status</option>
                <option value="INCOME">Income</option>
                <option value="RECEIVABLE">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            Showing{' '}
            <span className="font-semibold">{filteredData?.length}</span>{' '}
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

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-stroke shadow-sm dark:border-strokedark dark:bg-boxdark dark:text-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-stroke dark:border-strokedark">
                <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Event
                </th>
                <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Bill No
                </th>
                <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Date
                </th>
                <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="text-gray-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Bank
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke bg-white dark:divide-strokedark dark:bg-boxdark dark:text-white">
              {filteredData?.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors`}
                  >
                    <td className="text-gray-900 px-4 py-3 text-sm">
                      {item?.oscassion?.name || '-'}
                    </td>
                    <td className="text-gray-900 px-4 py-3 text-sm">
                      {item.billNo || '-'}
                    </td>
                    <td className="text-gray-900 px-4 py-3 text-sm font-medium">
                      {typeof item.amount === 'number'
                        ? `$${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                        : item.amount}
                    </td>
                    <td className="text-gray-600 px-4 py-3 text-sm">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.status === 'INCOME'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'RECEIVABLE'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status === 'RECEIVABLE' ? 'PENDING' : item.status}
                      </span>
                    </td>

                    <td className="text-gray-600 px-4 py-3 text-sm">
                      {item.bankName || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <div className="text-gray-500 flex flex-col items-center justify-center">
                      <svg
                        className="text-gray-400 mb-3 h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-lg font-medium">No records found</p>
                      <p className="mt-1 text-sm">
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

        {/* Hidden PDF View */}
        <PDFView />
      </div>
    </div>
  );
};

export default IncomeReport;
