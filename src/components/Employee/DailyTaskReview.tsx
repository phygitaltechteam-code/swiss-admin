import {useDailyWorkReview} from '@/lib/react-query/WorkAssignByEmp';
import React from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {useNavigate} from '@tanstack/react-router';

const DailyTaskReview = () => {
  const navigate = useNavigate();
  const {data: allReview} = useDailyWorkReview();
  const [previewImg, setPreviewImg] = React.useState<string | null>(null);

  console.log('all review ....', allReview);
  const columns = [
    {
      header: 'Task Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span
          onClick={() => {
            navigate({to: `/employee/empdailyworkreview/${row.id}`});
          }}
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
      department: each?.department?.name,
      review: each?.review?.user?.fullname,
      dueDate: each?.dueDate,
      description: each?.description,
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

  console.log('all review', allReview);
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Daily Review Work List
      </h2>
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

export default DailyTaskReview;
