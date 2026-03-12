// import React, {useState} from 'react';
// import Header from './Header';
// import SummaryChecklist from './SummaryCheckList';
// import DecisionActions from './DesicionActions';
// import ApplicantDetails from './ApplicantDetails';
// import {Route} from '@/routes/_app/approval/registrationDetails.$id';
// import {
//   useAcceptCustomer,
//   useGetCustomerById,
//   useRejectCustomer,
// } from '@/lib/react-query/Customer';
// import {getRequestStatus} from './methods';

// const RegistrationReview: React.FC = () => {
//   const {id} = Route.useParams();
//   const {data: CustomerDetails} = useGetCustomerById(id);
//   const {mutateAsync: acceptCustomer} = useAcceptCustomer();
//   const {mutateAsync: rejectCustomer} = useRejectCustomer();
//   const status = getRequestStatus(CustomerDetails);
//   console.log('each customerrr', CustomerDetails);

//   return (
//     <div className="bg-subtle-pattern flex h-screen overflow-hidden">
//       <main className="relative flex h-screen flex-1 flex-col overflow-hidden transition-all duration-300">
//         <Header status={status} />

//         <div className="custom-scroll overflow-y-auto p-4 md:p-6">
//           <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
//             <div>
//               <ApplicantDetails customerDetails={CustomerDetails} />
//             </div>

//             {status === 'PENDING' && (
//               <div className="flex flex-col gap-6">
//                 <DecisionActions
//                   onAccept={() => acceptCustomer(id)}
//                   onReject={(note: string) => rejectCustomer({id, note})}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default RegistrationReview;
import React, {useState} from 'react';
import Header from './Header';
import {Route} from '@/routes/_app/approval/registrationDetails.$id';
import {
  useAcceptCustomer,
  useGetCustomerById,
  useRejectCustomer,
} from '@/lib/react-query/Customer';
import {getRequestStatus} from './methods';
import {
  MdCheckCircle,
  MdCancel,
  MdInfo,
  MdAccessTime,
  MdCheck,
  MdClose,
  MdVisibility,
  MdAccountBalance,
  MdBadge,
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdPerson,
  MdCalendarToday,
  MdWallet,
  MdCreditCard,
  MdPermIdentity,
} from 'react-icons/md';
import toast from 'react-hot-toast';

