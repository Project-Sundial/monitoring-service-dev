import parser from 'cron-parser';

const nextRun = (schedule) => {
  return parser.parseExpression(
    schedule,
    { currentDate: new Date() }
  ).next().toString();
};

export default nextRun;
