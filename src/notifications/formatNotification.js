import { prevScheduledRun } from '../utils/cronParser.js';

const formatNotification = (monitor) => {
  return `
    Sundial Alert: Your monitor has failed!\n
    Name: ${monitor.name}\n
    Schedule: ${monitor.schedule}\n
    Command: ${monitor.command}\n
    Last Expected At: ${prevScheduledRun(monitor.schedule).toString()}
  `;
};

export default formatNotification;
