import {StatCardProps} from '@/types/dashboard';
import React from 'react';

const StatsCard: React.FC<StatCardProps> = ({
  title,
  value,
  // change,
  // isPositive,
  icon: Icon,
}) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {/* <span
          className={`rounded-full px-2 py-1 text-xs font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'} `}
        >
          {isPositive ? '+' : ''}
          {change}
        </span> */}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        <h4 className="text-header font-display mt-1 text-2xl font-bold text-black">
          {value}
        </h4>
      </div>
    </div>
  );
};

export default StatsCard;
