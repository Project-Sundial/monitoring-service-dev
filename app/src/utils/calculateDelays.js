import { nextScheduledRun } from './cronParser.js';

const calculateStartDelay = (monitor) => {
  const runTime = nextScheduledRun(monitor.schedule)._date.ts +
    (monitor.grace_period * 1000); // milliseconds from epoch

  return (runTime - Date.now()) / 1000; // delay in seconds
};

const calculateEndDelay = (monitor) => {
  return monitor.tolerable_runtime;
};

const calculateSoloDelay = (monitor) => {
  const runTime = nextScheduledRun(monitor.schedule)._date.ts +
    ((monitor.grace_period + monitor.tolerable_runtime) * 1000); // milliseconds from epoch

  return (runTime - Date.now()) / 1000; // delay in seconds
};

export {
  calculateStartDelay,
  calculateEndDelay,
  calculateSoloDelay,
};
