import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
} from 'recharts';
import {ChartData} from '../types';

interface ChartSectionProps {
  data: ChartData[];
  activeTimeRange: 'sixMonth' | 'oneYear' | 'ytd';
  onTimeRangeChange: (range: 'sixMonth' | 'oneYear' | 'ytd') => void;
}

const CustomTooltip = ({active, payload, label}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="dark:bg-dark-surface border-gray-200 dark:border-gray-700 rounded-lg border bg-white p-3 text-sm shadow-lg">
        <p className="mb-1 font-bold">{label}</p>
        <p className="text-emerald-500">
          Inflow: ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-red-400">
          Outflow: ${payload[1].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const ChartSection: React.FC<ChartSectionProps> = ({
  data,
  activeTimeRange,
  onTimeRangeChange,
}) => {
  return (
    <div className="dark:bg-dark-surface dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-text-main text-lg font-bold dark:text-white">
          Monthly Inflow vs Outflow
        </h3>
        <div className="dark:bg-gray-800 flex items-center rounded-lg bg-[#f0f2f4] p-1">
          <button
            onClick={() => onTimeRangeChange('sixMonth')}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
              activeTimeRange === 'sixMonth'
                ? 'dark:bg-dark-surface bg-white text-primary shadow-sm'
                : 'hover:text-text-main dark:text-gray-400 text-[#6B7280] dark:hover:text-white'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => onTimeRangeChange('ytd')}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
              activeTimeRange === 'ytd'
                ? 'dark:bg-dark-surface bg-white text-primary shadow-sm'
                : 'hover:text-text-main dark:text-gray-400 text-[#6B7280] dark:hover:text-white'
            }`}
          >
            YTD
          </button>
          <button
            onClick={() => onTimeRangeChange('oneYear')}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
              activeTimeRange === 'oneYear'
                ? 'dark:bg-dark-surface bg-white text-primary shadow-sm'
                : 'hover:text-text-main dark:text-gray-400 text-[#6B7280] dark:hover:text-white'
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: -20,
              bottom: 0,
            }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
              className="dark:stroke-gray-800"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 500}}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{fill: '#9CA3AF', fontSize: 12}}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{fill: 'transparent'}}
            />
            <Bar
              dataKey="inflow"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="outflow"
              fill="#F87171"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500"></span>
          <span className="dark:text-gray-400 text-xs font-medium text-[#6B7280]">
            Inflow
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-red-400"></span>
          <span className="dark:text-gray-400 text-xs font-medium text-[#6B7280]">
            Outflow
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
