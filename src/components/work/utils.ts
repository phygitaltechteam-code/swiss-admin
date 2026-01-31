// src/components/ProjectWork/utils.ts

export const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf'))
    return {text: 'PDF', color: 'bg-red-100 text-red-600'};
  if (fileType.includes('excel') || fileType.includes('spreadsheet'))
    return {text: 'XLS', color: 'bg-green-100 text-green-600'};
  if (fileType.includes('msword') || fileType.includes('wordprocessing'))
    return {text: 'DOC', color: 'bg-blue-100 text-blue-600'};
  if (fileType.includes('image'))
    return {text: 'IMG', color: 'bg-purple-100 text-purple-600'};
  return {text: 'FILE', color: 'bg-gray-100 text-gray-600'};
};

export const formatDateTime = (
  date: Date | string | undefined,
  time: string,
): Date | null => {
  if (!date || !time) return null;
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

export function minutesToHours(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) return '0';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hrs}`;
  }

  return `${hrs}:${mins.toString().padStart(2, '0')}`;
}
export function hoursToMinutes(hours: number | string): number {
  if (typeof hours === 'number') {
    return Math.round(hours * 60);
  }
  if (!hours) return 0;
  if (hours.includes(':')) {
    const [h, m] = hours.split(':');

    const hrs = Number(h);
    const mins = Number(m);

    if (isNaN(hrs) || isNaN(mins) || mins > 59) return 0;

    return hrs * 60 + mins;
  }
  const value = Number(hours);
  if (isNaN(value) || value < 0) return 0;

  return value * 60;
}
