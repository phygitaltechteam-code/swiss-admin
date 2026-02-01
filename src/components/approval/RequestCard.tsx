/*eslint-disable*/
import {UserRequest} from '@/types/approval';
import {
  MdSearch,
  MdNotifications,
  MdArrowForward,
  MdWarning,
  MdSchedule,
  MdBlock,
  MdCheckCircle,
} from 'react-icons/md';
import {getRequestStatus, statusColors} from './methods';
import {useNavigate} from '@tanstack/react-router';
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
  const navigate = useNavigate();
  //   const isRejected = request?.user?.isRejected === true;
  //   const isPending =
  //     request?.user?.isRejected !== true && request?.user?.isVerified !== true;
  //   const isApproved = request?.user?.isVerified === true;
  //   isRejected ? 'Rejected' : isApproved ? 'Approved' : 'Pending';
  const status = getRequestStatus(request);

  console.log('statusss', status);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${isSelected ? 'ring-0.5 border-primary/50 ring-primary/50' : 'border-stroke'} ${status === 'APPROVED' ? 'opacity-75 hover:opacity-100' : ''} `}
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-start gap-4 md:items-center">
          {request?.photo ? (
            <img
              alt={request?.user?.fullname}
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
              src={request?.photo}
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-green-100 text-xl font-bold text-green-600">
              {request?.user?.fullname
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          )}
          <div>
            <h3 className="text-gray-900 text-lg font-bold">
              {request?.user?.fullname}
            </h3>
            <div className="text-gray-500 mt-1 flex flex-wrap gap-x-3 text-sm">
              <span>
                SWIFTBIC: <span className="font-mono">{request?.SWIFTBIC}</span>
              </span>
            </div>

            {request?.rejectedReason && (
              <div className="mt-2 inline-block w-full max-w-xl rounded-md border border-red-100 bg-red-50 p-2 md:w-auto">
                <p className="mb-0.5 text-xs font-semibold text-red-700">
                  Rejection Reason:
                </p>
                <p className="text-gray-700 text-sm">
                  {request?.rejectedReason}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center self-start md:self-center">
          <span
            className={`rounded-md border px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-stroke pt-4 md:flex-row">
        <div className="text-gray-600 flex w-full items-center gap-2 text-sm md:w-auto">
          {status === 'PENDING' && (
            <>
              <MdWarning className="text-base text-primary" />
              <span>Document Uploaded - Needs Review</span>
            </>
          )}

          {status === 'REJECTED' && (
            <>
              <MdBlock className="text-base text-red-500" />
              <span>Application Declined</span>
            </>
          )}
          {status === 'APPROVED' && (
            <>
              <MdCheckCircle className="text-base text-green-500" />
              <span>Verification Complete</span>
            </>
          )}
        </div>

        {status === 'PENDING' && (
          <button
            className="w-full rounded-lg bg-primary px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-orange-600 md:w-auto"
            onClick={() =>
              navigate({to: `/Approval/registrationDetails/${request.id}`})
            }
          >
            Review Application
          </button>
        )}

        {status === 'REJECTED' && (
          <button
            className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full rounded-lg border bg-white px-6 py-2 font-medium shadow-sm transition-colors md:w-auto"
            onClick={() =>
              navigate({to: `/Approval/registrationDetails/${request.id}`})
            }
          >
            View Details
          </button>
        )}
        {status === 'APPROVED' && (
          <button
            className="flex w-full items-center justify-center gap-1 text-sm font-medium text-primary hover:text-orange-700 md:w-auto md:justify-end"
            onClick={() =>
              navigate({to: `/Approval/registrationDetails/${request.id}`})
            }
          >
            View History <MdArrowForward />
          </button>
        )}
      </div>
    </div>
  );
};
export default RequestCard;
