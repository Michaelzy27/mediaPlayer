import dayjs from 'dayjs';

export const formatDate = (dateTime?: string | number): string => {
  if (!dateTime) {
    return '';
  }
  return dayjs(dateTime).format('DD MMM YYYY');
};

export const formatDateTime = (dateTime?: string | number): string => {
  if (!dateTime) {
    return '';
  }
  return dayjs(dateTime).format('DD MMM YYYY hh:mm:ss');
};

export const formatLastActiveDate = (time: number) => {
  const dt = dayjs(time);
  const todayDateOnly = new Date();
  todayDateOnly.setHours(0, 0, 0, 0);

  const today = dayjs(todayDateOnly);
  const tomorrow = today.set('date', today.date() + 1);
  const yesterday = today.set('date', today.date() - 1);

  if (dt.isAfter(today) && dt.isBefore(tomorrow)) {
    return 'Today';
  }

  if (dt.isBefore(today) && dt.isAfter(yesterday)) {
    return 'Yesterday';
  }

  return dt.format('DD MMM YYYY');
};
