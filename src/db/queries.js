import dbQuery from '../db/config.js';
import parser from 'cron-parser';

const dbGetOverdue = () => {
  const GET_OVERDUE = 'SELECT * FROM monitor WHERE '
    + 'next_alert < $1';

  return dbQuery(GET_OVERDUE, new Date());
};

const dbUpdateNextAlert = async (endpoint_key) => {
  const GET_MONITOR = `
    SELECT *
    FROM monitor
    WHERE endpoint_key = $1;
  `;

  const target = await dbQuery(GET_MONITOR, [endpoint_key]).rows[0];

  const nextAlert = parser.parseExpression(
    target.schedule,
    { currentDate: new Date() }
  ).next()._date.ts +
    target.grace_period * 1000;

  const UPDATE_ALERT = `
    UPDATE monitor
    SET next_alert = (to_timestamp($2 / 1000.0))
    WHERE endpoint_key = $1;
  `;

  return await dbQuery(UPDATE_ALERT, [endpoint_key, nextAlert]);
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

const dbMonitorFailure = async (ids) => {
  const UPDATE_FAILING = `
    UPDATE monitor AS t
    SET failing = false,
        next_alert = t.next_alert + (t.grace_period * interval '1 second')
    FROM (SELECT id, grace_period FROM monitor WHERE id = ANY($1)) AS g
    WHERE t.id = g.id;
  `;

  return await dbQuery(UPDATE_FAILING, [ids]);
};

export {
  dbMonitorFailure,
  dbGetAllMonitors,
  dbUpdateNextAlert,
  dbAddMonitor,
  dbGetOverdue
};
