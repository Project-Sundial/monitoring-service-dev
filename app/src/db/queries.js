import error from '../routes/error.js';
import dbQuery from './config.js';

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

const dbGetMonitorById = async (id) => {
  const GET_MONITOR = `
    SELECT * FROM monitor
    WHERE id = $1
  `;
  const errorMessage = 'Unable to fetch monitor by id from database.';

  const monitor = await handleDatabaseQuery(GET_MONITOR, errorMessage, id);
  return monitor[0];
};

const dbGetMonitorsByAPIKeyID = async (api_key_id) => {
  const GET_MONITORS = `
    SELECT * FROM monitor
    WHERE api_key_id = $1
  `;
  const errorMessage = 'Unable to fetch monitors by API key ID from the database.';

  const monitors = await handleDatabaseQuery(GET_MONITORS, errorMessage, api_key_id);
  return monitors;
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
  const columns = ['endpoint_key', 'schedule', 'type', 'api_key_id'];
  const values = [monitor.endpointKey, monitor.schedule, monitor.type, monitor.apiKeyId];

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

  const rows = await handleDatabaseQuery(UPDATE_FAILING, errorMessage, id);
  return rows[0];
};

const dbUpdateMonitorRecovered = async (id) => {
  const UPDATE_RECOVERY = `
    UPDATE monitor
    SET failing = false
    WHERE monitor.id = $1
    RETURNING *
  `;
  const errorMessage = 'Unable to update `failing` state in database.';

  const rows = await handleDatabaseQuery(UPDATE_RECOVERY, errorMessage, id);
  return rows[0];
};

const dbUpdateMonitor = async (id, monitor) => {
  const columns = ['name', 'schedule', 'command', 'tolerable_runtime'];
  const values = [monitor.name, monitor.schedule, monitor.command, monitor.tolerableRuntime];
  console.log(columns.map((col, index) => `${col} = $${index + 1}`).join(', '));
  const UPDATE = `
  UPDATE monitor
  SET ${columns.map((col, index) => `${col} = $${index + 1}`).join(', ')}
  WHERE id = $5
  RETURNING *;`;

  const errorMessage = 'Unable to update monitor in database.';

  const rows = await handleDatabaseQuery(UPDATE, errorMessage, ...values, id);
  return rows[0];
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

  const rows = await handleDatabaseQuery(ADD_RUN, errorMessage, data.monitorId, data.time, data.state, data.runToken, data.apiKeyId);
  return rows[0];
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

  const rows = await handleDatabaseQuery(GET_RUN, errorMessage, runToken);
  return rows[0];
};

const dbGetRunsByMonitorId = async (id, limit, offset) => {
  const GET_RUNS = `
    SELECT * FROM run
    WHERE monitor_id = $1
    ORDER BY time DESC
    LIMIT $2 OFFSET $3
  `;
  const errorMessage = 'Unable to fetch runs by monitor id from database.';

  return await handleDatabaseQuery(GET_RUNS, errorMessage, id, limit, offset);
};

const dbGetTotalRunsByMonitorId = async (id) => {
  const GET_TOTAL = `
    SELECT count(*) FROM run
    WHERE monitor_id = $1
  `;
  const errorMessage = 'Unable to fetch total runs by monitor id from database.';

  const rows = await handleDatabaseQuery(GET_TOTAL, errorMessage, id);
  return rows[0].count;
};

const dbGetAllUsernames = async () => {
  const GET_USERNAMES = `
    SELECT username FROM app_user
  `;
  const errorMessage = 'Unable to fetch usernames from database.';

  const rows = await handleDatabaseQuery(GET_USERNAMES, errorMessage);
  return rows.map(row => row.username);
};

const dbGetUserByUsername = async (username) => {
  const GET_USER = `
    SELECT * FROM app_user
    WHERE username = $1
  `;
  const errorMessage = 'Unable to fetch user by username from database.';

  const rows = await handleDatabaseQuery(GET_USER, errorMessage, username);
  return rows[0];
};