const RegistrationReview: React.FC = () => {
  const {id} = Route.useParams();
  const {data: CustomerDetails, refetch} = useGetCustomerById(id);
  const {mutateAsync: acceptCustomer} = useAcceptCustomer();
  const {mutateAsync: rejectCustomer} = useRejectCustomer();
  const status = getRequestStatus(CustomerDetails);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  console.log('customer data:', CustomerDetails);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await acceptCustomer(id);
      await refetch();
      toast.success('Customer approved successfully');
    } catch (error) {
      toast.error('Failed to approve customer');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionNote.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    setIsProcessing(true);
    try {
      await rejectCustomer({id, note: rejectionNote});
      await refetch();
      setShowRejectModal(false);
      setRejectionNote('');
      toast.success('Customer rejected successfully');
    } catch (error) {
      toast.error('Failed to reject customer');
    } finally {
      setIsProcessing(false);
    }
  };

  // Get status badge with icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
            <MdCheckCircle className="text-sm" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
            <MdCancel className="text-sm" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">
            <MdAccessTime className="text-sm" />
            Pending
          </span>
        );
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle document click
  const handleDocumentClick = (src: string, title: string) => {
    setSelectedImage({src, title});
  };

  // Get document buttons for display
  const getDocumentButtons = () => {
    const docs = [];
    if (CustomerDetails?.photo) {
      docs.push(
        <button
          key="photo"
          onClick={() =>
            handleDocumentClick(CustomerDetails.photo, 'Profile Photo')
          }
          className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 transition-colors hover:bg-green-200"
        >
          <MdVisibility className="text-xs" />
          Photo
        </button>,
      );
    }
    if (CustomerDetails?.passport) {
      docs.push(
        <button
          key="passport"
          onClick={() =>
            handleDocumentClick(CustomerDetails.passport, 'Passport Document')
          }
          className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-200"
        >
          <MdVisibility className="text-xs" />
          Passport
        </button>,
      );
    }
    if (CustomerDetails?.aadharCard) {
      docs.push(
        <button
          key="aadhar"
          onClick={() =>
            handleDocumentClick(CustomerDetails.aadharCard, 'Aadhaar Card')
          }
          className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-200"
        >
          <MdVisibility className="text-xs" />
          Aadhaar
        </button>,
      );
    }
    if (CustomerDetails?.panCard) {
      docs.push(
        <button
          key="pan"
          onClick={() =>
            handleDocumentClick(CustomerDetails.panCard, 'PAN Card')
          }
          className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-200"
        >
          <MdVisibility className="text-xs" />
          PAN
        </button>,
      );
    }
    return docs;
  };

  return (
    <div className="bg-subtle-pattern flex h-screen overflow-hidden">
      <main className="relative flex h-screen flex-1 flex-col overflow-hidden transition-all duration-300">
        <Header status={status} />

        <div className="custom-scroll overflow-y-auto p-4 md:p-6">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
            {/* Main Table Card */}
            <div className="overflow-hidden rounded-xl border border-stroke bg-white shadow-sm">
              {/* Table Header */}
              <div className="border-b border-stroke bg-gradient-to-r from-cyan-50 to-slate-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-700">
                    <MdPermIdentity className="text-cyan-600" />
                    Registration Application Details
                  </h2>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(status)}
                    {/* <span className="text-xs text-slate-400 font-mono bg-white px-2 py-1 rounded border border-stroke">
                      ID: {CustomerDetails?.id?.slice(0, 8)}...
                    </span> */}
                  </div>
                </div>
              </div>

              {/* Single Horizontal Table with All Data */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-stroke bg-slate-100/80">
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Full Name
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        DOB
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Verified
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Passport No
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Aadhaar No
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        PAN No
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Documents
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        City
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        State
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Country
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Pincode
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Account No
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        E-Private
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Temp Account
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        Updated
                      </th>
                      {status === 'REJECTED' && (
                        <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-red-600">
                          Rejection Reason
                        </th>
                      )}
                      {status === 'PENDING' && (
                        <th className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-cyan-600">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-stroke/50 transition-colors hover:bg-slate-50/50">
                      {/* Category */}
                      <td className="bg-slate-50/30 px-4 py-4 text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-1">
                          <MdPerson className="text-sm text-cyan-600" />
                          <span className="text-[9px]">PERSONAL</span>
                        </div>
                      </td>

                      {/* Personal Info */}
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.user?.fullname || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.user?.email || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.user?.phoneNumber || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.user?.dob
                          ? formatDate(CustomerDetails.user.dob)
                          : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-bold ${CustomerDetails?.user?.isActive ? 'text-green-600' : 'text-slate-500'}`}
                        >
                          {CustomerDetails?.user?.isActive
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-bold ${CustomerDetails?.user?.isVerified ? 'text-green-600' : 'text-slate-500'}`}
                        >
                          {CustomerDetails?.user?.isVerified ? 'Yes' : 'No'}
                        </span>
                      </td>

                      {/* Documents */}
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.passportNumber || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.aadharCardNumber || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.panCardNumber || '-'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {getDocumentButtons().length > 0 ? (
                            getDocumentButtons()
                          ) : (
                            <span className="text-xs text-slate-400">
                              No docs
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Address */}
                      <td
                        className="max-w-[150px] truncate px-4 py-4 text-sm font-bold text-slate-800"
                        title={CustomerDetails?.address}
                      >
                        {CustomerDetails?.address || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.city || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.state || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.country || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.pincode || '-'}
                      </td>

                      {/* Bank & Wallet */}
                      <td className="font-mono px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.accountNumber || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.wallets?.[0]?.eprivateAccount || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-800">
                        {CustomerDetails?.wallets?.[0]?.temporyAccount || '-'}
                      </td>

                      {/* Timeline */}
                      <td className="px-4 py-4 text-xs text-slate-600">
                        {formatDate(CustomerDetails?.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600">
                        {formatDate(CustomerDetails?.updatedAt)}
                      </td>

                      {/* Rejection Reason - Only if rejected */}
                      {status === 'REJECTED' && (
                        <td className="max-w-[200px] px-4 py-4 text-sm font-medium text-red-600">
                          {CustomerDetails?.rejectedReason || '-'}
                        </td>
                      )}

                      {/* Actions - Only if pending */}
                      {status === 'PENDING' && (
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowRejectModal(true)}
                              disabled={isProcessing}
                              className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-stroke bg-white px-3 py-1.5 text-[9px] font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-50"
                            >
                              <MdClose className="text-xs" />
                              Reject
                            </button>
                            <button
                              onClick={handleAccept}
                              disabled={isProcessing}
                              className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-green-600 px-3 py-1.5 text-[9px] font-bold text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50"
                            >
                              <MdCheck className="text-xs" />
                              Approve
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Compact Summary for Mobile/Tablet */}
              <div className="border-t border-stroke bg-slate-50/50 px-6 py-3 text-[9px] text-slate-400">
                <span className="font-mono">
                  Total Fields: 22 • Scroll horizontally to view all data
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-stroke bg-white shadow-xl">
            <div className="border-b border-stroke p-4">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase">
                <MdCancel className="text-red-600" />
                Reject Application
              </h3>
            </div>
            <div className="p-4">
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <MdInfo className="mt-0.5 text-lg text-yellow-600" />
                <p className="text-xs text-yellow-700">
                  Please provide a reason for rejection. This will be visible to
                  the applicant.
                </p>
              </div>

              <label className="mb-2 block text-[10px] font-extrabold uppercase text-slate-500">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full resize-none rounded-lg border border-stroke bg-white p-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Explain why this application is being rejected..."
                rows={4}
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                disabled={isProcessing}
              />

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionNote('');
                  }}
                  className="rounded-lg border border-stroke bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing || !rejectionNote.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <MdClose />
                      Confirm Rejection
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stroke bg-slate-50/50 px-4 py-3">
              <h3 className="text-sm font-extrabold uppercase text-slate-700">
                {selectedImage.title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="rounded-lg p-1 transition-colors hover:bg-slate-200"
              >
                <MdClose className="text-xl text-slate-600" />
              </button>
            </div>
            <div className="relative flex max-h-[70vh] items-center justify-center overflow-auto bg-black/5 p-2">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[70vh] max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationReview;
