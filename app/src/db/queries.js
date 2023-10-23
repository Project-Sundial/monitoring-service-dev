import dbQuery from './config.js';
import parser from 'cron-parser';

const handleDatabaseQuery = async (query, errorMessage, ...params) => {
  try {
    const result = await dbQuery(query, ...params);
    return result.rows;
  } catch (error) {
    console.log('DATABASE ERROR: ', error);
    error.message = errorMessage || 'Unable to perform database operation.';
    throw error;
  }
};

const dbGetOverdue = async () => {
  const GET_OVERDUE = `
    SELECT * FROM monitor 
    WHERE next_alert < $1
  `;
  const errorMessage = 'Unable to get overdue jobs from database.';

  return await handleDatabaseQuery(GET_OVERDUE, errorMessage, new Date());
};

const dbUpdateNextAlert = async (monitor) => {
  const UPDATE_ALERT = `
    UPDATE monitor
    SET next_alert = (to_timestamp($2 / 1000.0))
    WHERE endpoint_key = $1;
  `;
  const errorMessage = 'Unable to update next alert time in database.';

  const nextAlert = parser.parseExpression(
    monitor.schedule,
    { currentDate: new Date() }
  ).next()._date.ts +
    monitor.grace_period * 1000;

  return await handleDatabaseQuery(UPDATE_ALERT, errorMessage, monitor.endpoint_key, nextAlert);
};

const dbGetMonitorByEndpointKey = async (endpoint_key) => {
  const GET_MONITOR = `
    SELECT * FROM monitor
    WHERE endpoint_key = $1
  `;
  const errorMessage = 'Unable to fetch monitor by endpoint key from database.';

  const monitor = await handleDatabaseQuery(GET_MONITOR, errorMessage, endpoint_key);
  return monitor[0];
};

const dbGetAllMonitors = async () => {
  const GET_MONITORS = 'SELECT * FROM monitor ORDER BY id';
  const errorMessage = 'Unable to fetch monitors from database.';

  return await handleDatabaseQuery(GET_MONITORS, errorMessage);
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
  const errorMessage = 'Unable to add a monitor to database.';

  const rows = await handleDatabaseQuery(ADD_MONITOR, errorMessage, ...values);
  return rows[0];
};

const dbUpdateFailingMonitors = async (ids) => {
  const UPDATE_FAILING = `
    UPDATE monitor AS t
    SET failing = true,
        next_alert = now() + (t.realert_interval * interval '1 minute')
    FROM (SELECT id, grace_period FROM monitor WHERE id = ANY($1)) AS g
    WHERE t.id = g.id;
  `;
  const errorMessage = 'Unable to update failed monitors next alert or failing state in database.';

  return await handleDatabaseQuery(UPDATE_FAILING, errorMessage, [ids]);
};

const dbUpdateMonitorRecovered = async (id) => {
  const UPDATE_RECOVERY = `
    UPDATE monitor
    SET failing = false
    WHERE monitor.id = $1
    RETURNING *
  `;
  const errorMessage = 'Unable to update `failing` state in database.';

  return await handleDatabaseQuery(UPDATE_RECOVERY, errorMessage, id);
};

const dbDeleteMonitor = async (id) => {
  const DELETE_MONITOR = `
    DELETE FROM monitor
    WHERE id = $1
    RETURNING *
  `;
  const errorMessage = 'Unable to delete monitor in database.';

  const rows = await handleDatabaseQuery(DELETE_MONITOR, errorMessage, id);
  return rows[0];
};

const dbAddPing = async (monitor_id) => {
  const ADD_PING = `
    INSERT INTO ping (monitor_id)
    VALUES ($1)
    RETURNING *
  `;
  const errorMessage = 'Unable to add ping to database.';

  return await handleDatabaseQuery(ADD_PING, errorMessage, monitor_id);
};

export {
  dbUpdateFailingMonitors,
  dbUpdateMonitorRecovered,
  dbGetMonitorByEndpointKey,
  dbGetAllMonitors,
  dbUpdateNextAlert,
  dbAddMonitor,
  dbDeleteMonitor,
  dbGetOverdue,
  dbAddPing,
};