const dbAddUser = async (user) => {
  const ADD_USER = `
    INSERT INTO app_user (username, password_hash)
    VALUES ($1, $2)
  `;
  const errorMessage = 'Unable to add user to database.';

  await handleDatabaseQuery(ADD_USER, errorMessage, user.username, user.passwordHash);
};

const dbCallMaintenanceProcedure = async () => {
  const CALL_PROC = 'CALL rotate_runs()';
  const errorMessage = 'Unable to rotate runs';

  return await handleDatabaseQuery(CALL_PROC, errorMessage);
};

const dbAddAPIKey = async (hash, prefix) => {
  const columns = ['api_key_hash', 'prefix'];
  const values = [hash, prefix];

  const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

  const ADD_API_KEY = `
    INSERT INTO api_key (${columns})
    VALUES (${placeholders})
    RETURNING *`;
  const errorMessage = 'Unable to add a api key to database.';

  const rows = await handleDatabaseQuery(ADD_API_KEY, errorMessage, ...values);
  return rows[0];
};

const dbGetAPIKeyByIP = async (ip) => {
  const GET_API_KEY_BY_IP = `
    SELECT * FROM api_key
    WHERE ip = $1`;
  const errorMessage = 'Unable to retrieve the API key entry by IP.';

  const rows = await handleDatabaseQuery(GET_API_KEY_BY_IP, errorMessage, ip);
  return rows[0];
};

const dbDeleteNullIPAPIKeys = async () => {
  const DELETE_NULL_IP_ENTRIES = `
    DELETE FROM api_key
    WHERE ip IS NULL`;
  const errorMessage = 'Unable to delete entries with NULL IP from the database.';

  const rows = await handleDatabaseQuery(DELETE_NULL_IP_ENTRIES, errorMessage);
  return rows;
};

const dbUpdateAPIKeyIP = async (id, ip) => {
  const UPDATE_API_KEY_IP = `
    UPDATE api_key
    SET ip = $1
    WHERE id = $2
    RETURNING *`;
  const errorMessage = 'Unable to update the IP for the API key entry.';

  const rows = await handleDatabaseQuery(UPDATE_API_KEY_IP, errorMessage, ip, id);
  return rows[0];
};

const dbGetAPIKeyList = async () => {
  const GET_API_KEY = `
    SELECT * 
    FROM api_key
    ORDER BY ip ASC NULLS FIRST;`;

  const errorMessage = 'Unable to fetch api keys from database.';

  const rows = await handleDatabaseQuery(GET_API_KEY, errorMessage);
  return rows;
};

const dbChangeAPIKeyName = async(name, id) => {
  const CHANGE_NAME = `
    UPDATE api_key
    SET name=$1
    WHERE id=$2
    RETURNING *
  `

  const errorMessage = 'Unable to update api key name in database.';

  const rows = handleDatabaseQuery(CHANGE_NAME, errorMessage, name, id);
  return rows[0];
};

export {
  dbUpdateMonitorFailing,
  dbUpdateMonitorRecovered,
  dbGetMonitorById,
  dbGetMonitorsByAPIKeyID,
  dbGetMonitorByEndpointKey,
  dbGetAllMonitors,
  dbAddMonitor,
  dbUpdateMonitor,
  dbUpdateMonitorType,
  dbDeleteMonitor,
  dbAddRun,
  dbUpdateStartedRun,
  dbUpdateNoStartRun,
  dbGetRunByRunToken,
  dbGetRunsByMonitorId,
  dbGetTotalRunsByMonitorId,
  dbGetAllUsernames,
  dbGetUserByUsername,
  dbAddUser,
  dbCallMaintenanceProcedure,
  dbAddAPIKey,
  dbGetAPIKeyByIP,
  dbDeleteNullIPAPIKeys,
  dbUpdateAPIKeyIP,
  dbGetAPIKeyList,
  dbChangeAPIKeyName
};
