import {useNavigate} from '@tanstack/react-router';
import React, {useState} from 'react';
import {MdEdit, MdDelete, MdSearch, MdExpandMore, MdAdd} from 'react-icons/md';
import GenericTable, {Column} from '../Forms/Table/GenericTable';

interface CommissionTableProps {
  data: Commission[];
}

export interface Commission {
  id: number;
  name: string;
  description: string;
  appliedOn: string;
  appliedOnColor: string;
  percentage: number;
  status: 'Active' | 'Inactive';
}

const CommissionTable: React.FC<CommissionTableProps> = ({data}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Filter data based on search and status
  const filteredData = data.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Define columns for GenericTable
  const columns: Column<Commission>[] = [
    {
      header: 'Commission Name',
      accessor: 'name',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#0F1535] dark:text-white">
            {item.name}
          </span>
          <span className="text-xs text-[#9c6949]">{item.description}</span>
        </div>
      ),
      className: 'min-w-[200px]',
    },
    {
      header: 'Applied On',
      accessor: 'appliedOn',
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.appliedOnColor}`}
        >
          {item.appliedOn}
        </span>
      ),
      className: 'min-w-[120px]',
    },
    {
      header: 'Percentage (%)',
      accessor: 'percentage',
      render: (item) => (
        <span className="text-sm font-medium tabular-nums text-[#0F1535] dark:text-white">
          {item.percentage.toFixed(2)}%
        </span>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) =>
        item.status === 'Active' ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
            <span className="bg-gray-500 size-1.5 rounded-full"></span>
            Inactive
          </span>
        ),
      className: 'min-w-[100px]',
    },
  ];

  const handleEdit = (item: Commission) => {
    console.log('Edit item:', item);
    // Navigate to edit page or open modal
    // navigate({ to: `/client/commission/edit/${item.id}` });
  };

  const handleDelete = (item: Commission) => {
    console.log('Delete item:', item);
    // Show confirmation dialog
    // if (window.confirm(`Delete ${item.name}?`)) {
    //   // Delete logic here
    // }
  };

  return (
    <div className="ml-0 min-h-screen flex-1 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4">
        {/* Title Section */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F1535] dark:text-white sm:text-3xl">
              Commission Structure
            </h1>
            <p className="mt-1 text-sm text-[#9c6949]">
              Manage banking fees and commission rules applied to transactions.
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#f4ece7] bg-white shadow-sm dark:border-[#3a2a20] dark:bg-[#1a120b]">
          {/* Table Toolbar */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#f4ece7] p-4 dark:border-[#3a2a20] sm:flex-row sm:items-center sm:p-5">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdSearch className="text-lg text-[#9c6949]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-lg border-none bg-[#f8f7f5] py-2.5 pl-10 pr-3 text-sm text-[#0F1535] placeholder-[#9c6949] focus:ring-2 focus:ring-primary/20 dark:bg-[#2c2019] dark:text-white"
                  placeholder="Search commissions by name..."
                />
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-40">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full cursor-pointer appearance-none rounded-lg border-none bg-[#f8f7f5] py-2.5 pl-3 pr-10 text-sm text-[#0F1535] focus:ring-2 focus:ring-primary/20 dark:bg-[#2c2019] dark:text-white"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <MdExpandMore className="text-lg text-[#9c6949]" />
                </div>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => navigate({to: '/client/addcommision'})}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#d96d2b] hover:shadow"
            >
              <MdAdd className="text-lg" />
              Add New Commission
            </button>
          </div>

          {/* Generic Table Component */}
          <div className="flex-1">
            <GenericTable
              data={filteredData}
              columns={columns}
              searchAble={false}
              action={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              paginationOff={true}
              itemsPerPage={5}
              editTooltip="Edit Commission"
              deleteTooltip="Delete Commission"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionTable;
