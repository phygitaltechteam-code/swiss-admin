import {Commission} from './CommissionTable';

export const COMMISSIONS: Commission[] = [
  {
    id: 1,
    name: 'International Transfer',
    description: 'SWIFT Network',
    appliedOn: 'Transfer',
    appliedOnColor:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    percentage: 1.5,
    status: 'Active',
  },
  {
    id: 2,
    name: 'EUR-USD Conversion',
    description: 'Forex Market',
    appliedOn: 'Conversion',
    appliedOnColor:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    percentage: 0.8,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Local Bank Deposit',
    description: 'ATM & Counter',
    appliedOn: 'Deposit',
    appliedOnColor:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    percentage: 0.0,
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Expedited Processing',
    description: 'Priority Service',
    appliedOn: 'Service Fee',
    appliedOnColor:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    percentage: 2.0,
    status: 'Active',
  },
  {
    id: 5,
    name: 'ATM Withdrawal (Non-Network)',
    description: 'External ATMs',
    appliedOn: 'Withdrawal',
    appliedOnColor:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    percentage: 3.5,
    status: 'Active',
  },
];
