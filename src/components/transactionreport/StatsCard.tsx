import React from 'react';
import {
  MdArrowUpward,
  MdRemove,
  MdAttachMoney,
  MdAnalytics,
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
    <div className="bg-card-light flex flex-col gap-1 rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
      <div className="text-text-secondary flex items-center gap-2">
        {iconType === 'money' ? (
          <MdAttachMoney className="text-xl" />
        ) : (
          <MdAnalytics className="text-xl" />
        )}
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="text-text-primary mt-1 text-3xl font-bold">{value}</p>
      <div className="mt-2 flex items-center gap-1">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
            isPositive
              ? 'bg-green-50 text-green-700'
              : isNeutral
                ? 'bg-blue-50 text-blue-700'
                : 'bg-red-50 text-red-700'
          }`}
        >
          {isPositive ? (
            <MdArrowUpward className="mr-0.5" />
          ) : (
            <MdRemove className="mr-0.5" />
          )}
          {Math.abs(trend).toFixed(1)}%
        </span>
        <span className="text-text-secondary text-xs">{trendLabel}</span>
      </div>
    </div>
  );
};

export default StatsCard;
