import { format, differenceInMinutes, isBefore, isAfter } from 'date-fns';

export const formatTimeRemaining = (startTime: string): string => {
  const now = new Date();
  const contestStart = new Date(startTime);
  const minutesRemaining = differenceInMinutes(contestStart, now);

  if (minutesRemaining < 0) {
    return 'Contest has started';
  }

  const days = Math.floor(minutesRemaining / (24 * 60));
  const hours = Math.floor((minutesRemaining % (24 * 60)) / 60);
  const minutes = minutesRemaining % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const formatContestTime = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const isUpcoming = (startTime: string): boolean => {
  return isAfter(new Date(startTime), new Date());
};

export const isPast = (endTime: string): boolean => {
  return isBefore(new Date(endTime), new Date());
};

export const getContestStatus = (
  startTime: string,
  endTime: string
): 'upcoming' | 'ongoing' | 'past' => {
  const now = new Date();
  const contestStart = new Date(startTime);
  const contestEnd = new Date(endTime);

  if (isBefore(contestEnd, now)) {
    return 'past';
  } else if (isBefore(contestStart, now) && isAfter(contestEnd, now)) {
    return 'ongoing';
  } else {
    return 'upcoming';
  }
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hours ${remainingMinutes} minutes`;
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};
