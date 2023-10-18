import dbQuery from '../db/config.js';
import parser from 'cron-parser';

const dbGetOverdue = async () => {
  const GET_OVERDUE = 'SELECT * FROM monitor WHERE '
    + 'next_alert < $1';

  const result = await dbQuery(GET_OVERDUE, new Date());

  return result;
};

const dbUpdateNextAlert = async (endpoint_key) => {
  const target = await dbGetMonitorByEndpointKey(endpoint_key);

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

  return await dbQuery(UPDATE_ALERT, endpoint_key, nextAlert);
};

const dbGetMonitorByEndpointKey = async (endpoint_key) => {
  const GET_MONITOR = `
    SELECT * FROM monitor
    WHERE endpoint_key = $1
  `;

  const result = await dbQuery(GET_MONITOR, endpoint_key);
  return result.rows[0];
};

const dbGetAllMonitors = async () => {
  const GET_MONITORS = 'SELECT * FROM monitor';

  const result = await dbQuery(GET_MONITORS);
  return result;
};

const dbAddMonitor = async ( monitor ) => {
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

  const result = dbQuery(ADD_MONITOR, ...values);
  return result;
};

const dbMonitorsFailure = async (ids) => {
  const UPDATE_FAILING = `
    UPDATE monitor AS t
    SET failing = true,
        next_alert = now() + (t.realert_interval * interval '1 minute')
    FROM (SELECT id, grace_period FROM monitor WHERE id = ANY($1)) AS g
    WHERE t.id = g.id;
  `;

  return await dbQuery(UPDATE_FAILING, [ids]);
};

const dbMonitorRecovery = async (id) => {
  const UPDATE_RECOVERY = `
    UPDATE monitor
    SET failing = false
    WHERE monitor.id = $1
    RETURNING *
  `;

  const result = await dbQuery(UPDATE_RECOVERY, id);
  return result.rows[0];
};

const dbAddPing = async (monitor_id) => {
  const ADD_PING = `
    INSERT INTO ping (monitor_id)
    VALUES ($1)
    RETURNING *
  `;

  const result = await dbQuery(ADD_PING, monitor_id);
  return result.rows[0];
};

export {
  dbMonitorsFailure,
  dbMonitorRecovery,
  dbGetMonitorByEndpointKey,
  dbGetAllMonitors,
  dbUpdateNextAlert,
  dbAddMonitor,
  dbGetOverdue,
  dbAddPing,
};
