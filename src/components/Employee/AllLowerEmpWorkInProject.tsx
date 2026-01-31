import {useGetProjectLowerEmpWork} from '@/lib/react-query/empProject';
import React from 'react';
import {Route} from '@/routes/_app/employee/empprojectdetails.$id';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useAppContext} from '../common/PopUp';
import {useNavigate} from '@tanstack/react-router';
import {AuthContext, useAuthContext} from '@/context/AuthContext';
import {Plus} from 'lucide-react';
const employeeColumns = [
  {header: 'Name', accessor: 'name'},
  {header: 'Description', accessor: 'description'},
  {header: 'Assigned To', accessor: 'assignTo'},
  {header: 'Assigned By', accessor: 'assignedBy'},
  {header: 'Review By', accessor: 'reviewBy'},
  {header: 'Status', accessor: 'status'},
  {header: 'Priority', accessor: 'priority'},
  {header: 'Due Date', accessor: 'dueDate'},
  {header: 'Created Time', accessor: 'createdAt'},
];

type EmpRow = {
  id: string;
  name: string;
  employee: string;
  dueDate: string;
  priority: string;
  status: string;
  assignTo: string;
  reviewBy: string;
  description: string;
};
const AllLowerEmpWorkInProject = () => {
  const {user} = useAuthContext();
  const {id} = Route.useParams();
  const {data: workData} = useGetProjectLowerEmpWork(id);

  const {
    setProjectWork,
    setEmpProjectWork,
    setSelectedDepartmentId,
    setSelectedProjectId,
  } = useAppContext();
  const navigate = useNavigate();
  const foramated = workData?.map((each) => ({
    id: each.id,
    name: each.name,
    description: each.description,
    assignTo: each?.assign?.user?.fullname,
    reviewBy: each?.review?.user?.fullname,
    assignedById: each?.assignedBy || null,
    status: each.status,
    priority: each?.priority,
    dueDate: each?.dueDate,
    createdAt: each?.createdAt,
    assignedBy: each?.assignedByEmployee?.user?.fullname || 'ADMIN',
    canEdit: each?.assignedBy === user?.employeeId,
  }));
  console.log('formateddd', foramated);

  const onEdit = (row: EmpRow) => {
    navigate({
      to: '/employee/empprojectwork',
      state: {emp_work_id: row.id},
    });
    setEmpProjectWork(true);
  };

  return (
    <div className="p-2">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEmpProjectWork(true);
            setSelectedDepartmentId(user?.departmentId);
            setSelectedProjectId(id);
          }}
          className="flex items-center gap-2 rounded-lg border border-[#0284C7] px-3 py-2 text-sm font-medium text-white shadow-md transition-all"
          style={{color: '#0284C7'}}
        >
          <Plus className="h-4 w-4" />
          Add New Work
        </button>
      </div>

      <GenericNewTable
        columns={employeeColumns}
        data={foramated}
        onEdit={(row) => {
          if (row?.canEdit) {
            onEdit(row);
          }
        }}
        onDelete={(row) => {
          if (row?.canEdit) {
            console.log('delete', row.canEdit);
          }
        }}
      />
    </div>
  );
};

export default AllLowerEmpWorkInProject;
