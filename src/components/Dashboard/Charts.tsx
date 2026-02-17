import React, {useEffect, useState} from 'react';
import {
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
import {useGetDashToUpGraph, useGetfeeChart} from '@/lib/api/dashboard';

// const volumeData: ChartDataPoint[] = ;

export const VolumeVsFeesChart: React.FC = () => {
  const [volumeData, setVolumeData] = useState<ChartDataPoint[]>([]);
  const {data: volumeDatas} = useGetfeeChart();
  useEffect(() => {
    console.log('volumeDatas', volumeDatas);
    if (volumeDatas) {
      setVolumeData(volumeDatas);
    }
  }, [volumeDatas]);

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
  const {mutateAsync: fetchWeeklyData} = useGetDashToUpGraph();
  const [weeklyData, setWeeklyData] = useState<BarChartDataPoint[]>([]);
  const getCurrentWeekRange = () => {
    const today = new Date();

    // Make week start from Monday
    const day = today.getDay(); // 0 = Sun, 1 = Mon ...
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() + diffToMonday);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const format = (date: Date) => date.toISOString().split('T')[0]; // YYYY-MM-DD

    return {
      startDate: format(startDate),
      endDate: format(endDate),
    };
  };

  useEffect(() => {
    const loadWeeklyData = async () => {
      const {startDate, endDate} = getCurrentWeekRange();

      const response = await fetchWeeklyData({
        from: startDate,
        to: endDate,
      });
      setWeeklyData(response);
      console.log('week data', response); // or setState here
    };

    loadWeeklyData();
  }, []);

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
