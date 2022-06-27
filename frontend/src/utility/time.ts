const nth = (days: number) => {
  if (days > 3 && days < 21) return 'th';

  switch (days % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const convertToDate = (date: number) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.toLocaleString('en-us', { month: 'short' });
  const day = dateObj.getDate();

  return `${day}${nth(day)} of ${month} ${year}`;
};

export const convertToTime = (date: number) => {
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dateObj = new Date(date);
  const day = weekday[dateObj.getDay()];
  let hours = dateObj.getHours();
  let minutes: number | string = dateObj.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${day} at ${hours}:${minutes} ${ampm} (GMT-4)`;
  return strTime;
};
