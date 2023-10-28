import dbQuery from './config.js';
import { nextScheduledRun } from '../utils/cronParser.js';

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

const dbUpdateNextAlert = async (monitor) => {
  const UPDATE_ALERT = `
    UPDATE monitor
    SET next_alert = (to_timestamp($2 / 1000.0))
    WHERE endpoint_key = $1
    RETURNING *
  `;
  const errorMessage = 'Unable to update next alert time in database.';

  const nextAlert = nextScheduledRun(monitor.schedule)._date.ts +
    monitor.grace_period * 1000;

  return await handleDatabaseQuery(UPDATE_ALERT, errorMessage, monitor.endpoint_key, nextAlert);
};

const dbGetMonitorById = async (id) => {
  const GET_MONITOR = `
    SELECT * FROM monitor
    WHERE id = $1
  `;
  const errorMessage = 'Unable to fetch monitor by id from database.';

  const monitor = await handleDatabaseQuery(GET_MONITOR, errorMessage, id);
  return monitor[0];
};

const dbGetMonitorByEndpointKey = async (endpointKey) => {
  const GET_MONITOR = `
    SELECT * FROM monitor
    WHERE endpoint_key = $1
  `;
  const errorMessage = 'Unable to fetch monitor by endpoint key from database.';

  const monitor = await handleDatabaseQuery(GET_MONITOR, errorMessage, endpointKey);
  return monitor[0];
};

const dbGetAllMonitors = async () => {
  const GET_MONITORS = 'SELECT * FROM monitor ORDER BY id';
  const errorMessage = 'Unable to fetch monitors from database.';

  return await handleDatabaseQuery(GET_MONITORS, errorMessage);
};

const dbAddMonitor = async ( monitor ) => {
  const columns = ['endpoint_key', 'schedule', 'type'];
  const values = [monitor.endpointKey, monitor.schedule, monitor.type];

  if (monitor.name) {
    columns.push('name');
    values.push(monitor.name);
  }

  if (monitor.command) {
    columns.push('command');
    values.push(monitor.command);
  }

  if (monitor.tolerableRuntime) {
    columns.push('tolerable_runtime');
    values.push(monitor.tolerableRuntime);
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

const dbUpdateMonitorFailing = async (id) => {
  const UPDATE_FAILING = `
    UPDATE monitor
    SET failing = true
    WHERE monitor.id = $1
    RETURNING *
  `;
  const errorMessage = 'Unable to update `failing` state in database.';

  return await handleDatabaseQuery(UPDATE_FAILING, errorMessage, id);
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

const dbUpdateMonitorType = async (type, id) => {
  const UPDATE_TYPE = `
    UPDATE monitor
    SET type = $1
    WHERE monitor.id = $2
    RETURNING *
  `;
  const errorMessage = 'Unable to update monitor type in database.';

  return await handleDatabaseQuery(UPDATE_TYPE, errorMessage, type, id);
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

const dbAddRun = async (data) => {
  const ADD_RUN = `
    INSERT INTO run (monitor_id, time, state, run_token)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const errorMessage = 'Unable to create run in database.';

  return await handleDatabaseQuery(ADD_RUN, errorMessage, data.monitorId, data.time, data.state, data.runToken);
};

const dbUpdateStartedRun = async (data) => {
  const UPDATE_RUN = `
    UPDATE run
    SET duration = ($1 - time),
    state = $2
    WHERE run_token = $3
    RETURNING *
  `;
  const errorMessage = 'Unable to update run in database.';

  const rows = await handleDatabaseQuery(UPDATE_RUN, errorMessage, data.time, data.state, data.runToken);
  return rows[0];
};

const dbUpdateNoStartRun = async (data) => {
  const UPDATE_RUN = `
    UPDATE run
    SET duration = (time - $1),
    state = $2,
    time = $1
    WHERE run_token = $3
    RETURNING *
  `;
  const errorMessage = 'Unable to update run in database.';

  const rows = await handleDatabaseQuery(UPDATE_RUN, errorMessage, data.time, data.state, data.runToken);
  return rows[0];
};

const dbGetRunByRunToken = async (runToken) => {
  const GET_RUN = `
    SELECT * FROM run
    WHERE run_token = $1
  `;
  const errorMessage = 'Unable to fetch run by run token from database.';

  const run = await handleDatabaseQuery(GET_RUN, errorMessage, runToken);
  return run[0];
};

const dbGetRunsByMonitorId = async (id) => {
  const GET_RUNS = `
    SELECT * FROM run
    WHERE monitor_id = $1
    ORDER BY time DESC;
  `;

  const errorMessage = 'Unable to fetch runs by monitor id from database.';
  return await handleDatabaseQuery(GET_RUNS, errorMessage, id);
};

export {
  dbUpdateMonitorFailing,
  dbUpdateMonitorRecovered,
  dbGetMonitorById,
  dbGetMonitorByEndpointKey,
  dbGetAllMonitors,
  dbUpdateNextAlert,
  dbAddMonitor,
  dbUpdateMonitorType,
  dbDeleteMonitor,
  dbAddRun,
  dbUpdateStartedRun,
  dbUpdateNoStartRun,
  dbGetRunByRunToken,
  dbGetRunsByMonitorId,
};
