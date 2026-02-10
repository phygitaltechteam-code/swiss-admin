import React, {useEffect, useState} from 'react';
import {
  MdZoomIn,
  MdVisibility,
  MdFace,
  MdBlock,
  MdCheckCircle,
} from 'react-icons/md';
import {UserRequest} from '@/types/approval';

interface DetailPanelProps {
  request: UserRequest | null;
  className?: string;
  onClose?: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({request, className = ''}) => {
  console.log('requestttt', request);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  const docList = [
    {
      key: 'passport',
      label: 'Passport',
      image: request?.passport,
      number: request?.passportNumber,
    },
    {
      key: 'panCard',
      label: 'PAN Card',
      image: request?.panCard,
      number: request?.panCardNumber,
    },
    {
      key: 'aadharCard',
      label: 'Aadhaar Card',
      image: request?.aadharCard,
      number: request?.aadharCardNumber,
    },
  ];
  const [activeImage, setActiveImage] = useState<string | null>(
    docList.find((doc) => doc.image)?.image || null,
  );
  useEffect(() => {
    const firstImage = docList.find((doc) => doc?.image)?.image || null;
    setActiveImage(firstImage);
  }, [request, docList]);

  if (!request) return null;

  return (
    <aside
      className={`sticky top-0 flex h-screen w-96 flex-col border-l border-stroke bg-white ${className}`}
    >
      <div className="bg-gray-50 border-b border-stroke p-6">
        <h2 className="text-gray-500 mb-2 text-sm font-bold uppercase tracking-wider">
          Quick View
        </h2>
        <div className="flex items-center gap-4">
          {request?.photo ? (
            <img
              alt={request?.user?.fullname}
              className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-sm"
              src={request?.photo}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-green-100 text-2xl font-bold text-green-600 shadow-sm">
              {request?.user?.fullname
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          )}
          <div>
            <h3 className="text-gray-900 text-xl font-bold">
              {request?.user?.fullname}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-gray-900 font-semibold">Identity Document</h4>
            {/* <span className="text-gray-500 text-xs">1 of 3</span> */}
          </div>
          <div className="bg-gray-900 group relative flex h-48 items-center justify-center overflow-hidden rounded-lg p-4">
            {/* Background gradient */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>

            {activeImage && (
              <img
                src={activeImage}
                alt="Selected document"
                className="relative z-10 h-full w-full rounded-lg object-contain"
              />
            )}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {docList
              .filter((doc) => !!doc.image)
              .map((doc) => (
                <div
                  key={doc.key}
                  onClick={() => setActiveImage(doc.image!)}
                  className={`h-16 w-16 flex-shrink-0 cursor-pointer rounded-lg border-2 ${activeImage === doc.image ? 'border-blue-500' : 'border-transparent'} hover:border-gray-400`}
                >
                  <img
                    src={doc.image}
                    alt={doc.label}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Applicant Data */}
        <div>
          <h4 className="text-gray-900 mb-3 font-semibold">Applicant Data</h4>
          <div className="space-y-5 text-sm">
            <DataRow label="Full Name" value={request?.user?.fullname} />
            <DataRow label="Email" value={request?.user?.email} />
            <DataRow label="Address" value={request.address} truncate />
            {/* <DataRow label="Document Name" value={request.docName} /> */}
            {/* <DataRow
              label="Document Number"
              value={request.docNumber}
              font="font-mono"
            /> */}
          </div>
        </div>

        {/* Verification Checklist */}
        {/* <div>
          <h4 className="text-gray-900 mb-3 font-semibold">
            Verification Checklist
          </h4>
          <div className="space-y-3">
            <ChecklistItem
              icon={<MdVisibility className="text-sm" />}
              label="Document is legible"
              colorClass="bg-blue-100 text-blue-600"
              checked={true}
            />
            <ChecklistItem
              icon={<MdFace className="text-sm" />}
              label="Photo matches selfie"
              colorClass="bg-indigo-100 text-indigo-600"
              checked={false}
            />
          </div>
        </div> */}
      </div>

      {/* Sticky Action Footer */}
      <div className="sticky bottom-0 border-t border-stroke bg-white p-4">
        {rejectMode ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 mb-3">
            <label className="text-gray-700 mb-1 block text-sm font-medium">
              Rejection Reason
            </label>
            <textarea
              className="border-gray-300 w-full rounded-md border p-2 shadow-sm outline-none focus:border-red-500 focus:ring-red-500 sm:text-sm"
              rows={3}
              placeholder="Please provide a reason for rejection..."
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
            />
            <div className="mt-2 flex justify-end gap-3">
              <button
                onClick={() => setRejectMode(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button className="rounded bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700">
                Confirm Rejection
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setRejectMode(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-red-500 bg-transparent px-4 py-2 font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              <MdBlock className="text-lg" /> Reject
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-green-600">
              <MdCheckCircle className="text-lg" /> Approve
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

const DataRow = ({
  label,
  value,
  font = 'font-medium',
  truncate = false,
}: {
  label: string;
  value: string;
  font?: string;
  truncate?: boolean;
}) => (
  <div className="flex justify-between border-b border-stroke py-2">
    <span className="text-gray-500 w-1/3">{label}</span>
    <div className="w-2/3 text-right">
      <span
        className={`text-gray-900 block ${font} ${truncate ? 'truncate' : 'break-all'}`}
      >
        {value}
      </span>
    </div>
  </div>
);

const ChecklistItem = ({
  icon,
  label,
  colorClass,
  checked,
}: {
  icon: React.ReactNode;
  label: string;
  colorClass: string;
  checked: boolean;
}) => (
  <label className="bg-gray-50 hover:bg-gray-100 flex cursor-pointer items-center rounded-lg border border-stroke p-3 transition-colors">
    <div
      className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full ${colorClass}`}
    >
      {icon}
    </div>
    <span className="text-gray-700 flex-1 text-sm font-medium">{label}</span>
    <input
      type="checkbox"
      defaultChecked={checked}
      className="border-gray-300 h-5 w-5 rounded text-blue-600 accent-blue-600 focus:ring-blue-500"
    />
  </label>
);

export default DetailPanel;
