import React, {useState} from 'react';

interface ChartDataItem {
  name: string; // date
  value: number; // total fees for that date
}

interface ChartSectionProps {
  data?: ChartDataItem[]; // if not provided, falls back to empty array
}

const ChartSection: React.FC<ChartSectionProps> = ({data = []}) => {
  const [timeRange, setTimeRange] = useState<'6months' | 'ytd' | '1year'>(
    '6months',
  );

  // Use the provided data, or an empty array if none
  const chartData = data.length > 0 ? data : [];

  // Find maximum value for bar height scaling
  const maxValue =
    chartData.length > 0
      ? Math.max(...chartData.map((d) => d.value)) * 1.1
      : 100; // fallback

  const timeRangeButtons = [
    {id: '6months', label: '6 Months'},
    {id: 'ytd', label: 'YTD'},
    {id: '1year', label: '1 Year'},
  ];

  return (
    <div className="dark:border-gray-800 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:bg-[#111a22]">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-header-text text-lg font-bold dark:text-white">
          Fees Collected Trend
        </h3>
        <div className="bg-gray-100 dark:bg-gray-800 flex items-center rounded-lg p-1">
          {timeRangeButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setTimeRange(button.id as any)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                timeRange === button.id
                  ? 'dark:bg-gray-700 bg-white text-primary shadow-sm dark:text-orange-400'
                  : 'text-secondary-text hover:text-header-text dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-secondary-text dark:text-gray-400 flex h-64 items-center justify-center">
          No fee data available for chart.
        </div>
      ) : (
        <div className="relative h-64 w-full pt-6">
          {/* Background Grid */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-6">
            {[1, 0.75, 0.5, 0.25, 0].map((tick, i) => (
              <div key={i} className="flex w-full items-center">
                <span className="text-secondary-text dark:text-gray-400 mr-2 w-8 text-right text-[10px]">
                  {tick === 0
                    ? '0'
                    : `$${Math.round((maxValue * tick) / 1000)}k`}
                </span>
                <div className="border-gray-200 dark:border-gray-700 flex-1 border-b border-dashed"></div>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between pb-6 pl-10 pr-2 pt-2">
            {chartData.map((item) => {
              const heightPercentage = (item.value / maxValue) * 100;
              return (
                <div
                  key={item.name}
                  className="group relative mx-1 flex h-full flex-1 cursor-pointer flex-col items-center justify-end sm:mx-2"
                >
                  {/* Tooltip */}
                  <div className="bg-gray-900 dark:bg-gray-800 pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100">
                    <span className="font-bold">
                      ${item.value.toLocaleString()}
                    </span>
                    <div className="bg-gray-900 dark:bg-gray-800 absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform"></div>
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full max-w-[48px] rounded-t-sm bg-gradient-to-t from-primary to-orange-400 transition-all duration-300 ease-out hover:opacity-90"
                    style={{height: `${heightPercentage}%`}}
                  ></div>

                  {/* X-Axis Label */}
                  <span className="text-secondary-text dark:text-gray-400 absolute -bottom-6 mt-2 text-[10px] font-medium">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary"></span>
          <span className="text-secondary-text dark:text-gray-400 text-xs font-medium">
            Total Fees
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
