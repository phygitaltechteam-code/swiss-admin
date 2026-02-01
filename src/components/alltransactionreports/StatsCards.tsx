// StatsCards.tsx
import React from 'react';
import {StatMetric} from './types';

interface StatsCardsProps {
  stats: StatMetric[];
}

const StatsCards: React.FC<StatsCardsProps> = ({stats}) => {
  const getTrendColor = (type: StatMetric['type']) => {
    switch (type) {
      case 'success':
      case 'volume':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTrendIcon = (direction: string) => {
    if (direction === 'stable') return <span className="mr-0.5">➡️</span>;
    if (direction === 'up') return <span className="mr-0.5">📈</span>;
    return <span className="mr-0.5">📉</span>;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm dark:bg-[#111a22]"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <span className="text-xl text-primary">{stat.icon}</span>
            </div>
            <p className="text-secondary-text dark:text-gray-400 text-sm font-medium">
              {stat.title}
            </p>
          </div>
          <p className="text-header-text text-2xl font-bold dark:text-white">
            {stat.value}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTrendColor(stat.type)}`}
            >
              {getTrendIcon(stat.trendDirection)}
              {stat.trendDirection === 'stable' ? 'Stable' : `${stat.trend}%`}
            </span>
            <span className="text-secondary-text dark:text-gray-500 text-xs">
              {stat.trendLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
