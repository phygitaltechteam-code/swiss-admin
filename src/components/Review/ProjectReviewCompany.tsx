import {useProjectWorkReviewCompany} from '@/lib/react-query/WorkAssignByEmp';
import React, {useState} from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useNavigate} from '@tanstack/react-router';
import {useGetProject} from '@/lib/react-query/project';

const ProjectReviewCompany = () => {
  const navigate = useNavigate();
  const {data: projectWork} = useProjectWorkReviewCompany();
  const [selectedProject, setSelectedProject] = useState('');
  const {data: allProject} = useGetProject();
  console.log('all review ....', projectWork);
  const columns = [
    {
      header: 'Task Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span
          onClick={() => {
            navigate({to: `/company/projectreview/${row.id}`});
          }}
          className="cursor-pointer text-[#0284C7] hover:underline"
        >
          {row.name}
        </span>
      ),
    },

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
      projectId: each?.projectId,
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

  const filteredData = selectedProject
    ? formatedData.filter((item) => item.projectId === selectedProject)
    : formatedData;

  console.log('all review', projectWork);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        {' '}
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Project Review Work List
        </h2>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-[200px] rounded border-[1.7px] border-stroke bg-transparent px-3 py-1.5 text-black outline-none transition focus:border-primary dark:border-neutral-500 dark:text-white"
        >
          {' '}
          <option>Select Project</option>
          {allProject?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <GenericNewTable data={filteredData} columns={columns} />
    </div>
  );
};

export default ProjectReviewCompany;
