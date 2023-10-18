import executeQuery from './config.js';
import dbQuery from '../db/config.js';
import parser from 'cron-parser';

const getOverdue = async () => {
  const GET_OVERDUE = 'SELECT * FROM monitor WHERE '
    + 'next_alert < $1';
  const result = await executeQuery(GET_OVERDUE, new Date());

  return result;
};

const dbUpdateNextAlert = async (endpoint_key) => {
  const results = await dbQuery(
    `SELECT *
    FROM monitor
    WHERE endpoint_key = $1;
  `, [endpoint_key]);

  const target = results.rows[0];

  const nextAlert = parser.parseExpression(
    target.schedule,
    { currentDate: new Date() }
  ).next()._date.ts +
    target.grace_period * 1000;

  return dbQuery(`
    UPDATE monitor
    SET next_alert = (to_timestamp($2 / 1000.0))
    WHERE endpoint_key = $1;`,
  [endpoint_key, nextAlert]);
};

const dbGetAllMonitors = () => {
  return dbQuery('SELECT * FROM monitor');
};

const dbAddMonitor = (params) => {
  return dbQuery(`
    INSERT INTO monitor (endpoint_key, schedule)
    VALUES ($1, $2)
    RETURNING *;`,
    params);
};

export {
  dbGetAllMonitors,
  dbAddMonitor,
  dbUpdateNextAlert,
  getOverdue
};
