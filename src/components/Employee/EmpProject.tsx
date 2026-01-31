import React, {useEffect, useState} from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useNavigate} from '@tanstack/react-router';
import {useAppContext} from '../common/PopUp';
import {useGetProject} from '@/lib/react-query/project';
import {useGetEmpProject} from '@/lib/api/employeeApi';

type ProjectRow = {
  id: string;
  name: string;
  priority: string;
  startDate: string;
  endDate: string;
};
const EmpProject = () => {
  const navigate = useNavigate();
  const {setSelectedProjectId} = useAppContext();
  const [sortedProjects, setSortedProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const {data: allProject} = useGetEmpProject();
  const columns: ProjectRow = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span
          onClick={() => {
            navigate({to: `/employee/empprojectdetails/${row.id}`});
            setSelectedProjectId(row.id);
          }}
          className="cursor-pointer text-[#0284C7] hover:underline"
        >
          {row.name}
        </span>
      ),
    },

    {header: 'Priority', accessor: 'priority'},
    {header: 'Duration', accessor: 'duration'},
    {
      header: 'Heads',
      accessor: 'headsNames',
    },
    {header: 'Created At', accessor: 'createdAt'},
    {header: 'Status', accessor: 'status'},
  ];
  const formatedData =
    allProject?.map((each: any) => {
      const formattedStart = new Date(each?.startDate).toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        },
      );

      const formattedEnd = new Date(each?.endDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      return {
        id: each.id,
        name: each?.name,
        priority: each?.priority,
        status: each.status,
        createdAt: each.createdAt,
        rawStartDate: each?.startDate,
        rawEndDate: each?.endDate,

        startDate: formattedStart,
        endDate: formattedEnd,
        headsNames: each?.heads?.map((h: any) => h.fullname).join(', ') || '-',
        duration: `${formattedStart} - ${formattedEnd}`,
      };
    }) || [];

  useEffect(() => {
    if (formatedData.length) {
      const priorityOrder: Record<string, number> = {
        high: 3,
        medium: 2,
        low: 1,
      };

      const sorted = [...formatedData].sort((a, b) => {
        // 1️⃣ Sort by end date first (earliest first)
        const endDateDiff =
          new Date(a.rawEndDate).getTime() - new Date(b.rawEndDate).getTime();

        // 2️⃣ If same end date, sort by priority (High → Medium → Low)
        if (endDateDiff === 0) {
          const aPriority = a.priority?.trim().toLowerCase();
          const bPriority = b.priority?.trim().toLowerCase();
          return (
            (priorityOrder[bPriority] || 0) - (priorityOrder[aPriority] || 0)
          );
        }

        return endDateDiff;
      });

      setSortedProjects(sorted);
    }
  }, [formatedData, allProject]);

  return (
    <div className="mt-10 bg-white px-4 pt-2 dark:bg-boxdark">
      {' '}
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Project List
      </h2>
      <GenericNewTable
        data={
          statusFilter
            ? sortedProjects.filter(
                (project: any) => project.status === statusFilter,
              )
            : sortedProjects
        }
        columns={columns}
      />
    </div>
  );
};

export default EmpProject;
