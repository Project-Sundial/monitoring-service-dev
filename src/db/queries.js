import dbQuery from '../db/config.js';
import parser from 'cron-parser';

const dbGetOverdue = () => {
  const GET_OVERDUE = 'SELECT * FROM monitor WHERE '
    + 'next_alert < $1';

  return dbQuery(GET_OVERDUE, new Date());
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
  const GET_MONITORS = 'SELECT * FROM monitor';

  return dbQuery(GET_MONITORS);
};

const dbAddMonitor = ( monitor ) => {
  const columns = ['endpoint_key', 'schedule'];
  const values = [monitor.endpoint_key, monitor.schedule];

  if (monitor.name) {
    columns.push('name');
    values.push(monitor.name);
  }

  if (monitor.command) {
    columns.push('command');
    values.push(monitor.command);
  }

  if (monitor.grace_period) {
    columns.push('grace_period');
    values.push(monitor.grace_period);
  }

  const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

  const ADD_MONITOR = `
    INSERT INTO monitor (${columns}) 
    VALUES (${placeholders})
    RETURNING *;`;

  return dbQuery(ADD_MONITOR, ...values);
};

export {
  dbGetAllMonitors,
  dbUpdateNextAlert,
  dbAddMonitor,
  dbGetOverdue
};
