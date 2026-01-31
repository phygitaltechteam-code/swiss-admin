import React from 'react';
import {MdMoreVert, MdDownload} from 'react-icons/md';
import {ReportItem} from './types';

interface ReportCardProps {
  item: ReportItem;
}
const ReportCard: React.FC<ReportCardProps> = ({item}) => {
  return (
    <div
      className={`border-gray-200 group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5`}
    >
      {item.hasGradient && (
        <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-gradient-to-bl from-primary/10 to-transparent"></div>
      )}

      <div className="relative z-10 mb-4 flex items-start justify-between">
        <div
          className={`bg-gray-50 flex h-12 w-12 items-center justify-center rounded-lg ${item.iconColorClass} transition-transform group-hover:scale-110`}
        >
          <item.icon className="text-2xl" />
        </div>
        <MdMoreVert className="text-gray-400 hover:text-navy cursor-pointer text-xl" />
      </div>

      <h3 className="text-navy relative z-10 mb-2 text-lg font-bold">
        {item.title}
      </h3>
      <p className="text-slate-custom relative z-10 mb-6 flex-1 text-sm leading-relaxed">
        {item.description}
      </p>

      <div className="relative z-10 mt-auto flex gap-2">
        <button className="h-9 flex-1 rounded-lg bg-orange-400 text-sm font-bold text-white shadow-sm shadow-orange-100 transition-colors hover:bg-orange-500">
          Generate
        </button>
        <button
          className="border-gray-200 text-slate-custom hover:text-navy hover:border-gray-300 hover:bg-gray-50 flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
          title="Export"
        >
          <MdDownload className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ReportCard;
