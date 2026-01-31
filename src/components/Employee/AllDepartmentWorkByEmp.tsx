import {useGetDepartmentWork} from '@/lib/react-query/projectWork';
import React from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {
  AlertTriangle,
  CalendarCheck2,
  CheckCircle2,
  Hourglass,
} from 'lucide-react';
import {useAppContext} from '../common/PopUp';
import {useNavigate} from '@tanstack/react-router';
import {useDepartmentWorkList} from '@/lib/api/employeeApi';
import {useProDepartmentWorkByEmp} from '@/lib/react-query/empProject';

type props = {
  departmentId: string;
  projectId: string;
};

const deptColumns = [
  {header: 'Name', accessor: 'name'},
  {header: 'Description', accessor: 'description'},
  {header: 'Assigned To', accessor: 'assignTo'},
  {header: 'Assigned By', accessor: 'assignBy'},
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
const AllDepartmentWorkByEmp: React.FC<props> = ({departmentId, projectId}) => {
  const {setEmpProjectWork, setSelectedDepartmentId} = useAppContext();
  const navigate = useNavigate();

  const onEdit = (row: EmpRow) => {
    setSelectedDepartmentId(departmentId);
    navigate({
      to: '/employee/empprojectwork',
      state: {emp_work_id: row.id},
    });
    setEmpProjectWork(true);
  };
  const {data: workData} = useProDepartmentWorkByEmp(projectId, departmentId);
  console.log('departmen works', workData);

  const foramated = workData?.map((each) => ({
    id: each.id,
    name: each.name,
    description: each.description,
    assignTo: each?.assign?.user?.fullname,
    assignBy: each?.assignedByEmployee?.user?.fullname || 'COMPANY',
    reviewBy: each?.review?.user?.fullname,
    status: each.status,
    priority: each?.priority,
    dueDate: each?.dueDate,
    createdAt: each?.createdAt,
  }));
  console.log('depart works', workData);
  return (
    <div className="mt-4 px-6">
      <div className="from-gray-50 to-gray-100 mb-6 mt-1 bg-gradient-to-br">
        <div className="">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="min-w-[200px] flex-1 rounded-lg bg-white px-4 py-2 shadow-md">
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg bg-blue-500 bg-opacity-10 p-2`}>
                  <span className="text-xl">
                    <CheckCircle2 />{' '}
                  </span>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Total Work</h3>
                  <p className="text-gray-800 text-2xl font-bold">120</p>
                </div>
              </div>
            </div>

            <div className="min-w-[200px] flex-1 rounded-lg bg-white px-4 py-2 shadow-md">
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg bg-green-500 bg-opacity-10 p-2`}>
                  <span className="text-xl">
                    <CalendarCheck2 />{' '}
                  </span>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">In Time</h3>
                  <p className="text-gray-800 text-2xl font-bold">120</p>
                </div>
              </div>
            </div>
            <div className="min-w-[200px] flex-1 rounded-lg bg-white px-4 py-2 shadow-md">
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg bg-yellow-500 bg-opacity-10 p-2`}>
                  <span className="text-xl">
                    <AlertTriangle />{' '}
                  </span>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Delay</h3>
                  <p className="text-gray-800 text-2xl font-bold">120</p>
                </div>
              </div>
            </div>

            <div className="min-w-[200px] flex-1 rounded-lg bg-white px-4 py-2 shadow-md">
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg bg-red-500 bg-opacity-10 p-2`}>
                  <span className="text-xl">
                    <Hourglass />{' '}
                  </span>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Not Completed</h3>
                  <p className="text-gray-800 text-2xl font-bold">120</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{' '}
      <GenericNewTable
        columns={deptColumns}
        data={foramated}
        onEdit={(emp) => onEdit(emp)}
        onDelete={(emp) => console.log('Delete employee', emp)}
      />
    </div>
  );
};

export default AllDepartmentWorkByEmp;
