import React from 'react';
import {useAppContext} from '../common/PopUp';

const WorkPopup = () => {
  const {workPopup, setWorkPopup, setCopySop, setProjectWork} = useAppContext();
  return (
    <div className="mx-auto w-full max-w-6xl">
      {workPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Select Action
              </h2>
              <button
                onClick={() => setWorkPopup(false)}
                className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="mt-6 flex flex-col gap-4">
              <button
                onClick={() => {
                  setWorkPopup(false);
                  setProjectWork(true);
                }}
                className="w-full rounded-xl px-4 py-3 font-semibold text-white transition-all"
                style={{background: '#0284C7'}}
              >
                Add New SOP
              </button>

              <button
                onClick={() => {
                  setWorkPopup(false);
                  setCopySop(true);
                }}
                className="w-full rounded-xl border-2 border-[#0284C7] px-4 py-3 font-semibold transition-all hover:bg-blue-50"
                style={{color: '#0284C7'}}
              >
                Copy SOP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkPopup;
