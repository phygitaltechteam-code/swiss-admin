import {UserRequest} from '@/types/approval';
import {useNavigate} from '@tanstack/react-router';
import React from 'react';
import {MdSearch, MdNotifications, MdArrowForward} from 'react-icons/md';
import RequestCard from './RequestCard';
import {getRequestStatus} from './methods';

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
  console.log('requests', requests);
  const [activeFilter, setActiveFilter] = React.useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('ALL');

  const navigate = useNavigate();

  const [fromDate, setFromDate] = React.useState<string>('');
  const [toDate, setToDate] = React.useState<string>('');
  const [search, setSearch] = React.useState('');

  // State to control showing all items or just a few
  const [showAll, setShowAll] = React.useState(false);

  const filteredRequests = React.useMemo(() => {
    let data = requests;

    // status filter
    if (activeFilter !== 'ALL') {
      data = data.filter((r) => getRequestStatus(r) === activeFilter);
    }

    // date filter
    if (fromDate) {
      const from = new Date(fromDate);
      data = data.filter((r) => new Date(r.createdAt) >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      data = data.filter((r) => new Date(r.createdAt) <= to);
    }

    // search filter
    if (search.trim()) {
      const q = search.toLowerCase();

      data = data.filter(
        (r) =>
          r?.user?.fullname?.toLowerCase().includes(q) ||
          r?.user?.email?.toLowerCase().includes(q) ||
          r.id?.toString().includes(q),
      );
    }

    return data;
  }, [requests, activeFilter, fromDate, toDate, search]);

  // Determine how many items to show
  const visibleRequests = showAll
    ? filteredRequests
    : filteredRequests.slice(0, 4);
  const hasMore = filteredRequests.length > 4;

  return (
    <div className="h-full flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-black md:text-3xl">
            Verification Dashboard
          </h1>
        </div>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="text-gray-600 flex items-center gap-2 text-sm">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-gray-900 block w-36 rounded-lg border border-stroke bg-white py-2 pl-3 pr-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="From Date"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-gray-900 block w-36 rounded-lg border border-stroke bg-white py-2 pl-3 pr-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="To Date"
            />
          </div>
          <div className="relative w-full md:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdSearch className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-gray-900 placeholder-gray-500 block w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-3 transition duration-150 ease-in-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-stroke pb-1">
        <FilterButton
          label="All Requests"
          count={requests.length}
          active={activeFilter === 'ALL'}
          onClick={() => {
            setActiveFilter('ALL');
            setShowAll(false); // reset view when filter changes
          }}
        />

        <FilterButton
          label="Pending"
          count={
            requests.filter((r) => getRequestStatus(r) === 'PENDING').length
          }
          variant="orange"
          active={activeFilter === 'PENDING'}
          onClick={() => {
            setActiveFilter('PENDING');
            setShowAll(false);
          }}
        />

        <FilterButton
          label="Approved"
          count={
            requests.filter((r) => getRequestStatus(r) === 'APPROVED').length
          }
          variant="green"
          active={activeFilter === 'APPROVED'}
          onClick={() => {
            setActiveFilter('APPROVED');
            setShowAll(false);
          }}
        />

        <FilterButton
          label="Rejected"
          count={
            requests.filter((r) => getRequestStatus(r) === 'REJECTED').length
          }
          variant="red"
          active={activeFilter === 'REJECTED'}
          onClick={() => {
            setActiveFilter('REJECTED');
            setShowAll(false);
          }}
        />
      </div>

      <div className="mb-8">
        <div className="grid gap-4">
          {visibleRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onClick={() => {
                onSelect(req);
              }}
              isSelected={selectedId === req.id}
            />
          ))}
        </div>
      </div>

      {/* Show More / Show All link */}
      {hasMore && (
        <div className="mt-8 flex justify-center pb-16">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-orange-700"
          >
            {showAll ? 'Show Less' : 'View All History'}
            <MdArrowForward className={showAll ? 'rotate-180 transform' : ''} />
          </button>
        </div>
      )}
    </div>
  );
};

// FilterButton remains unchanged...
interface FilterButtonProps {
  label: string;
  count: number;
  active?: boolean;
  variant?: 'gray' | 'orange' | 'green' | 'red';
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  count,
  active,
  variant = 'gray',
  onClick,
}) => {
  const baseClasses =
    'px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors border';
  let classes = '';
  let badgeClasses = 'text-xs px-2 py-0.5 rounded-full';

  if (active) {
    classes = `${baseClasses} bg-black text-white border-black shadow-sm`;
    badgeClasses += ' bg-gray-700 text-white';
  } else {
    classes = `${baseClasses} bg-white border-stroke text-gray-600 hover:bg-gray-50`;
    if (variant === 'orange') badgeClasses += ' bg-orange-100 text-orange-600';
    if (variant === 'green') badgeClasses += ' bg-green-100 text-green-600';
    if (variant === 'red') badgeClasses += ' bg-red-100 text-red-600';
    if (variant === 'gray') badgeClasses += ' bg-gray-100 text-gray-600';
  }

  return (
    <button className={classes} onClick={onClick}>
      {label}
      <span className={badgeClasses}>{count}</span>
    </button>
  );
};

export default RequestList;
