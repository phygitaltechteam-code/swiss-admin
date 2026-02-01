import React from 'react';
import {MdTrendingUp, MdWarning, MdAdd} from 'react-icons/md';
import {IconType} from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: string;
  note: string;
  icon?: IconType;
  customIcon?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  note,
  icon: Icon,
  customIcon,
}) => {
  // Determine icon to render. This handles the specific case in the mockup where Pending Approval has a document icon,
  // but we are using MdWarning for simplicity based on the constants.ts setup, or a generic one.
  // In the real mockup, "Pending Approval" has a clipboard/pending icon.
  // "Countries" has a globe.

  let ChangeIcon = MdTrendingUp;
  let changeColorClass = 'bg-[#fef1e8] text-primary';

  if (changeType === 'warning') {
    ChangeIcon = MdWarning;
    changeColorClass = 'bg-[#fef1e8] text-primary'; // Keeping the orange theme
  } else if (changeType === 'neutral') {
    ChangeIcon = MdAdd;
    changeColorClass = 'bg-[#fef1e8] text-primary';
  }

  return (
    <div className="border-border-light flex flex-col gap-1 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="text-text-secondary flex items-center gap-2">
        {/* Render icon if passed */}
        {Icon && !customIcon && <Icon className="text-[20px]" />}
        {customIcon && <MdWarning className="text-[20px]" />}{' '}
        {/* Fallback for custom logic */}
        <p className="text-sm font-medium">{title}</p>
      </div>

      <p className="text-text-main mt-1 text-2xl font-bold">{value}</p>

      <div className="mt-2 flex items-center gap-1">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${changeColorClass}`}
        >
          <ChangeIcon className="mr-0.5 text-[14px]" />
          {change}
        </span>
        {note && <span className="text-text-secondary text-xs">{note}</span>}
      </div>
    </div>
  );
};

export default StatsCard;
