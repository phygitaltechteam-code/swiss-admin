import React from 'react';
import GenericNewTable from '../Forms/Table/GenericNewTable';

export interface HistoryProps {
  id: string;
  dailyWorkId: string;
  assignedTo: string;
  companyId: string;
  projectId: string | null;
  projectWorkId: string | null;
  name: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  changedAt: string;
  reviewBy: string | null;
  reviewComment: string | null;
  employee: {
    id: string;
    userId: string;
    role: string;
    seniority: boolean;
    companyId: string;
  };
}

interface EmpDailyWorkHistoryProps {
  data: HistoryProps[];
}

const EmpDailyWorkHistory: React.FC<EmpDailyWorkHistoryProps> = ({data}) => {
  console.log('daily hstory', data);
  const [previewImg, setPreviewImg] = React.useState<string | null>(null);

  const columns = [
    {header: 'Updated On', accessor: 'changedAt'},
    {header: 'Status', accessor: 'status'},
    {header: 'Assigned To', accessor: 'assignedTo'},
    {header: 'Review By', accessor: 'review'},
    {header: 'Note', accessor: 'note'},
    {header: 'Review Comment', accessor: 'reviewComment'},
    {
      header: 'Submitted Documents',
      accessor: 'submittedDocuments',
      render: (row) => (
        <div className="flex max-w-[260px] gap-3 overflow-x-auto">
          {row?.submittedDocuments?.map((file, index) => {
            const url = file.document;
            const ext = url.split('.').pop().toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
            const isPdf = ext === 'pdf';
            const isExcel = ['xlsx', 'xls', 'csv'].includes(ext);

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Image Thumbnail */}
                {isImage && (
                  <img
                    src={url}
                    className="h-12 w-12 cursor-pointer rounded-md border object-cover"
                    onClick={() => setPreviewImg(url)}
                  />
                )}

                {/* PDF Thumbnail */}
                {isPdf && (
                  <div
                    className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-md border border-stroke text-red-600 shadow"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <span className="text-[10px] font-semibold">PDF</span>
                    <span className="text-[8px] underline">open</span>
                  </div>
                )}

                {isExcel && (
                  <div
                    className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-md border bg-green-100 text-green-700 shadow"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <span className="text-[10px] font-semibold">Excel</span>
                    <span className="text-[8px] underline">open</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ),
    },
  ];
  const formatedData =
    data?.map((each: any) => ({
      id: each.id,
      name: each?.name,
      note: each?.note,
      review: each?.review?.user?.fullname,
      description: each?.description,
      assignedTo: each?.employee?.user?.fullname,
      assignedBy: each?.assignByemploee?.user?.fullname || 'COMPANY',
      priority: each?.priority,
      status: each?.status,
      reviewComment: each?.reviewComment,
      recurringType: each?.recurringType,
      recurringDate: each?.recurringDate,
      recurringTime: each?.recurringTime,
      recurringDay: each?.recurringDay,
      dueDate: each?.dueDate,
      changedAt: each?.changedAt,
      submittedDocuments: each?.submittedDocuments,
    })) || [];
  return (
    <div className="bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Work History
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

export default EmpDailyWorkHistory;
