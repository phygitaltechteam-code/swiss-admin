import {UserRequest} from '@/types/approval';
import {useNavigate} from '@tanstack/react-router';
import React, {useState} from 'react';
import {
  MdSearch,
  MdArrowForward,
  MdWarning,
  MdBlock,
  MdCheckCircle,
  MdVisibility,
  MdClose,
  MdSchedule,
} from 'react-icons/md';
import {getRequestStatus, statusColors} from './methods';
import GenericTable from '../Forms/Table/GenericTable';
import type {Column} from '../Forms/Table/GenericTable';

interface RequestListProps {
  requests: UserRequest[];
  onSelect: (request: UserRequest) => void;
  selectedId: string;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  onSelect,
  selectedId,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('ALL');
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openImageModal = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  // Filter requests based on search and filters
  const filteredRequests = React.useMemo(() => {
    let data = requests;

    // Status filter
    if (activeFilter !== 'ALL') {
      data = data.filter((r) => getRequestStatus(r) === activeFilter);
    }

    // Date filter
    if (fromDate) {
      const from = new Date(fromDate);
      data = data.filter((r) => new Date(r.createdAt) >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      data = data.filter((r) => new Date(r.createdAt) <= to);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r?.user?.fullname?.toLowerCase().includes(q) ||
          r?.user?.email?.toLowerCase().includes(q) ||
          r.id?.toString().includes(q) ||
          r?.requestType?.toLowerCase().includes(q),
      );
    }

    return data;
  }, [requests, activeFilter, fromDate, toDate, search]);

