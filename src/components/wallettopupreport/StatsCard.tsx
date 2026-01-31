import React from 'react';
import {StatCardProps} from './types';
import {MdArrowUpward, MdArrowDownward, MdWarning} from 'react-icons/md';

const StatsCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendDirection,
  subtext,
  icon,
  highlightValue = false,
  alert = false,
}) => {
  return (
    <div className="border-gray-200 dark:border-gray-800 flex flex-col gap-1 rounded-xl border bg-white p-5 shadow-sm dark:bg-[#111a22]">
      <div className="text-text-muted dark:text-gray-400 flex items-center gap-2">
        <div className="text-[20px]">{icon}</div>
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p
        className={`mt-1 text-2xl font-bold ${highlightValue ? 'text-primary' : 'text-text-main dark:text-white'}`}
      >
        {value}
      </p>

      {(trend || subtext) && (
        <div className="mt-2 flex items-center gap-1">
          {alert && (
            <span className="inline-flex items-center rounded bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              <MdWarning className="mr-0.5 text-[14px]" /> Action Required
            </span>
          )}

          {trend && (
            <span
              className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                trendDirection === 'up'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {trendDirection === 'up' ? (
                <MdArrowUpward className="mr-0.5 text-[14px]" />
              ) : (
                <MdArrowDownward className="mr-0.5 text-[14px]" />
              )}
              {trend}
            </span>
          )}

          {subtext && !alert && (
            <span className="text-text-muted dark:text-gray-500 text-xs">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
