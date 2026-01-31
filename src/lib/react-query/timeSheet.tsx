import {useQuery} from '@tanstack/react-query';
import {
  getAllTodaysAttendate,
  getAttendance,
  getTimeSheet,
} from '../api/timesheet';

export const useGetTimeSheet = (id: string) =>
  useQuery({
    queryKey: ['timesheet', id],
    queryFn: () => getTimeSheet(id),
  });

export const useGetAttendance = (id: string) =>
  useQuery({
    queryKey: ['attendance', id],
    queryFn: () => getAttendance(id),
  });
export const useGetTodaysAttendance = () =>
  useQuery({
    queryKey: ['all_attendance'],
    queryFn: () => getAllTodaysAttendate(),
  });
