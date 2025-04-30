export const getNextIntervalDate = (intervalDay: number) => {
  const today = new Date();
  const nextDate = new Date();
  nextDate.setDate(today.getDate() + ((intervalDay - today.getDay() + 7) % 7));
  return nextDate;
};
