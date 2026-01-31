import {useEmployeeWorkList} from '@/lib/api/employeeApi';
import {
  AlertTriangle,
  CalendarCheck2,
  CheckCircle2,
  Edit,
  Hourglass,
  Trash,
} from 'lucide-react';
import React from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useNavigate} from '@tanstack/react-router';
import {useAppContext} from '../common/PopUp';
import {useGetEmpDashd} from '@/lib/react-query/project';

type props = {
  empid: string;
  projectId: string;
};

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
const employeeColumns = [
  {header: 'Name', accessor: 'name'},
  {header: 'Description', accessor: 'description'},
  {header: 'Assigned To', accessor: 'assignTo'},
  {header: 'Review By', accessor: 'reviewBy'},
  {header: 'Status', accessor: 'status'},
  {header: 'Priority', accessor: 'priority'},
  {header: 'Due Date', accessor: 'dueDate'},
  {header: 'Created Time', accessor: 'createdAt'},
];
const EmpAllWork: React.FC<props> = ({empid, projectId}) => {
  const {data: empWork} = useEmployeeWorkList(projectId, empid);
  const {data: empInfo} = useGetEmpDashd(projectId, empid);
  const {setProjectWork} = useAppContext();
  const navigate = useNavigate();

  const foramated = empWork?.map((each) => ({
    id: each.id,
    name: each.name,
    description: each.description,
    assignTo: each?.assign?.user?.fullname,
    reviewBy: each?.review?.user?.fullname,
    status: each.status,
    priority: each?.priority,
    dueDate: each?.dueDate,
    createdAt: each?.createdAt,
  }));
  const onEdit = (row: EmpRow) => {
    navigate({
      to: '/work/CreateWork',
      state: {work_id: row.id},
    });
    setProjectWork(true);
  };
  console.log('empwork', empWork);
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
                  <p className="text-gray-800 text-2xl font-bold">
                    {empInfo?.employeeWorkCount}
                  </p>
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
                  <p className="text-gray-800 text-2xl font-bold">
                    {empInfo?.ontimeCount}
                  </p>
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
                  <p className="text-gray-800 text-2xl font-bold">
                    {empInfo?.lateCount}
                  </p>
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
                  <p className="text-gray-800 text-2xl font-bold">
                    {empInfo?.notDone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{' '}
      <GenericNewTable
        columns={employeeColumns}
        data={foramated}
        onEdit={(emp) => onEdit(emp)}
        onDelete={(emp) => console.log('Delete employee', emp)}
      />
    </div>
  );
};

export default EmpAllWork;
