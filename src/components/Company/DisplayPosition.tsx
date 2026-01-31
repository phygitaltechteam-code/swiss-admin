import {useAppContext} from '@/components/common/PopUp';
import {
  useDeleteDepartmentPositions,
  useGetDepartmentPositions,
  useUpdateDepartmentPositions,
} from '@/lib/react-query/departmentPositions';
import {useNavigate} from '@tanstack/react-router';
import React, {useEffect, useState} from 'react';

import GenericNewTable from '../Forms/Table/GenericNewTable';

export type roomCategory = {
  id: string;
  name: string;
};

export type rowData = {
  id: string;
  name: string;
  seniority: number;
};

const columns: rowData = [
  {header: 'Name', accessor: 'name', sortable: true},
  {header: 'Seniority', accessor: 'seniority', sortable: true},
];
const DisplayPosition = () => {
  const {data: allPositions, isLoading} = useGetDepartmentPositions();
  const [asendingPosition, setAsendingPosition] = useState();
  const {mutateAsync: updatePosition} = useUpdateDepartmentPositions();
  const {mutateAsync: deletePosition} = useDeleteDepartmentPositions();

  const {positionList, setPositionList, setPosition} = useAppContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (allPositions) {
      const sortedPositions = [...allPositions].sort(
        (a, b) => a.seniority - b.seniority,
      );
      setAsendingPosition(sortedPositions);
    }
  }, [allPositions]);

  const onEdit = (row: rowData) => {
    navigate({to: '/company/createposition', state: {pos_id: row.id}});
    setPositionList(false);
    setPosition(true);
  };

  const onDelete = (row: rowData) => {
    if (window.confirm(`Are you sure you want to delete "${row.name}"?`)) {
      deletePosition(row.id);
    }
  };

  console.log(' postionnn.....', positionList);
  if (isLoading) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200"></div>
          <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">
          Loading positions...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      {positionList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Popup Content */}
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-boxdark">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Position List
              </h2>

              <div className="flex gap-3">
                {' '}
                <button
                  className="rounded-md bg-[#0284C7] p-1 px-2 text-white"
                  onClick={() => {
                    setPositionList(false);
                    setPosition(true);
                  }}
                >
                  + Add New
                </button>
                <button
                  onClick={() => {
                    setPositionList(false);
                  }}
                  className="rounded-md p-1 px-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="bg-white px-4 dark:bg-meta-4">
              {' '}
              <GenericNewTable
                data={asendingPosition}
                columns={columns}
                onDelete={(row) => onDelete(row)}
                onEdit={(row) => onEdit(row)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayPosition;
