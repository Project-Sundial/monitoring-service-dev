import { prevScheduledRun, nextScheduledRun } from '../utils/cronParser.js';

const stateMap = {
  completed: 'This previously failing job ran.',
  solo_completed: 'This previously failing job ran.',
  no_start: 'This previously failing job ran, but no ping was recieved when the job started.',
  failed: 'The job ran but encountered an error while executing.',
  unresolved: 'A start ping was received but no end ping, the executing job might be taking longer than expected. Try modifying the `tolerable runtime`.',
  missed: 'The job did not run.',
  solo_missed: 'This job did not run.',
};

const formatNotification = (monitor, run) => {
  const message = `
    Sundial Notification: ${stateMap[run.state]}\n
    Name: ${monitor.name}\n
    Schedule: ${monitor.schedule}\n
    Command: ${monitor.command}\n
    Time; ${run.time}\n
  `;

  const scheduleInfo = (run.state === 'missed' || run.state === 'solo_missed)') ?  `Last Expected Time: ${prevScheduledRun(monitor.schedule).toString()}\n` : `Next Expected Time: ${nextScheduledRun(monitor.schedule).toString()}\n`;

  console.log(message, scheduleInfo);
  return message + scheduleInfo;
};

export default formatNotification;