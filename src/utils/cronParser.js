import parser from 'cron-parser';

const nextScheduledRun = (schedule) => {
  return parser.parseExpression(
    schedule,
    { currentDate: new Date() }
  ).next();
};

const prevScheduledRun = (schedule) => {
  return parser.parseExpression(
    schedule,
    { currentDate: new Date() }
  ).prev();
};

export {
  nextScheduledRun,
  prevScheduledRun,
};
