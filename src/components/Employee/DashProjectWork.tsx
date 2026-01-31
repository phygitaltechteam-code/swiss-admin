import React, {useEffect, useState} from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useNavigate} from '@tanstack/react-router';
import {
  useAllProjectWorkEmpDash,
  useEmployeeAllProWork,
} from '@/lib/api/employeeApi';
import {useAuthContext} from '@/context/AuthContext';

interface Props {
  projectId: string;
  startDate: string;
  endDate: string;
}

const taskTabs = ['All', 'Complete', 'Review', 'Pending', 'Working', 'Reopen'];

const DashProjectWork: React.FC<Props> = ({projectId, startDate, endDate}) => {
  const {user} = useAuthContext();
  const [taskFilter, setTaskFilter] = useState('All');
  const [localWorkData, setLocalWorkData] = useState<any[]>([]);
  const navigate = useNavigate();
  const {data: allProjectWork} = useEmployeeAllProWork();
  const {refetch} = useAllProjectWorkEmpDash(projectId, {enabled: false});
  const activeData = projectId ? localWorkData : allProjectWork || [];

  useEffect(() => {
    if (projectId) {
      refetch().then((res) => {
        setLocalWorkData(res.data || []);
      });
    } else {
      setLocalWorkData([]);
    }
  }, [projectId]);

  console.log('projectWork', localWorkData);

  const baseColumns = [
    {
      header: 'Task Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span
          onClick={() => {
            navigate({to: `/employee/projectworkdetailspage/${row.id}`});
          }}
          className="cursor-pointer text-[#0284C7] hover:underline"
        >
          {row.name}
        </span>
      ),
    },
    {header: 'Description', accessor: 'description'},
    {header: 'Department', accessor: 'department'},
    {header: 'Assigned To', accessor: 'assignedTo'},
    {header: 'Assigned By', accessor: 'assignedBy'},
    {header: 'Review', accessor: 'review'},
    {header: 'DueDate', accessor: 'dueDate'},
    {header: 'Priority', accessor: 'priority'},
    {header: 'Status', accessor: 'status'},
  ];

  const dateFilteredData = React.useMemo(() => {
    if (!startDate || !endDate) return localWorkData;

    const startObj = new Date(startDate);
    const endObj = new Date(endDate);

    return localWorkData?.filter((item: any) => {
      if (!item?.dueDate) return false;

      const dueDateObj = new Date(item.dueDate.split('T')[0]);
      return dueDateObj >= startObj && dueDateObj <= endObj;
    });
  }, [localWorkData, startDate, endDate]);

  const filtered = React.useMemo(() => {
    return dateFilteredData?.filter((item: any) => {
      const status = item?.status?.toLowerCase();

      if (taskFilter === 'All') return true;
      if (taskFilter === 'Pending') return status === 'pending';
      if (taskFilter === 'Complete') return status === 'complete';
      if (taskFilter === 'Review') return status === 'review';
      if (taskFilter === 'Working') return status === 'working';
      if (taskFilter === 'Reopen') return status === 'reopen';

      return true;
    });
  }, [dateFilteredData, taskFilter]);

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      All: 0,
      Complete: 0,
      Review: 0,
      Pending: 0,
      Working: 0,
      Reopen: 0,
    };

    dateFilteredData?.forEach((item: any) => {
      const status = item?.status?.toLowerCase();
      if (!status) return;

      counts.All++;
      if (status === 'complete') counts.Complete++;
      if (status === 'review') counts.Review++;
      if (status === 'pending') counts.Pending++;
      if (status === 'working') counts.Working++;
      if (status === 'reopen') counts.Reopen++;
    });

    return counts;
  }, [dateFilteredData]);

  console.log('filteredddd', filtered);
  const formatedData =
    filtered?.map((each: any) => ({
      id: each.id,
      name: each?.name,
      department: each?.department?.name,
      review: each?.review?.user?.fullname,
      description: each?.description,
      assignedTo: each?.assign?.user?.fullname,
      assignedBy: each?.assignedByEmployee?.user?.fullname || 'COMPANY',
      priority: each?.priority,
      status: each?.status,
      recurringType: each?.recurringType,
      recurringDate: each?.recurringDate,
      recurringTime: each?.recurringTime,
      recurringDay: each?.recurringDay,
      dueDate: each?.dueDate,
    })) || [];

  console.log('project id....', projectId);
  return (
    <div className="bg-white pt-2 dark:bg-boxdark">
      <div className="relative border-b border-stroke dark:border-neutral-500">
        <div className="relative flex items-center gap-3 overflow-x-auto whitespace-nowrap py-3">
          {taskTabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setTaskFilter(tab)}
              className={`px-2 py-1 text-sm font-medium transition-all ${
                taskFilter === tab
                  ? 'text-[#0284C7]'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {tab}

              {statusCounts[tab] > 0 && ` (${statusCounts[tab]})`}
            </button>
          ))}

          <div
            className="absolute bottom-0 h-[2px] bg-[#0284C7] transition-all duration-300"
            style={{
              width: `${taskTabs.find((t) => t === taskFilter)?.length * 8}px`,
              left: `${taskTabs
                .slice(0, taskTabs.indexOf(taskFilter))
                .map((t) => t.length * 8 + 24)
                .reduce((a, b) => a + b, 0)}px`,
            }}
          />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Work List
      </h2>

      <GenericNewTable data={formatedData} columns={baseColumns} />
    </div>
  );
};

export default DashProjectWork;
