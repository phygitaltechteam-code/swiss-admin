import React from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useNavigate} from '@tanstack/react-router';
//import { useEmployeeDailyWorkList } from '@/lib/react-query/AssignEmployee';
import {useAuthContext} from '@/context/AuthContext';
import {
  useEmployeeDailyWork,
  useEmployeeDailyWorkList,
} from '@/lib/api/employeeApi';
//import { Route } from '@/routes/_app/employee/dailytask.$id';

type props = {
  id: string;
};
const DailyTask: React.FC<props> = ({id}) => {
  //console.log('Id',id);
  const navigate = useNavigate();
  //const { id } = Route.useParams();

  // const { user } = useAuthContext();
  //const employeeId = user?.id;

  const {data: allReview, isLoading, isError} = useEmployeeDailyWork(id);
  console.log('ALL REVIEW AFTER LOADING:', allReview);

  const [previewImg, setPreviewImg] = React.useState<string | null>(null);

  if (isLoading) return <p className="p-4">Loading tasks...</p>;
  if (isError) return <p className="p-4">Failed to load tasks</p>;
  //console.log('ALL REVIEW AFTER LOADING:', allReview);

  /*const filteredReview =
    allReview?.filter(
      (each: any) =>
        each.assign?.user?.email === user?.email
    ) || [];*/

  const columns = [
    {
      header: 'Task Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span
          onClick={() => navigate({to: `/company/dailyworkdetails/${row.id}`})}
          className="cursor-pointer text-[#0284C7] hover:underline"
        >
          {row.name}
        </span>
      ),
    },
    {header: 'Task Description', accessor: 'description'},
    {header: 'Assign To', accessor: 'assignedTo'},
    {header: 'Assign By', accessor: 'assignedBy'},
    {header: 'Review', accessor: 'review'},
    {header: 'DueDate', accessor: 'dueDate'},
    {header: 'Priority', accessor: 'priority'},
    {header: 'Status', accessor: 'status'},
  ];

  const formatedData =
    allReview?.map((each: any) => ({
      id: each.id,
      name: each?.name,
      description: each?.description,
      review: each?.review?.user?.fullname,
      dueDate: each?.dueDate,
      assignedTo: each?.assign?.user?.fullname,
      assignedBy: each?.assign?.user?.fullname,
      priority: each?.priority,
      status: each?.status,
      recurringType: each?.recurringType,
      recurringDate: each?.recurringDate,
      recurringTime: each?.recurringTime,
      recurringDay: each?.recurringDay,
      assignedDocuments: each?.assignedDocuments || [],
    })) || [];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Daily Work List
      </h2>

      {/* Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            className="max-h-[95vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <GenericNewTable data={formatedData} columns={columns} />
    </div>
  );
};

export default DailyTask;
