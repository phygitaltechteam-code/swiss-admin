import {
  MdDashboard,
  MdGroups,
  MdVerified,
  MdCreditScore,
  MdFactCheck,
  MdDescription,
  MdPercent,
  MdSettings,
  MdPayments,
  MdReceiptLong,
  MdAddCard,
  MdSwapCalls,
  MdGroup,
  MdContacts,
  MdTrendingUp,
} from 'react-icons/md';
import {ReportItem, SidebarItem} from './types';

export const sidebarItems: SidebarItem[] = [
  {label: 'Dashboard', icon: MdDashboard},
  {label: 'Clients', icon: MdGroups},
  {label: 'Verifications', icon: MdVerified},
  {label: 'Top-Up Approvals', icon: MdCreditScore},
  {label: 'Transfer Approvals', icon: MdFactCheck},
  {label: 'Reports', icon: MdDescription, isActive: true},
  {label: 'Commission Structure', icon: MdPercent},
  {label: 'Settings', icon: MdSettings},
];

export const reports: ReportItem[] = [
  {
    id: '1',
    title: 'Transactions Fee',
    description:
      'Analyze revenue generated from transaction fees across all channels and gateways.',
    icon: MdPayments,
    iconColorClass: 'text-primary',
  },
  {
    id: '2',
    title: 'All Transactions',
    description:
      'Complete log of all incoming and outgoing funds system-wide with granular details.',
    icon: MdReceiptLong,
    iconColorClass: 'text-blue-600',
  },
  {
    id: '3',
    title: 'Wallet Top-Up',
    description:
      'Overview of user wallet funding sources, success rates, and volume metrics.',
    icon: MdAddCard,
    iconColorClass: 'text-green-600',
  },
  {
    id: '4',
    title: 'Transfers Log',
    description:
      'Detailed records of internal P2P and external bank transfer activities.',
    icon: MdSwapCalls,
    iconColorClass: 'text-purple-600',
  },
  {
    id: '5',
    title: 'Client List',
    description:
      'Comprehensive database of active and inactive clients with KYC status.',
    icon: MdGroup,
    iconColorClass: 'text-yellow-500',
  },
  {
    id: '6',
    title: 'Beneficiary List',
    description:
      'Registry of all saved external beneficiaries linked to client accounts.',
    icon: MdContacts,
    iconColorClass: 'text-pink-500',
  },
  {
    id: '7',
    title: 'Cash Flow',
    description:
      'High-level inflow vs. outflow summary for executive financial review.',
    icon: MdTrendingUp,
    iconColorClass: 'text-teal-600',
    hasGradient: true,
  },
];
