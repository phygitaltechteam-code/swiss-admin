import {EventStatus, StudioEvent} from './types';

export const STATUS_COLORS: Record<
  EventStatus,
  {bg: string; text: string; dot: string}
> = {
  [EventStatus.INQUIRY]: {
    bg: 'bg-sky-200',
    text: 'text-sky-900',
    dot: 'bg-sky-200',
  },
  [EventStatus.FINALIZE]: {
    bg: 'bg-blue-600',
    text: 'text-white',
    dot: 'bg-blue-600',
  },
  [EventStatus.SHOOT_DONE]: {
    bg: 'bg-fuchsia-500',
    text: 'text-white',
    dot: 'bg-fuchsia-500',
  },
  [EventStatus.POST_WORK]: {
    bg: 'bg-green-200',
    text: 'text-green-900',
    dot: 'bg-green-200',
  },
  [EventStatus.DELIVERY]: {
    bg: 'bg-green-500',
    text: 'text-white',
    dot: 'bg-green-500',
  },
  [EventStatus.PAID]: {
    bg: 'bg-green-800',
    text: 'text-white',
    dot: 'bg-green-800',
  },
};

export const INITIAL_EVENTS: StudioEvent[] = [
  {
    id: '1',
    title: 'Redesign Website',
    date: new Date(2023, 9, 1),
    status: EventStatus.FINALIZE,
  },
  {
    id: '2',
    title: 'Anjali & Raj - Inquiry',
    date: new Date(2023, 9, 4),
    status: EventStatus.INQUIRY,
  },
  {
    id: '3',
    title: 'Mehta Wedding - Finalize',
    date: new Date(2023, 9, 5),
    status: EventStatus.FINALIZE,
  },
  {
    id: '4',
    title: 'Corporate Headshots',
    date: new Date(2023, 9, 5),
    status: EventStatus.INQUIRY,
  },
  {
    id: '5',
    title: 'Fashion Shoot - Zara',
    date: new Date(2023, 9, 8),
    status: EventStatus.SHOOT_DONE,
  },
  {
    id: '6',
    title: 'Smith Wedding - Post Work',
    date: new Date(2023, 9, 10),
    status: EventStatus.POST_WORK,
  },
  {
    id: '7',
    title: 'Payment: TechCorp',
    date: new Date(2023, 9, 10),
    status: EventStatus.PAID,
  },
  {
    id: '8',
    title: 'Baby Shower - Inquiry',
    date: new Date(2023, 9, 12),
    status: EventStatus.INQUIRY,
  },
  {
    id: '9',
    title: 'Product Shoot - Finalize',
    date: new Date(2023, 9, 12),
    status: EventStatus.FINALIZE,
  },
  {
    id: '10',
    title: 'Event B - Shoot',
    date: new Date(2023, 9, 12),
    status: EventStatus.SHOOT_DONE,
  },
  {
    id: '11',
    title: 'Album Delivery - John',
    date: new Date(2023, 9, 14),
    status: EventStatus.DELIVERY,
  },
  {
    id: '12',
    title: 'Pre-wedding - Finalize',
    date: new Date(2023, 9, 15),
    status: EventStatus.FINALIZE,
  },
  {
    id: '13',
    title: 'Studio Tour - Inquiry',
    date: new Date(2023, 9, 15),
    status: EventStatus.INQUIRY,
  },
  {
    id: '14',
    title: 'Editing - Batch A',
    date: new Date(2023, 9, 15),
    status: EventStatus.POST_WORK,
  },
  {
    id: '15',
    title: 'Model Portfolio',
    date: new Date(2023, 9, 15),
    status: EventStatus.SHOOT_DONE,
  },
  {
    id: '16',
    title: 'Full Payment - #4023',
    date: new Date(2023, 9, 18),
    status: EventStatus.PAID,
  },
  {
    id: '17',
    title: 'Reshoot - Product',
    date: new Date(2023, 9, 20),
    status: EventStatus.SHOOT_DONE,
  },
  {
    id: '18',
    title: 'Campaign - Inquiry',
    date: new Date(2023, 9, 23),
    status: EventStatus.INQUIRY,
  },
  {
    id: '19',
    title: 'App Design',
    date: new Date(2023, 9, 25),
    status: EventStatus.FINALIZE,
  },
  {
    id: '20',
    title: 'Delivery - Client B',
    date: new Date(2023, 9, 25),
    status: EventStatus.DELIVERY,
  },
  {
    id: '21',
    title: 'Retouching 50 photos',
    date: new Date(2023, 9, 28),
    status: EventStatus.POST_WORK,
  },
  {
    id: '22',
    title: 'Engagement Shoot',
    date: new Date(2023, 9, 30),
    status: EventStatus.SHOOT_DONE,
  },
];
