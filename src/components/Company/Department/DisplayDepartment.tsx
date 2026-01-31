import {useAppContext} from '@/components/common/PopUp';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericNewTable from '@/components/Forms/Table/GenericNewTable';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {
  useDeleteCompanyDepartment,
  useGetCompanyDepartment,
} from '@/lib/react-query/companyDepartment';
import {
  useDeleteDepartment,
  useGetDepartment,
  useUpdateDepartment,
} from '@/lib/react-query/department';
import {useNavigate} from '@tanstack/react-router';
import React, {useState} from 'react';

export type roomCategory = {
  id: string;
  name: string;
};

export type rowData = {
  id: string;
  name: string;
};

const columns: Column<rowData>[] = [
  {header: 'Name', accessor: 'name', sortable: true},
];

const DisplayDepartment = () => {
  const {data: allDepartment, isLoading} = useGetCompanyDepartment();
  const {mutateAsync: updateDepartment} = useUpdateDepartment();
  const {mutateAsync: deleteDepartment} = useDeleteCompanyDepartment();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const {displayDepartment, setDisplayDepartment, setCreateDepartment} =
    useAppContext();

  const filteredDepartments = allDepartment?.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(
    (filteredDepartments?.length || 0) / itemsPerPage,
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredDepartments?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const onEdit = (row: rowData) => {
    navigate({
      to: '/company/department/createdepartment',
      state: {dept_id: row.id},
    });
    setCreateDepartment(true);
    setDisplayDepartment(false);
  };

  const onDelete = (row: rowData) => {
    if (window.confirm(`Are you sure you want to delete "${row.name}"?`)) {
      deleteDepartment(row.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200"></div>
          <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">
          Loading departments...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      {displayDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Popup Content */}
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-boxdark">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Department List
              </h2>

              <div className="flex gap-3">
                {' '}
                <button
                  className="rounded-md bg-[#0284C7] p-1 px-2 text-white"
                  onClick={() => {
                    setDisplayDepartment(false);
                    setCreateDepartment(true);
                  }}
                >
                  + Add New
                </button>
                <button
                  onClick={() => {
                    setDisplayDepartment(false);
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
                data={allDepartment}
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

export default DisplayDepartment;
