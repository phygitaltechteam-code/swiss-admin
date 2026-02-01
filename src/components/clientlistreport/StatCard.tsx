import React from 'react';
import {StatMetric} from './types';
import {MdArrowUpward, MdPriorityHigh} from 'react-icons/md';

interface StatCardProps {
  stat: StatMetric;
}

const StatCard: React.FC<StatCardProps> = ({stat}) => {
  // Determine badge styles based on data properties (simulating the logic in the design)
  let badgeBg = 'bg-green-50';
  let badgeText = 'text-green-700';
  let Icon = MdArrowUpward;

  if (stat.title.includes('Assets')) {
    badgeBg = 'bg-blue-50';
    badgeText = 'text-blue-700';
  } else if (stat.change === 'Action needed') {
    badgeBg = 'bg-orange-50';
    badgeText = 'text-orange-700';
    Icon = MdPriorityHigh;
  }

  return (
    <div className="border-gray-200 flex flex-col gap-1 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="text-body-text flex items-center gap-2">
        <stat.icon className="text-[20px]" />
        <p className="text-sm font-medium">{stat.title}</p>
      </div>
      <p className={`mt-1 text-2xl font-bold ${stat.colorClass}`}>
        {stat.value}
      </p>

      <div className="mt-2 flex items-center gap-1">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${badgeBg} ${badgeText}`}
        >
          <Icon className="mr-0.5 text-[14px]" />
          {stat.change}
        </span>
        {stat.timeframe && (
          <span className="text-body-text text-xs">{stat.timeframe}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
