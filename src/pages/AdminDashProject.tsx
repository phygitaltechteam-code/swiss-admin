import React, {useEffect, useRef, useState} from 'react';

import {useNavigate} from '@tanstack/react-router';

import GenericNewTable from '@/components/Forms/Table/GenericNewTable';
import {useGetProjectWorkById} from '@/lib/react-query/projectWork';
import {useGetAllProject} from '@/lib/react-query/project';

interface Props {
  projectId: string;
  startDate: string;
  endDate: string;
}

const taskTabs = ['All', 'Complete', 'Review', 'Pending', 'Working', 'Reopen'];

const AdminDashProject: React.FC<Props> = ({projectId, startDate, endDate}) => {
  console.log('start date', startDate);
  console.log('end date', endDate);

  const [taskFilter, setTaskFilter] = useState('All');
  const [localWorkData, setLocalWorkData] = useState<any[]>([]);
  const navigate = useNavigate();
  const {refetch} = useGetProjectWorkById(projectId, {enabled: false});
  const {data: allProjectWork} = useGetAllProject();
  console.log('project work dash', allProjectWork);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });

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

  useEffect(() => {
    if (projectId) {
      refetch().then((res) => {
        console.log('all pro ', res);
        setLocalWorkData(res.data || []);
      });
    } else {
      setLocalWorkData(allProjectWork || []);
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
            navigate({to: `/company/proworkdetails/${row.id}`});
          }}
          className="cursor-pointer text-[#0284C7] hover:underline"
        >
          {row.name}
        </span>
      ),
    },
    {header: 'Description', accessor: 'description'},
    {header: 'Department', accessor: 'department'},
    {header: 'Project', accessor: 'project'},
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
      if (taskFilter === 'Ongoing') return status === 'ongoing';
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

  console.log('filter data', filtered);
  const formatedData =
    filtered?.map((each: any) => ({
      id: each.id,
      name: each?.name,
      department: each?.department?.name,
      review: each?.review?.fullname,
      description: each?.description,
      assignedTo: each?.assign?.fullname,
      assignedBy: each?.assignedByEmployee?.user?.fullname || 'COMPANY',
      priority: each?.priority,
      status: each?.status,
      recurringType: each?.recurringType,
      recurringDate: each?.recurringDate,
      recurringTime: each?.recurringTime,
      recurringDay: each?.recurringDay,
      dueDate: each?.dueDate,
      project: each?.project?.name,
    })) || [];

  console.log('project id....', projectId);
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
              <span>{tab}</span>
              <span className="bg-gray-200 text-gray-700 rounded-full px-1.5 text-xs">
                {statusCounts[tab] > 0 && ` (${statusCounts[tab]})`}
              </span>
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
        Employee List
      </h2>

      <GenericNewTable data={formatedData} columns={baseColumns} />
    </div>
  );
};

export default AdminDashProject;
