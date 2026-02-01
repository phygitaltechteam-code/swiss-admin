import React, {useState} from 'react';
import toast from 'react-hot-toast';
import {MdGavel, MdClose, MdVerified} from 'react-icons/md';

type Props = {
  onAccept: () => void;
  onReject: (note: string) => void;
};
const DecisionActions: React.FC<Props> = ({onAccept, onReject}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [note, setNote] = React.useState('');

  return (
    <section className="shadow-warm rounded-xl border border-stroke bg-white p-6 transition-all">
      <h2 className="text-theme-header mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <MdGavel className="text-gray-400 text-sm" />
        Decision & Actions
      </h2>

      <div className="space-y-4">
        {isRejecting ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-theme-header mb-2 block text-[11px] font-bold">
              Reason for Rejection
            </label>
            <textarea
              className="border-gray-300 w-full resize-none rounded-lg border bg-white p-3 text-sm shadow-inner outline-none focus:border-red-500 focus:ring-red-500"
              placeholder="Explain why this application is being rejected..."
              rows={3}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
            <div className="mt-3 flex justify-end gap-3">
              <button
                onClick={() => setIsRejecting(false)}
                className="text-gray-500 hover:text-gray-700 pt-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700"
                onClick={() => {
                  if (!note.trim()) {
                    toast.error('Please enter a rejection note');
                    return;
                  }
                  onReject(note);
                }}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setIsRejecting(true);
              }}
              className="border-gray-300 text-theme-body hover:bg-gray-50 flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-3 font-bold shadow-sm transition-colors"
            >
              <MdClose className="text-sm" />
              Reject
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-white shadow-sm transition-colors hover:bg-orange-600"
              onClick={onAccept}
            >
              <MdVerified className="text-sm" />
              Verify & Approve
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DecisionActions;
