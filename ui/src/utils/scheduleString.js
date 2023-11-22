import cronstrue from 'cronstrue';

export const scheduleString = (schedule) => {
  try {
    const string = cronstrue.toString(schedule);
    return string;
  } catch {
    return "The cron schedule string"
  }
}