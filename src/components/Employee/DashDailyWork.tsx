import React, {useEffect, useMemo, useRef, useState} from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useEmployeeDailyWorkList} from '@/lib/api/employeeApi';
import {useNavigate} from '@tanstack/react-router';

interface Props {
  type: string;
  filterDate: string;
  endDate: string;
}

const taskTabs = ['All', 'Done', 'Review', 'Pending', 'Working', 'Reopen'];

const recurringColumns = {
  time: [{header: 'Submit Time', accessor: 'recurringTime', sortable: true}],
  day: [{header: 'Submit Day', accessor: 'recurringDay', sortable: true}],
  date: [{header: 'Submit Date', accessor: 'recurringDate', sortable: true}],
  due: [{header: 'Due Date', accessor: 'dueDate', sortable: true}],
};

const getRecurringColumn = (type: string) => {
  if (type === 'DAILY') return recurringColumns.time;
  if (type === 'WEEKLY') return recurringColumns.day;
  if (type === 'ALL')
    return [
      ...recurringColumns.date,
      ...recurringColumns.time,
      ...recurringColumns.day,
      ...recurringColumns.due,
    ];

  return recurringColumns.date;
};

const DashDailyWork: React.FC<Props> = ({type, filterDate, endDate}) => {
  const navigate = useNavigate();
  console.log('filterDate', filterDate);
  const {data: dailyWork = []} = useEmployeeDailyWorkList();
  const [taskFilter, setTaskFilter] = useState('All');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });
  const getWeekday = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {weekday: 'long'}).toLowerCase();
  };

  useEffect(() => {
    const index = taskTabs.indexOf(taskFilter);
    const currentTab = tabRefs.current[index];

    if (currentTab) {
      setIndicatorStyle({
        width: currentTab.offsetWidth,
        left: currentTab.offsetLeft,
      });
    }
  }, [taskFilter, taskTabs]);

  const selectedWeekday = getWeekday(filterDate);

  const baseColumns = [
    {
      header: 'Task Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span
          onClick={() => {
            navigate({to: `/employee/workdetail/${row.id}`});
          }}
          className="cursor-pointer text-[#0284C7] hover:underline"
        >
          {row.name}
        </span>
      ),
    },
    {header: 'Department', accessor: 'department'},
    {header: 'Assign To', accessor: 'assign'},
    {header: 'Assign By', accessor: 'assignBy'},
    {header: 'Review', accessor: 'review'},
    {header: 'Priority', accessor: 'priority'},
    {header: 'Status', accessor: 'status'},
    {header: 'Duration', accessor: 'recurringType'},
  ];

  const filtered = useMemo(() => {
    return dailyWork.filter((item: any) => {
      if (!type) return false;

      const status = item?.status?.toLowerCase();
      const due = item?.dueDate?.split('T')[0];
      const rec = item?.recurringDate?.split('T')[0];
      const created = item?.createdAt?.split('T')[0];

      const recurringType =
        item?.recurringType && item?.recurringType !== ''
          ? item.recurringType
          : 'OTHER';

      const validStatus =
        taskFilter === 'All'
          ? ['pending', 'complete', 'review', 'working', 'reopen'].includes(
              status,
            )
          : status === taskFilter.toLowerCase();

      if (!validStatus) return false;
      let typeMatch = false;
      if (recurringType === 'DAILY') {
        typeMatch = created >= filterDate && created <= endDate;
      } else if (recurringType === 'WEEKLY') {
        typeMatch = item.recurringDay?.toLowerCase() === selectedWeekday;
      } else if (
        ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY'].includes(
          recurringType,
        )
      ) {
        typeMatch = rec === filterDate;
      } else if (recurringType === 'OTHER') {
        typeMatch = due === filterDate;
      }

      if (type !== 'ALL' && type !== '') {
        if (recurringType !== type) return false;
      }

      return typeMatch;
    });
  }, [dailyWork, type, taskFilter, filterDate, endDate, selectedWeekday]);

  const formatedData = filtered
    .map((each: any) => ({
      id: each.id,
      name: each?.name,
      department: each?.department?.name,
      assign: each?.assign?.user?.fullname,
      assignBy: each?.assignedByEmployee?.user?.fullname || 'COMPANY',
      review: each?.review?.user?.fullname,
      priority: each?.priority,
      status: each?.status,
      recurringType: each?.recurringType,
      recurringDate: each?.recurringDate,
      recurringTime: each?.recurringTime,
      recurringDay: each?.recurringDay,
      dueDate: each?.dueDate,
    }))
    .sort((a: any, b: any) => b.recurringTime - a.recurringTime);
  const isTaskInSelectedDate = (item: any) => {
    const due = item?.dueDate?.split('T')[0];
    const rec = item?.recurringDate?.split('T')[0];
    const created = item?.createdAt?.split('T')[0];

    const recurringType =
      item?.recurringType && item?.recurringType !== ''
        ? item.recurringType
        : 'OTHER';

    if (recurringType === 'DAILY') {
      return created >= filterDate && created <= endDate;
    }

    if (recurringType === 'WEEKLY') {
      return item.recurringDay?.toLowerCase() === selectedWeekday;
    }

    if (
      ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY'].includes(recurringType)
    ) {
      return rec === filterDate;
    }

    return due === filterDate;
  };
  const finalColumns = [...baseColumns, ...getRecurringColumn(type)];
  const tabCounts = taskTabs.reduce(
    (acc, tab) => {
      const tabKey = tab.toLowerCase();

      const count = dailyWork.filter((item: any) => {
        const status = item?.status?.toLowerCase();

        const validStatus =
          tab === 'All'
            ? ['pending', 'complete', 'review', 'working', 'reopen'].includes(
                status,
              )
            : status === tabKey;

        if (!validStatus) return false;
        return isTaskInSelectedDate(item);
      }).length;

      acc[tab] = count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="bg-white pt-2 dark:bg-boxdark">
      <div className="relative border-b border-stroke dark:border-neutral-500">
        <div className="relative flex items-center gap-3 overflow-x-auto whitespace-nowrap py-3">
          {taskTabs.map((tab, index) => (
            <button
              key={tab}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => setTaskFilter(tab)}
              className={`px-2 py-1 text-sm font-medium transition-all ${
                taskFilter === tab
                  ? 'text-[#0284C7]'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {tab} {tabCounts[tab] > 0 && ` (${tabCounts[tab]})`}
            </button>
          ))}

          <div
            className="absolute bottom-0 h-[2px] bg-[#0284C7] transition-all duration-150 ease-out"
            style={{
              width: indicatorStyle.width,
              left: indicatorStyle.left,
            }}
          />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Work List
      </h2>

      <GenericNewTable data={formatedData} columns={finalColumns} />
    </div>
  );
};

export default DashDailyWork;
