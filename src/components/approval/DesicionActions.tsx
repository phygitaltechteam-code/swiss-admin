import {useNavigate} from '@tanstack/react-router';
import React, {useState} from 'react';
import toast from 'react-hot-toast';
import {MdGavel, MdClose, MdVerified, MdWarning} from 'react-icons/md';

type Props = {
  onAccept: () => void;
  onReject: (note: string) => void;
  isProcessing?: boolean;
};

const DecisionActions: React.FC<Props> = ({
  onAccept,
  onReject,
  isProcessing = false,
}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleReject = async () => {
    if (!note.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    setIsSubmitting(true);
    try {
      await onReject(note);
      toast.success('Application rejected successfully');
      setNote('');
      setIsRejecting(false);
      // Navigate to approval list after successful rejection
      navigate({to: '/approval/customerregisterapprove'});
    } catch (error) {
      toast.error('Failed to reject application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await onAccept();
      toast.success('Application approved successfully');
      // Navigate to approval list after successful approval
      navigate({to: '/approval/customerregisterapprove'});
    } catch (error) {
      toast.error('Failed to approve application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="shadow-warm rounded-xl border border-stroke bg-white p-6 transition-all">
      <h2 className="text-theme-header mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <MdGavel className="text-gray-400 text-sm" />
        Decision & Actions
      </h2>

      {isRejecting ? (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <MdWarning className="mt-0.5 text-lg text-yellow-600" />
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-yellow-700">
                Confirm Rejection
              </h4>
              <p className="mt-1 text-xs text-yellow-600">
                Please provide a reason for rejection. This will be visible to
                the applicant.
              </p>
            </div>
          </div>

          <label className="text-theme-header mb-2 block text-[11px] font-bold">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            className="border-gray-300 w-full resize-none rounded-lg border bg-white p-3 text-sm shadow-inner outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            placeholder="Explain why this application is being rejected..."
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isSubmitting}
          />

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setIsRejecting(false);
                setNote('');
              }}
              className="rounded-lg border border-stroke bg-white px-5 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
              onClick={handleReject}
              disabled={isSubmitting || !note.trim()}
            >
              {isSubmitting ? (
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
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setIsRejecting(true)}
            className="border-gray-300 text-theme-body hover:bg-gray-50 flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-3 font-bold shadow-sm transition-colors disabled:opacity-50"
            disabled={isProcessing}
          >
            <MdClose className="text-sm" />
            Reject Application
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-white shadow-sm transition-colors hover:bg-orange-600 disabled:opacity-50"
            onClick={handleAccept}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <MdVerified className="text-sm" />
                Verify & Approve
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default DecisionActions;