  // Calculate statistics
  const totalRequests = requests.length;
  const pendingCount = requests.filter(
    (r) => getRequestStatus(r) === 'PENDING',
  ).length;
  const approvedCount = requests.filter(
    (r) => getRequestStatus(r) === 'APPROVED',
  ).length;
  const rejectedCount = requests.filter(
    (r) => getRequestStatus(r) === 'REJECTED',
  ).length;

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Define columns for GenericTable
  const columns: Column<UserRequest>[] = [
    {
      header: 'User Details',
      accessor: 'user.fullname',
      render: (item) => (
        <div
          className="flex cursor-pointer flex-col transition-opacity hover:opacity-80"
          onClick={() => handleViewRequest(item)}
        >
          <div className="flex items-center gap-3">
            {item?.photo ? (
              <button
                onClick={(e) => openImageModal(item.photo!, e)}
                className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm focus:outline-none"
              >
                <img
                  src={item.photo}
                  alt={item?.user?.fullname}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className =
                        'flex h-full w-full items-center justify-center bg-primary/10 text-sm font-bold text-primary';
                      fallback.textContent = item?.user?.fullname
                        .split(' ')
                        .map((n) => n[0])
                        .join('');
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </button>
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {item?.user?.fullname
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
            )}
            <div>
              <span className="font-mono text-sm font-bold tracking-tight text-[#0F1535] dark:text-white">
                {item?.user?.fullname}
              </span>
            </div>
          </div>
        </div>
      ),
      className: 'min-w-[250px]',
    },
    {
      header: 'Contact Info',
      accessor: 'user.email',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#0F1535] dark:text-white">
            {item?.user?.email || 'N/A'}
          </span>
        </div>
      ),
      className: 'min-w-[200px]',
    },
    {
      header: 'Phone No.',
      accessor: (item) => item.user?.phoneNumber,
      render: (item) => (
        <span className="text-sm font-medium text-[#0F1535] dark:text-white">
          {item.user?.phoneNumber || 'N/A'}
        </span>
      ),
      className: 'min-w-[150px]',
    },
    // {
    //   header: 'Request Type',
    //   accessor: 'requestType',
    //   render: (item) => (
    //     <span className="text-sm font-medium text-[#0F1535] dark:text-white">
    //       {item.requestType || 'Verification Request'}
    //     </span>
    //   ),
    //   className: 'min-w-[150px]',
    // },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#0F1535] dark:text-white">
            {formatDate(item.createdAt)}
          </span>
          <span className="text-gray-500 text-xs">
            {new Date(item.createdAt).toLocaleTimeString()}
          </span>
        </div>
      ),
      className: 'min-w-[120px]',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => {
        const status = getRequestStatus(item);
        const statusConfig = {
          PENDING: {
            icon: MdWarning,
            label: 'Pending',
            style:
              'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
            dot: 'bg-orange-500',
          },
          APPROVED: {
            icon: MdCheckCircle,
            label: 'Approved',
            style:
              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            dot: 'bg-green-500',
          },
          REJECTED: {
            icon: MdBlock,
            label: 'Rejected',
            style:
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            dot: 'bg-red-500',
          },
        };
        const config = statusConfig[status];
        const Icon = config.icon;

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.style}`}
          >
            <span className={`size-1.5 rounded-full ${config.dot}`}></span>
            <Icon className="text-sm" />
            {config.label}
          </span>
        );
      },
      className: 'min-w-[120px]',
    },
  ];

  const handleViewRequest = (request: UserRequest) => {
    onSelect(request);
    navigate({
      to: `/Approval/registrationDetails/${request.id}`,
    });
  };

  return (
    <main className="dark:bg-gray-900 ml-0 min-h-screen flex-1 bg-white p-6 md:p-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F1535] dark:text-white sm:text-3xl">
              Verification Dashboard
            </h1>
            <p className="dark:text-gray-400 text-gray-900 mt-1 text-sm">
              Review and manage user verification requests
            </p>
          </div>
          {/* <div className="flex gap-3">
            <button
              onClick={() => setActiveFilter('PENDING')}
              className="hover:bg-primary-dark flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
            >
              <MdSchedule className="text-lg" />
              View Pending Reviews
            </button>
          </div> */}
        </div>

        {/* Summary Cards */}
        {totalRequests > 0 && (
          <div className="w-full overflow-x-auto pb-2 md:overflow-visible md:pb-0">
            <div className="flex min-w-max gap-4 md:grid md:min-w-0 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
              {/* Total Requests */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Total Requests
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {totalRequests}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <svg
                      className="h-5 w-5 text-orange-600 dark:text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pending */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Pending Review
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {pendingCount}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <MdWarning className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Approved */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {approvedCount}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <MdCheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Rejected */}
              <div className="dark:bg-gray-800 dark:border-gray-700 w-[280px] flex-shrink-0 rounded-xl border border-stroke bg-white p-4 shadow-sm md:w-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-[#0F1535] dark:text-white">
                      {rejectedCount}
                    </p>
                  </div>
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                    <MdBlock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="dark:border-gray-700 dark:bg-gray-800 flex flex-col items-center gap-4 rounded-xl border border-stroke bg-white p-4 lg:flex-row">
          {/* Status Filter Tabs */}
          <div className="flex w-full flex-wrap gap-2 lg:w-auto">
            <FilterChip
              label="All"
              count={totalRequests}
              active={activeFilter === 'ALL'}
              onClick={() => setActiveFilter('ALL')}
            />
            <FilterChip
              label="Pending"
              count={pendingCount}
              active={activeFilter === 'PENDING'}
              variant="orange"
              onClick={() => setActiveFilter('PENDING')}
            />
            <FilterChip
              label="Approved"
              count={approvedCount}
              active={activeFilter === 'APPROVED'}
              variant="green"
              onClick={() => setActiveFilter('APPROVED')}
            />
            <FilterChip
              label="Rejected"
              count={rejectedCount}
              active={activeFilter === 'REJECTED'}
              variant="red"
              onClick={() => setActiveFilter('REJECTED')}
            />
          </div>

          <div className="relative w-full lg:flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdSearch className="text-gray-900 text-xl" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or request ID..."
              className="dark:border-gray-600 dark:bg-gray-700 text-gray-900 block w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-3 text-sm placeholder-[#9c6949] transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
            />
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 text-gray-900 block w-full cursor-pointer rounded-lg border border-stroke bg-white px-3 py-2.5 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-40"
                placeholder="From Date"
              />
            </div>

            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 text-gray-900 block w-full cursor-pointer rounded-lg border border-stroke bg-white px-3 py-2.5 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-40"
                placeholder="To Date"
              />
            </div>
          </div>
        </div>

        {/* Generic Table */}
        <div className="dark:border-gray-700 dark:bg-gray-800 overflow-hidden rounded-xl border border-stroke bg-white shadow-sm">
          {/* Table Toolbar */}
          <div className="dark:border-gray-700 border-b border-stroke p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-semibold text-[#0F1535] dark:text-white">
                  {activeFilter === 'ALL' ? 'All ' : activeFilter + ' '}
                  Verification Requests ({filteredRequests.length} total)
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                  {activeFilter === 'PENDING'
                    ? 'Requests awaiting your review and decision'
                    : activeFilter === 'APPROVED'
                      ? 'Approved and completed verifications'
                      : activeFilter === 'REJECTED'
                        ? 'Rejected or declined requests'
                        : 'Complete list of all verification requests'}
                </p>
              </div>
            </div>
          </div>

          {/* Generic Table Component */}
          <div className="flex-1">
            <GenericTable
              data={filteredRequests}
              columns={columns}
              searchAble={false}
              action={true}
              onView={handleViewRequest}
              itemsPerPage={10}
              viewTooltip="Review Request"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="dark:border-gray-700 dark:bg-gray-800 rounded-xl border border-stroke bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-gray-100 dark:bg-gray-700 mb-4 rounded-full p-4">
                <MdSearch className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-gray-900 text-lg font-semibold dark:text-white">
                No Requests Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
                {search || fromDate || toDate || activeFilter !== 'ALL'
                  ? 'No requests match your current filters. Try adjusting your search criteria.'
                  : 'No verification requests are available at this time.'}
              </p>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {isModalOpen && modalImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={closeImageModal}
          >
            <div
              className="relative max-h-[90vh] max-w-[90vw] rounded-lg bg-white p-1 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeImageModal}
                className="text-gray-800 hover:bg-gray-100 absolute -right-3 -top-3 rounded-full bg-white p-1 shadow-lg"
              >
                <MdClose className="h-5 w-5" />
              </button>
              <img
                src={modalImage}
                alt="Document preview"
                className="max-h-[85vh] max-w-full rounded object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

// Filter Chip Component
interface FilterChipProps {
  label: string;
  count: number;
  active?: boolean;
  variant?: 'gray' | 'orange' | 'green' | 'red';
  onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  count,
  active,
  variant = 'gray',
  onClick,
}) => {
  const variantStyles = {
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    orange:
      'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
    green:
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 bg-white'
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          active ? 'bg-white/20 text-white' : variantStyles[variant]
        }`}
      >
        {count}
      </span>
    </button>
  );
};

export default RequestList;
