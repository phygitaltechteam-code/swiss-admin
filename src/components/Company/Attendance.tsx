import React, {useState} from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useGetTodaysAttendance} from '@/lib/react-query/timeSheet';
import {useNavigate} from '@tanstack/react-router';
import {minutesToHours} from '@/lib/Methods';

const Attendance = () => {
  const {data: attendance} = useGetTodaysAttendance();
  const navigate = useNavigate();
  const toYMD = (date: string | Date) =>
    new Date(date).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(toYMD(new Date()));

  const columns = [
    {header: 'Emp Name', accessor: 'name', sortable: true},
    {header: 'Check In', accessor: 'checkIn'},
    {header: 'Check Out', accessor: 'checkOut'},
    {header: 'Total', accessor: 'totalWorkingHours'},
    {header: 'Break', accessor: 'breakTime'},
    {header: 'In Status', accessor: 'inStatus'},
    {header: 'Out Status', accessor: 'outStatus'},
  ];

  const filteredAttendance = attendance?.filter((each) => {
    return toYMD(each.date) === selectedDate;
  });

  const formatTableData = filteredAttendance?.map((each) => ({
    id: each.id,
    name: (
      <span
        className="cursor-pointer text-blue-600 hover:underline"
        onClick={() =>
          navigate({
            to: `/company/empattendance/${each?.employeeId}`,
          })
        }
      >
        {each?.employee?.fullname}
      </span>
    ),
    checkIn: new Date(each?.inTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    checkOut: each?.outTime
      ? new Date(each.outTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-',
    totalWorkingHours: minutesToHours(each?.workingminutes),
    breakTime: minutesToHours(each?.breakMinutes),
    inStatus: each?.inStatus,
    outStatus: each?.outStatus,
  }));

  return (
    <div className="mt-10 px-6">
      <div className="bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Attendance</h2>
          <div>
            <label className="text-sm font-medium">Select Date: </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded border px-2 py-1"
            />
          </div>
        </div>

        <GenericNewTable data={formatTableData} columns={columns} />
      </div>
    </div>
  );
};

export default Attendance;
