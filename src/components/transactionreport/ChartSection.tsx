import React from 'react';
import {CHART_DATA} from './constants';

const ChartSection: React.FC = () => {
  // Find maximum value to normalize bar heights, adding some headroom
  const maxValue = Math.max(...CHART_DATA.map((d) => d.value)) * 1.1;

  return (
    <div className="bg-card-light rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-text-primary text-lg font-bold">
          Fees Collected Trend
        </h3>
        <div className="flex items-center rounded-lg bg-[#f3f4f6] p-1">
          <button className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-orange-500 shadow-sm transition-all">
            6 Months
          </button>
          <button className="text-text-secondary hover:text-text-primary px-3 py-1.5 text-xs font-medium transition-colors">
            YTD
          </button>
          <button className="text-text-secondary hover:text-text-primary px-3 py-1.5 text-xs font-medium transition-colors">
            1 Year
          </button>
        </div>
      </div>

      <div className="relative h-64 w-full pt-6">
        {/* Background Grid & Axis Labels */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-6">
          {[1, 0.75, 0.5, 0.25, 0].map((tick, i) => (
            <div key={i} className="flex w-full items-center">
              <span className="text-text-secondary mr-2 w-8 text-right text-[10px]">
                {tick === 0 ? '0' : `$${Math.round((maxValue * tick) / 1000)}k`}
              </span>
              <div className="border-gray-200 h-px flex-1 border-b border-dashed"></div>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 flex items-end justify-between pb-6 pl-10 pr-2 pt-2">
          {CHART_DATA.map((item) => {
            const heightPercentage = (item.value / maxValue) * 100;
            return (
              <div
                key={item.name}
                className="group relative mx-1 flex h-full flex-1 cursor-pointer flex-col items-center justify-end sm:mx-2"
              >
                {/* Tooltip */}
                <div className="bg-gray-900 pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100">
                  <span className="font-bold">
                    ${item.value.toLocaleString()}
                  </span>
                  <div className="bg-gray-900 absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform"></div>
                </div>

                {/* Bar Visual */}
                <div
                  className="w-full max-w-[48px] rounded-t-sm bg-orange-400 transition-all duration-300 ease-out hover:bg-orange-500"
                  style={{height: `${heightPercentage}%`}}
                ></div>

                {/* X-Axis Label */}
                <span className="text-text-secondary absolute -bottom-6 mt-2 text-[10px] font-medium">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary/80"></span>
          <span className="text-text-secondary text-xs font-medium">
            Total Fees
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
