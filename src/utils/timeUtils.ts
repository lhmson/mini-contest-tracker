import { format, differenceInMinutes, isBefore, isAfter } from 'date-fns';

export const isContestUpcoming = (startTime: string) => {
  return isAfter(new Date(startTime), new Date());
};

export const isContestPast = (endTime: string) => {
  return isBefore(new Date(endTime), new Date());
};

export const formatTimeRemaining = (startTime: string) => {
  const now = new Date();
  const contestStart = new Date(startTime);
  const minutes = differenceInMinutes(contestStart, now);
  
  if (minutes < 0) return 'Started';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}m`;
  return `${hours}h ${remainingMinutes}m`;
};

export const formatContestTime = (time: string) => {
  return format(new Date(time), 'MMM dd, yyyy HH:mm');
};

export const getContestStatus = (startTime: string, endTime: string) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isAfter(start, now)) return 'Upcoming';
  if (isBefore(end, now)) return 'Past';
  return 'Ongoing';
};

// Alias exports for backward compatibility
export const isUpcoming = isContestUpcoming;
export const isPast = isContestPast;

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hours ${remainingMinutes} minutes`;
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};
