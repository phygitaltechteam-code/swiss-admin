// StatsCard.tsx
import React from 'react';
import {
  MdAttachMoney,
  MdAnalytics,
  MdArrowUpward,
  MdRemove,
  MdArrowDownward,
} from 'react-icons/md';

interface StatsCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  iconType: 'money' | 'analytics';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  trendLabel,
  iconType,
}) => {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  return (
    <div className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm dark:bg-[#111a22]">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
          {iconType === 'money' ? (
            <MdAttachMoney className="text-xl text-primary" />
          ) : (
            <MdAnalytics className="text-xl text-primary" />
          )}
        </div>
        <p className="text-secondary-text dark:text-gray-400 text-sm font-medium">
          {title}
        </p>
      </div>
      <p className="text-header-text text-2xl font-bold dark:text-white lg:text-3xl">
        {value}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isPositive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : isNeutral
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {isPositive ? (
            <MdArrowUpward className="mr-0.5 text-[14px]" />
          ) : isNeutral ? (
            <MdRemove className="mr-0.5 text-[14px]" />
          ) : (
            <MdArrowDownward className="mr-0.5 text-[14px]" />
          )}
          {Math.abs(trend).toFixed(1)}%
        </span>
        <span className="text-secondary-text dark:text-gray-500 text-xs">
          {trendLabel}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
