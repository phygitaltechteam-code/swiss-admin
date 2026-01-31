import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  ComposedChart,
} from 'recharts';
import {ChartDataPoint, BarChartDataPoint} from '@/types/dashboard';

// Mock Data
const volumeData: ChartDataPoint[] = [
  {name: '1 Nov', volume: 4000, fees: 2400},
  {name: '5 Nov', volume: 3000, fees: 1398},
  {name: '10 Nov', volume: 2000, fees: 9800},
  {name: '15 Nov', volume: 2780, fees: 3908},
  {name: '20 Nov', volume: 1890, fees: 4800},
  {name: '25 Nov', volume: 2390, fees: 3800},
  {name: '30 Nov', volume: 3490, fees: 4300},
  {name: '3 Dec', volume: 4200, fees: 4800},
];

const weeklyData: BarChartDataPoint[] = [
  {day: 'Mon', topUps: 4000, transfers: 2400},
  {day: 'Tue', topUps: 3000, transfers: 1398},
  {day: 'Wed', topUps: 2000, transfers: 9800},
  {day: 'Thu', topUps: 2780, transfers: 3908},
  {day: 'Fri', topUps: 1890, transfers: 4800},
];

export const VolumeVsFeesChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={volumeData}
        margin={{top: 10, right: 10, left: -20, bottom: 0}}
      >
        <defs>
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F5813D" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#F5813D" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#f0f0f0"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{fontSize: 12, fill: '#6B7280'}}
          dy={10}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />

        {/* Fees Line (Dashed Navy) */}
        <Line
          type="monotone"
          dataKey="fees"
          stroke="#0F1535"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          activeDot={{r: 6, fill: '#0F1535'}}
        />

        {/* Volume Area (Orange Gradient) */}
        <Area
          type="monotone"
          dataKey="volume"
          stroke="#F5813D"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorVolume)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export const TopUpsVsTransfersChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={weeklyData}
        margin={{top: 20, right: 10, left: -20, bottom: 0}}
        barGap={8}
      >
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{fontSize: 12, fill: '#6B7280'}}
          dy={10}
        />
        <Tooltip
          cursor={{fill: 'transparent'}}
          contentStyle={{borderRadius: '8px'}}
        />

        <Bar
          dataKey="topUps"
          fill="#0F1535"
          radius={[4, 4, 0, 0]}
          barSize={12}
        />
        <Bar
          dataKey="transfers"
          fill="#F5813D"
          radius={[4, 4, 0, 0]}
          barSize={12}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
