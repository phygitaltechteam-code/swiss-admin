import {
  useDeleteProjectWork,
  useGetDepartmentWork,
} from '@/lib/react-query/projectWork';
import React from 'react';
import {useAppContext} from '../common/PopUp';
import GenericTable, {Column} from '../Forms/Table/GenericTable';
import {useNavigate, useRouterState} from '@tanstack/react-router';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useProDepartmentWorkByEmp} from '@/lib/react-query/empProject';

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
  {header: 'Assigned To', accessor: 'employee'},
  {header: 'Due Date', accessor: 'dueDate'},
  {header: 'Priority', accessor: 'priority'},
  {header: 'Status', accessor: 'status'},
];
const EmpProDepartmentAllWork = () => {
  const {setEmpProjectWork} = useAppContext();
  const routerState = useRouterState();
  const departmentId = routerState?.location?.state?.departmentId;
  const projectId = routerState?.location?.state?.projectId;
  const navigate = useNavigate();
  const {data: workData} = useProDepartmentWorkByEmp(projectId, departmentId);
  console.log('work data', workData);
  //   const {mutateAsync: deleteWork} = useDeleteProjectWork();

  const formatedData =
    workData?.map((each: any) => ({
      id: each.id,
      employee: each?.assign?.user?.fullname,
      name: each?.name,
      dueDate: each?.dueDate?.split('T')[0],
      priority: each?.priority,
      status: each?.status,
    })) || [];

  const onEdit = (row: EmpRow) => {
    navigate({
      to: '/employee/empprojectwork',
      state: {emp_work_id: row.id},
    });
    setEmpProjectWork(true);
  };
  //   const handleDelete = async (id: string) => {
  //     const confirmed = confirm('Are you sure you want to delete this work?');
  //     if (confirmed) await deleteWork(id);
  //   };
  return (
    <div className="mt-7 bg-white px-4 pt-2">
      {' '}
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Work List
      </h2>
      <GenericNewTable
        data={formatedData}
        columns={columns}
        // onDelete={(row) => handleDelete(row.id)}
        onEdit={(row) => onEdit(row)}
      />
    </div>
  );
};

export default EmpProDepartmentAllWork;
