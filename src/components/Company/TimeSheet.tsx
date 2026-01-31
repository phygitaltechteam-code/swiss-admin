/*eslint-disable*/
import {useGetTimeSheet} from '@/lib/react-query/timeSheet';
import React, {useEffect, useMemo, useState} from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useNavigate, useParams} from '@tanstack/react-router';

type Props = {
  id: string;
  date?: string;
};

const parseDate = (dateStr: string) => {
  const [dd, mm, yyyy] = dateStr.split('/');
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
};

const TimeSheet: React.FC<Props> = ({id, date}) => {
  const {data: timeSheet} = useGetTimeSheet(id!);
  const navigate = useNavigate();
  console.log('time sheet date/////////////', timeSheet);

  const timeToMinutes = (time: string) => {
    const date = new Date(`1970-01-01 ${time}`);
    return date.getHours() * 60 + date.getMinutes();
  };

  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  useEffect(() => {
    if (date) {
      const formatted = date.includes('/')
        ? formatToInputDate(date)
        : date.split('T')[0];

      setFromDate(formatted);
      setToDate(formatted);
    }
  }, [date]);

  const formatToInputDate = (dateStr: string) => {
    // expects: M/D/YYYY or MM/DD/YYYY
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const getStartMinutesFromRange = (timeRange: string) => {
    const startTime = timeRange.split(' to ')[0];
    return timeToMinutes(startTime);
  };

  const columns = [
    {
      header: 'Time',
      accessor: 'time',
    },
    {
      header: 'Work Name',
      accessor: 'perticular',
      render: (row) => (
        <span
          onClick={() => {
            if (row?.perticular === 'BREAK') return;

            if (row.project !== null) {
              navigate({to: `/company/proworkdetails/${row.workId}`});
            } else {
              navigate({to: `/company/dailyworkdetails/${row.workId}`});
            }
          }}
          className={`cursor-pointer ${
            row?.perticular === 'BREAK'
              ? 'text-gray-400 cursor-default'
              : 'text-[#0284C7] hover:underline'
          }`}
        >
          {row?.perticular !== 'BREAK' && row.perticular
            ? row.perticular
            : 'Break'}
        </span>
      ),
    },
    {header: 'Alloted Time', accessor: 'allotedTime'},
    {header: 'Work Hrs', accessor: 'workHrs'},
    {header: 'Priority', accessor: 'priority'},
    {header: 'Status', accessor: 'status'},
    {header: 'Review By', accessor: 'review'},
    {header: 'Review Note', accessor: 'reviewNote'},
  ];
  const getEndMinutesFromRange = (timeRange: string) => {
    const endTime = timeRange.split(' to ')[1];
    return timeToMinutes(endTime);
  };
  const formatDateKey = (isoDate: string) => {
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const extractTimeFromISO = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  const attendanceInTimeMap = useMemo(() => {
    if (!timeSheet?.attendance) return {};

    const map: Record<string, string> = {};

    timeSheet.attendance.forEach((att: any) => {
      if (att.date && att.inTime) {
        const dateKey = formatDateKey(att.date);
        map[dateKey] = extractTimeFromISO(att.inTime);
      }
    });

    return map;
  }, [timeSheet]);

  const groupedData = useMemo(() => {
    if (!timeSheet) return {};

    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0); // start of day

    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999); // end of day

    const filtered = timeSheet?.formattedData?.filter((each: any) => {
      const recordDate = parseDate(each.date);
      return recordDate >= from && recordDate <= to;
    });

    const grouped: any = {};

    filtered.forEach((record: any) => {
      if (!grouped[record.date]) grouped[record.date] = [];
      grouped[record.date].push(record);
    });

    Object.keys(grouped).forEach((date) => {
      const records = grouped[date];

      // sort by start time
      records.sort(
        (a: any, b: any) =>
          getStartMinutesFromRange(a.time) - getStartMinutesFromRange(b.time),
      );

      const finalRecords: any[] = [];

      const empInTime = attendanceInTimeMap[date] || '10:00 AM';
      const inTimeMinutes = timeToMinutes(empInTime);

      records.forEach((record: any, index: number) => {
        const startMinutes = getStartMinutesFromRange(record.time);

        if (index === 0 && startMinutes > inTimeMinutes) {
          finalRecords.push({
            time: `${empInTime} to ${record.time.split(' to ')[0]}`,

            perticular: '--',
            allotedTime: '--',
            workHrs: '--',
            priority: '--',
            status: '--',
            review: '--',
            reviewNote: '--',
            isDummy: true,
          });
        }

        const isBreak = record.perticular === 'BREAK';

        finalRecords.push(
          isBreak
            ? {
                ...record,
                perticular: 'BREAK',
                allotedTime: '--',
                workHrs: '--',
                priority: '--',
                status: '--',
                review: '--',
                reviewNote: '--',
                isBreak: true,
              }
            : record,
        );

        const nextRecord = records[index + 1];
        if (nextRecord) {
          const currentEnd = getEndMinutesFromRange(record.time);
          const nextStart = getStartMinutesFromRange(nextRecord.time);

          if (nextStart > currentEnd) {
            finalRecords.push({
              time: `${record.time.split(' to ')[1]} to ${nextRecord.time.split(' to ')[0]}`,
              perticular: '--',
              allotedTime: '--',
              workHrs: '--',
              priority: '--',
              status: '--',
              review: '--',
              reviewNote: '--',
              isDummy: true,
            });
          }
        }
      });

      grouped[date] = finalRecords;
    });

    return grouped;
  }, [timeSheet, fromDate, toDate]);

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <div>
          <label className="mb-1 block text-sm">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded border px-2 py-1"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded border px-2 py-1"
          />
        </div>
      </div>

      {Object.keys(groupedData).length === 0 && (
        <p className="text-gray-500">No records found</p>
      )}

      {Object.entries(groupedData).map(([date, records]: any) => (
        <div key={date} className="mb-4">
          <h2 className="text-lg font-semibold">📅 {date}</h2>

          <GenericNewTable data={records} columns={columns} rowsPerPage={40} />
        </div>
      ))}
    </div>
  );
};

export default TimeSheet;
