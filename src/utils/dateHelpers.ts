export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const isOverdue = (dueDate: Date): boolean => {
  return new Date() > new Date(dueDate);
};

export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const difference = endDate.getTime() - startDate.getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
};

export const getRelativeTimeString = (date: Date): string => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysDifference = getDaysBetween(new Date(), date);

  if (Math.abs(daysDifference) < 1) {
    return 'today';
  } else if (daysDifference === 1) {
    return 'tomorrow';
  } else if (daysDifference === -1) {
    return 'yesterday';
  } else if (daysDifference > 0) {
    return rtf.format(daysDifference, 'day');
  } else {
    return rtf.format(daysDifference, 'day');
  }
};