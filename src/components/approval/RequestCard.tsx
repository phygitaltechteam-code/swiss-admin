/*eslint-disable*/
import React, {useState} from 'react';
import {UserRequest} from '@/types/approval';
import {
  MdSearch,
  MdNotifications,
  MdArrowForward,
  MdWarning,
  MdSchedule,
  MdBlock,
  MdCheckCircle,
  MdClose,
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
  const status = getRequestStatus(request);

  // State for image modal
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  return (
    <>
      <div
        onClick={onClick}
        className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
          isSelected
            ? 'ring-0.5 border-primary/50 ring-primary/50'
            : 'border-stroke'
        } ${status === 'APPROVED' ? 'opacity-75 hover:opacity-100' : ''} `}
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-start gap-4 md:items-center">
            {request?.photo ? (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  openImageModal(request.photo);
                }}
                className="h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-sm focus:outline-none"
              >
                <img
                  alt={request?.user?.fullname}
                  className="h-full w-full object-cover"
                  src={request?.photo}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className =
                        'flex h-full w-full items-center justify-center bg-green-100 text-xl font-bold text-green-600';
                      fallback.textContent = request?.user?.fullname
                        .split(' ')
                        .map((n) => n[0])
                        .join('');
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </button>
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

      {/* Image Modal */}
      {isModalOpen && modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <div
            className="dark:bg-gray-900 relative max-h-[90vh] max-w-[90vw] rounded-lg bg-white p-1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 absolute -right-3 -top-3 rounded-full bg-white p-1 shadow-lg dark:text-white"
            >
              <MdClose className="h-5 w-5" />
            </button>
            <img
              src={modalImage}
              alt="Document preview"
              className="max-h-[85vh] max-w-full rounded object-contain"
              onError={(e) => {
                e.currentTarget.src = '/fallback-image.png'; // optional fallback
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RequestCard;
