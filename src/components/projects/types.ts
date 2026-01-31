export enum EventStatus {
  INQUIRY = 'Inquiry',
  FINALIZE = 'Finalize',
  SHOOT_DONE = 'Shoot Done',
  POST_WORK = 'Post Work',
  DELIVERY = 'Delivery',
  PAID = 'Paid',
}

export interface StudioEvent {
  id: string;
  title: string;
  date: Date;
  status: EventStatus;
}

export type ViewMode = 'Month' | 'Week' | 'Day';
