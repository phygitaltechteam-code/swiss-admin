import {useGetAttendance} from '@/lib/react-query/timeSheet';
import {Route} from '@/routes/_app/company/empattendance.$id';
import React, {useMemo, useState} from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {minutesToHours} from '@/lib/Methods';
import {useNavigate} from '@tanstack/react-router';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const EmpAttendace = () => {
  const {id} = Route.useParams();
  const {data: attendance} = useGetAttendance(id);
  console.log('eah attendance', attendance);
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <span
          onClick={() => {
            navigate({
              to: `/employee/emptask/${id}`,
              search: {
                date: row?.date,
              },
            });
          }}
          className="cursor-pointer text-[#0284C7] hover:underline"
        >
          {row.date}
        </span>
      ),
    },
    {header: 'Check In', accessor: 'checkIn'},
    {header: 'Check Out', accessor: 'checkOut'},
    {header: 'Total', accessor: 'totalWorkingHours'},
    {header: 'Break', accessor: 'breakTime'},
    {header: 'Status', accessor: 'status'},
  ];

  const parseWorkingHoursToMinutes = (value: string | '--') => {
    if (!value || value === '--') return 0;

    const match = value.match(/(\d+)\s*hrs\s*:\s*(\d+)\s*min/);

    if (!match) return 0;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    return hours * 60 + minutes;
  };

  const getAllDatesOfMonth = (month: number) => {
    const today = new Date();
    const year = today.getFullYear();
    const dates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date <= today) {
        dates.push(date);
      }
    }
    return dates;
  };

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const tableData = useMemo(() => {
    const allDates = getAllDatesOfMonth(selectedMonth);

    return allDates.map((date) => {
      const record = attendance?.attendance?.find((att: any) =>
        isSameDate(new Date(att.date), date),
      );

      let status = 'Absent';
      let checkIn = '--';
      let checkOut = '--';
      let totalWorkingHours = '--';
      let breakTime = '--';
      let rowClass = 'bg-red-100';

      if (record) {
        if (record.inStatus === 'LEAVE' && record.outStatus === 'LEAVE') {
          status = 'Leave';
          rowClass = 'bg-yellow-100';
        } else {
          status = record.inStatus || 'Present';
          checkIn = record.inTime
            ? new Date(record.inTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '--';
          checkOut = record.outTime
            ? new Date(record.outTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '--';
          totalWorkingHours = minutesToHours(record.workingminutes || 0);
          breakTime = minutesToHours(record.breakMinutes || 0);
          rowClass = '';
        }
      }

      return {
        id: date.toISOString(),
        date: date.toLocaleDateString(),
        checkIn,
        checkOut,
        totalWorkingHours,
        breakTime,
        status,
        rowClass,
      };
    });
  }, [attendance, selectedMonth]);

  const summary = useMemo(() => {
    return {
      workingDays: tableData.filter(
        (d) => d.status !== 'Absent' && d.status !== 'Leave',
      ).length,
      totalWorkingMinutes: tableData.reduce(
        (sum, each) => sum + parseWorkingHoursToMinutes(each.totalWorkingHours),
        0,
      ),

      lateDays: tableData.filter((each) => each.status === 'LATE').length,
      onTimeDays: tableData.filter((each) => each.status === 'ON_TIME').length,
      earlyLeaveDays: tableData.filter((each) => each.status === 'EARLY_LEAVE')
        .length,
    };
  }, [tableData]);

  //   return (
  //     <div className="mt-10 px-6">
  //       <div className="rounded bg-white p-4">
  //         <div className="mb-4 flex items-center gap-3">
  //           <label className="text-sm font-medium">Select Month:</label>
  //           <select
  //             className="rounded border px-3 py-1"
  //             value={selectedMonth}
  //             onChange={(e) => setSelectedMonth(Number(e.target.value))}
  //           >
  //             {MONTHS.map((month, index) => (
  //               <option key={month} value={index}>
  //                 {month}
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //         <h2 className="mb-4 text-lg font-semibold">
  //           {MONTHS[selectedMonth]} Summary
  //         </h2>
  //         <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
  //           <SummaryCard label="Working Days" value={summary.workingDays} />
  //           <SummaryCard
  //             label="Working Hours"
  //             value={minutesToHours(summary.totalWorkingMinutes)}
  //           />
  //           <SummaryCard label="On Time" value={summary.onTimeDays} />
  //           <SummaryCard label="Late Arrival" value={summary.lateDays} />
  //           <SummaryCard label="Early Leave" value={summary.earlyLeaveDays} />
  //         </div>

  //         <h2 className="mb-2 text-lg font-semibold">Attendance</h2>
  //         <GenericNewTable
  //           data={tableData}
  //           columns={columns}
  //           rowClassName={(row: any) => row.rowClass || ''}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  // const SummaryCard = ({label, value}: {label: string; value: any}) => (
  //   <div className="rounded bg-slate-100 p-3 text-center">
  //     <p className="text-gray-600 text-sm">{label}</p>
  //     <p className="text-lg font-semibold">{value}</p>
  //   </div>
  // );

  // export default EmpAttendace;

  // ... (keep all the existing imports and code above the return statement)

  return (
    <div className="mt-10 px-6">
      <div className="rounded-lg bg-white px-6 py-2 shadow-sm">
        <div className="mb-2 flex items-center justify-between border-b border-neutral-200 py-2">
          <div>
            <h1 className="text-gray-900 text-xl font-bold">
              Employee Attendance
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-sm font-medium">
              Select Month:
            </label>
            <select
              className="border-gray-300 text-gray-700 rounded-lg border bg-white px-4 py-2 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-1">
          <h2 className="text-gray-800 mb-3 text-center text-lg font-semibold">
            {MONTHS[selectedMonth]} Summary
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard
              label="Working Days"
              value={summary.workingDays}
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color="blue"
            />
            <SummaryCard
              label="Working Hours"
              value={minutesToHours(summary.totalWorkingMinutes)}
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              color="green"
            />
            <SummaryCard
              label="On Time"
              value={summary.onTimeDays}
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
              color="emerald"
            />
            <SummaryCard
              label="Late Arrival"
              value={summary.lateDays}
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color="amber"
            />
            <SummaryCard
              label="Early Leave"
              value={summary.earlyLeaveDays}
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color="red"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-2">
          <GenericNewTable
            data={tableData}
            columns={columns}
            rowClassName={(row: any) => row.rowClass || ''}
            rowsPerPage={40}
          />
        </div>
      </div>
    </div>
  );
};

// Updated SummaryCard component with enhanced design
const SummaryCard = ({
  label,
  value,
  icon,
  color = 'blue',
}: {
  label: string;
  value: any;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'emerald' | 'amber' | 'red';
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      text: 'text-blue-900',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      text: 'text-green-900',
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      text: 'text-emerald-900',
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      text: 'text-amber-900',
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      text: 'text-red-900',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`${colors.bg} rounded-xl p-5 transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`${colors.text} mt-2 text-2xl font-bold`}>{value}</p>
        </div>
        {icon && (
          // <div className={`${colors.iconBg} rounded-lg p-3`}>

          // </div>
          <div className={colors.iconColor}>{icon}</div>
        )}
      </div>
    </div>
  );
};

export default EmpAttendace;
