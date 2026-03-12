import {useNavigate} from '@tanstack/react-router';
import React, {useState, useMemo} from 'react';
import {MdSearch, MdAdd} from 'react-icons/md';
import GenericTable, {Column} from '../Forms/Table/GenericTable';
import {
  useGetComissionAll,
  useDeleteComission,
} from '@/lib/react-query/commission';
import toast from 'react-hot-toast';

export interface Commission {
  id: string;
  name: string;
  description: string;
  percentage: number;
  type: 'TOP_UP' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
}

const typeConfig: Record<string, {label: string; color: string}> = {
  TRANSFER: {
    label: 'Transfer',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  WITHDRAWAL: {
    label: 'Withdrawal',
    color:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  },
  TOP_UP: {
    label: 'Top-Up',
    color:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
};

const CommissionTable: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    commission: Commission | null;
  }>({
    isOpen: false,
    commission: null,
  });

  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetComissionAll();
  const deleteMutation = useDeleteComission();

  const commissions: Commission[] = useMemo(() => {
    if (!apiData) return [];

    return apiData.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      type: item.type,
      percentage: item.percentage,
      amount: item.amount,
    }));
  }, [apiData]);

  const filteredData = commissions.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

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
      accessor: 'type',
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeConfig[item.type].color}`}
        >
          {typeConfig[item.type].label}
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
      header: 'Amount',
      accessor: 'amount',
      render: (item) => (
        <span className="text-sm font-medium tabular-nums text-[#0F1535] dark:text-white">
          {item.amount
            ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
              }).format(item.amount)
            : '0'}
        </span>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
  ];

  const handleEdit = (item: Commission) => {
    navigate({
      to: '/client/addcommision',
      search: {
        editData: JSON.stringify({
          commissionData: item,
          isEditing: true,
        }),
      },
    });
  };

  const handleDelete = (item: Commission) => {
    setDeleteConfirmation({
      isOpen: true,
      commission: item,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.commission) return;

    try {
      await deleteMutation.mutateAsync(deleteConfirmation.commission.id);
      toast.success('Commission deleted successfully');
      refetch(); // Refresh the list
      setDeleteConfirmation({isOpen: false, commission: null});
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete commission');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({isOpen: false, commission: null});
  };

  if (isLoading) {
    return (
      <div className="ml-0 flex min-h-screen flex-1 items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            Loading commissions...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="ml-0 flex min-h-screen flex-1 items-center justify-center p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-lg font-semibold">Failed to load commissions</p>
          <p className="mt-1 text-sm">{error?.message || 'Unknown error'}</p>
          <button
            onClick={() => refetch()}
            className="hover:bg-primary-dark mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-0 min-h-screen flex-1 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4">
        {/* Header */}
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
          {/* Toolbar */}
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
            </div>

            {/* Add button */}
            <button
              onClick={() => navigate({to: '/client/addcommision'})}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#d96d2b] hover:shadow"
            >
              <MdAdd className="text-lg" />
              Add New Commission
            </button>
          </div>

          {/* Table */}
          <div className="flex-1">
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No commissions found.
                </p>
              </div>
            ) : (
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
                isDeleting={deleteMutation.isPending}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && deleteConfirmation.commission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#f4ece7] bg-white p-6 shadow-xl dark:border-[#3a2a20] dark:bg-[#1a120b]">
            <h3 className="text-lg font-bold text-[#0F1535] dark:text-white">
              Delete Commission
            </h3>
            <p className="mt-2 text-sm text-[#9c6949]">
              Are you sure you want to delete &quot;
              {deleteConfirmation.commission.name}&quot;? This action cannot be
              undone.
            </p>

            <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
              <p className="text-xs text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Commission Details:</span>
                <br />
                Type: {typeConfig[deleteConfirmation.commission.type].label}
                <br />
                Percentage: {deleteConfirmation.commission.percentage}%<br />
                Amount: {deleteConfirmation.commission.amount || 0}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg border border-[#f4ece7] bg-white px-4 py-2 text-sm font-medium text-[#0F1535] transition-colors hover:bg-[#f8f7f5] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3a2a20] dark:bg-transparent dark:text-white dark:hover:bg-[#2c2019]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  'Delete Commission'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionTable;
