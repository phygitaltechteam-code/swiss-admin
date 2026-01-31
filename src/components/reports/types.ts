import {IconType} from 'react-icons';

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  iconColorClass: string;
  hasGradient?: boolean;
}

export interface SidebarItem {
  label: string;
  icon: IconType;
  isActive?: boolean;
  href?: string;
}
