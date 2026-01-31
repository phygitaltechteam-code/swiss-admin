import React from 'react';
import {LucideIcon} from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

export interface ChartDataPoint {
  name: string;
  volume: number;
  fees: number;
}

export interface BarChartDataPoint {
  day: string;
  topUps: number;
  transfers: number;
}

export interface ActivityItem {
  id: number;
  type: 'register' | 'alert' | 'transfer' | 'backup';
  title: string;
  description: string | React.ReactNode;
  time: string;
}
