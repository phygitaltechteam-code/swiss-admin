import React from 'react';
import {
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalanceWallet,
  MdSavings,
  MdArrowUpward,
  MdRemove,
} from 'react-icons/md';
import {StatData} from './types';

interface StatCardProps {
  data: StatData;
}

const StatCard: React.FC<StatCardProps> = ({data}) => {
  const isNetFlow = data.type === 'net';

  const getIcon = () => {
    switch (data.type) {
      case 'inflow':
        return <MdTrendingUp size={20} />;
      case 'outflow':
        return <MdTrendingDown size={20} />;
      case 'net':
        return <MdAccountBalanceWallet size={20} />;
      case 'closing':
        return <MdSavings size={20} />;
    }
  };

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(data.value);

  const isNeutral = data.change === 0;

  // Styles based on logic
  const badgeBg = isNeutral
    ? 'bg-primary/10 dark:bg-primary/20'
    : data.isPositive
      ? 'bg-green-100 dark:bg-green-900/30'
      : 'bg-red-100 dark:bg-red-900/30';

  const badgeText = isNeutral
    ? 'text-primary'
    : data.isPositive
      ? 'text-green-800 dark:text-green-400'
      : 'text-red-800 dark:text-red-400';

  return (
    <div className="dark:bg-dark-surface dark:border-gray-800 flex flex-col gap-1 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <div className="dark:text-gray-400 flex items-center gap-2 text-[#6B7280]">
        {getIcon()}
        <p className="text-sm font-medium">{data.label}</p>
      </div>
      <p
        className={`mt-1 text-2xl font-bold ${isNetFlow ? 'text-primary' : 'text-text-main dark:text-white'}`}
      >
        {formattedValue}
      </p>
      <div className="mt-2 flex items-center gap-1">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${badgeBg} ${badgeText}`}
        >
          {isNeutral ? (
            <MdRemove size={14} className="mr-0.5" />
          ) : (
            <MdArrowUpward size={14} className="mr-0.5" />
          )}
          {data.change}%
        </span>
        <span className="dark:text-gray-500 text-xs text-[#6B7280]">
          {data.changeLabel}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
