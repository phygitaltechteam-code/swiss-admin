import React from 'react';
import {StatMetric} from './types';
import {FiArrowUpRight, FiMinus} from 'react-icons/fi';

interface StatsCardsProps {
  stats: StatMetric[];
}

const StatsCards: React.FC<StatsCardsProps> = ({stats}) => {
  const getTrendColor = (type: StatMetric['type']) => {
    switch (type) {
      case 'success':
      case 'volume':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (direction: string) => {
    if (direction === 'stable')
      return <FiMinus className="mr-0.5 text-[14px]" />;
    return <FiArrowUpRight className="mr-0.5 text-[14px]" />;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="border-gray-200 flex flex-col gap-1 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="text-secondary-text flex items-center gap-2">
            <stat.icon className="text-[20px]" />
            <p className="text-sm font-medium">{stat.title}</p>
          </div>
          <p className="text-header-text mt-1 text-2xl font-bold">
            {stat.value}
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span
              className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${getTrendColor(stat.type)}`}
            >
              {getTrendIcon(stat.trendDirection)}
              {stat.trendDirection === 'stable' ? 'Stable' : `${stat.trend}%`}
            </span>
            <span className="text-secondary-text text-xs">
              {stat.trendLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
