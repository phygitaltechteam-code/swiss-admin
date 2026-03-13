import React from 'react';
import {UserRequest} from '@/types/approval';
import {getRequestStatus, statusColors} from './methods';

interface RequestCardProps {
  request: UserRequest;
  onClick: () => void;
  isSelected: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onClick,
  isSelected,
}) => {
  const status = getRequestStatus(request);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        isSelected
          ? 'border-primary/50 ring-1 ring-primary/50'
          : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {request?.user?.fullname
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{request?.user?.fullname}</h3>
            <p className="text-sm text-gray-500">{request?.user?.email}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default RequestCard;