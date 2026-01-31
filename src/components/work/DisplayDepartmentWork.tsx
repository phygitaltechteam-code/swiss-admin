import {
  useDeleteProjectWork,
  useGetDepartmentWork,
} from '@/lib/react-query/projectWork';
import React from 'react';
import {useAppContext} from '../common/PopUp';
import GenericTable, {Column} from '../Forms/Table/GenericTable';
import {useNavigate, useRouterState} from '@tanstack/react-router';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {minutesToHours} from '@/lib/Methods';

type EmpRow = {
  id: string;
  name: string;
  employee: string;
  dueDate: string;
  priority: string;
  status: string;
};

const columns: Column<EmpRow>[] = [
  {header: 'Name', accessor: 'name', sortable: true},
  {header: 'Description', accessor: 'description'},
  {header: 'Assigned To', accessor: 'employee'},
  {header: 'Due Date', accessor: 'dueDate'},
  {header: 'Priority', accessor: 'priority'},
  {header: 'Status', accessor: 'status'},

  {header: 'Review by', accessor: 'review'},
  {header: 'Created At', accessor: 'createdAt'},
  {header: 'Allotted Hours', accessor: 'minutes'},
];
const DisplayDepartmentWork = () => {
  const {setProjectWork} = useAppContext();
  const routerState = useRouterState();
  const departmentId = routerState?.location?.state?.departmentId;
  const projectId = routerState?.location?.state?.projectId;
  const navigate = useNavigate();
  const {data: workData} = useGetDepartmentWork(departmentId, projectId);
  console.log('work data', workData);
  const {mutateAsync: deleteWork} = useDeleteProjectWork();

  const formatedData =
    workData?.map((each: any) => ({
      id: each.id,
      employee: each?.assign?.user?.fullname,
      name: each?.name,
      dueDate: each?.dueDate?.split('T')[0],
      priority: each?.priority,
      status: each?.status,
      description: each?.description,
      review: each?.review?.user?.fullname,
      createdAt: each?.createdAt.split('T')[0],
      minutes: minutesToHours(each?.minutes) || '0',
    })) || [];

  const onEdit = (row: EmpRow) => {
    navigate({
      to: '/work/CreateWork',
      state: {work_id: row.id},
    });
    setProjectWork(true);
  };
  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this work?');
    if (confirmed) await deleteWork(id);
  };
  return (
    <div className="mt-7 bg-white px-4 pt-2">
      {' '}
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Work List
      </h2>
      <GenericNewTable
        data={formatedData}
        columns={columns}
        onDelete={(row) => handleDelete(row.id)}
        onEdit={(row) => onEdit(row)}
      />
    </div>
  );
};

export default DisplayDepartmentWork;
