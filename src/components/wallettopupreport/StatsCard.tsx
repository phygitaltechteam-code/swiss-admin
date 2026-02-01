// StatsCard.tsx
import React from 'react';
import {StatCardProps} from './types';

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
    <div className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm dark:bg-[#111a22]">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
          <span className="text-xl text-primary">{icon}</span>
        </div>
        <p className="text-secondary-text dark:text-gray-400 text-sm font-medium">
          {title}
        </p>
      </div>

      <p
        className={`text-2xl font-bold ${
          highlightValue ? 'text-primary' : 'text-header-text dark:text-white'
        }`}
      >
        {value}
      </p>

      {(trend || subtext || alert) && (
        <div className="mt-3 flex items-center gap-2">
          {alert && (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              <span className="mr-1">⚠️</span>
              Action Required
            </span>
          )}

          {trend && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                trendDirection === 'up'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              <span className="mr-1">
                {trendDirection === 'up' ? '📈' : '📉'}
              </span>
              {trend}
            </span>
          )}

          {subtext && !alert && (
            <span className="text-secondary-text dark:text-gray-500 text-xs">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
