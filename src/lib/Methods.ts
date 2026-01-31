export function minutesToHours(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) return '0 hrs : 0 min';

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hrs} hrs : ${mins} min`;
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

export function getDuration(startTime: string, endTime: string) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  const diffMs = end - start;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = +(minutes / 60).toFixed(2); // rounded to 2 decimals

  return {
    minutes,
    hours,
  };
}

export const calculateWorkingHours = (
  inTime?: string,
  outTime?: string | null,
  breakMinutes: number = 0,
) => {
  if (!inTime) return '0h 0m';

  const inDate = new Date(inTime);

  // if outTime is null → use current time
  const outDate = outTime ? new Date(outTime) : new Date();

  const totalMinutes = Math.floor(
    (outDate.getTime() - inDate.getTime()) / (1000 * 60),
  );

  const workingMinutes = Math.max(totalMinutes - breakMinutes, 0);

  const hours = Math.floor(workingMinutes / 60);
  const minutes = workingMinutes % 60;

  return `${hours}h ${minutes}m`;
};
