import React from 'react';
import {MdCalendarMonth, MdExpandMore} from 'react-icons/md';

export interface TransactionFilterState {
  type: '' | 'CREDIT' | 'DEBIT';
  from: Date | null;
  to: Date | null;
}

interface Props {
  value: TransactionFilterState;
  onChange: (value: TransactionFilterState) => void;
}

const TransactionFilters: React.FC<Props> = ({value, onChange}) => {
  return (
    <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Date From */}
        <div>
          <label className="mb-1 block text-sm font-medium">From Date</label>
          <div className="relative">
            <input
              type="date"
              className="h-11 w-full rounded-lg border pl-10 text-sm"
              onChange={(e) =>
                onChange({
                  ...value,
                  from: e.target.value ? new Date(e.target.value) : null,
                })
              }
            />
            <MdCalendarMonth className="text-gray-400 absolute left-3 top-3 text-xl" />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="mb-1 block text-sm font-medium">Type</label>
          <div className="relative">
            <select
              value={value.type}
              onChange={(e) =>
                onChange({
                  ...value,
                  type: e.target.value as any,
                })
              }
              className="h-11 w-full appearance-none rounded-lg border px-4 text-sm"
            >
              <option value="">All</option>
              <option value="CREDIT">Credit</option>
              <option value="DEBIT">Debit</option>
            </select>
            <MdExpandMore className="text-gray-400 pointer-events-none absolute right-3 top-3 text-xl" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2">
          <button
            className="h-11 flex-1 rounded-lg bg-primary text-white"
            onClick={() => onChange(value)}
          >
            Apply
          </button>
          <button
            className="h-11 rounded-lg border px-4"
            onClick={() => onChange({type: '', from: null, to: null})}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
