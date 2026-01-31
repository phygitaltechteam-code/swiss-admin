import {useProjectWorkReview} from '@/lib/react-query/WorkAssignByEmp';

import React from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useNavigate} from '@tanstack/react-router';

const ProjectTaskReview = () => {
  const navigate = useNavigate();
  const {data: projectWork} = useProjectWorkReview();
  console.log('all review ....', projectWork);
  const columns = [
    {
      header: 'Task Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span
          onClick={() => {
            navigate({to: `/employee/projectworkreview/${row.id}`});
          }}
          className="cursor-pointer text-[#0284C7] hover:underline"
        >
          {row.name}
        </span>
      ),
    },
    {header: 'Task Description', accessor: 'description'},
    {header: 'Project', accessor: 'project'},
    {header: 'Project Description', accessor: 'projectDesc'},
    {header: 'Assign To', accessor: 'assignTo'},
    {header: 'Assign By', accessor: 'assignBy'},
    {header: 'Review', accessor: 'review'},
    {header: 'DueDate', accessor: 'dueDate'},
    {header: 'Priority', accessor: 'priority'},
    {header: 'Status', accessor: 'status'},
  ];

  const formatedData =
    projectWork?.map((each: any) => ({
      id: each.id,
      name: each?.name,
      department: each?.department?.name,
      assignTo: each?.assign?.user?.fullname,
      assignBy: each?.assignedByEmployee?.user?.fullname || 'COMPANY',
      review: each?.review?.user?.fullname,
      dueDate: each?.dueDate,
      project: each?.project?.name,
      projectDesc: each?.project?.description,

      description: each?.description,
      assignedTo: each?.assign?.user?.fullname,
      assignedBy: each?.assign?.user?.fullname,
      priority: each?.priority,
      status: each?.status,
      recurringType: each?.recurringType,
      recurringDate: each?.recurringDate,
      recurringTime: each?.recurringTime,
      recurringDay: each?.recurringDay,
    })) || [];

  console.log('all review', projectWork);
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Project Review Work List
      </h2>
      <GenericNewTable data={formatedData} columns={columns} />
    </div>
  );
};

export default ProjectTaskReview;
