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

const dbGetMonitorsByMachineID = async (machine_id) => {
  const GET_MONITORS = `
    SELECT * FROM monitor
    WHERE machine_id = $1
  `;
  const errorMessage = 'Unable to fetch monitors by Machine ID from the database.';

  const monitors = await handleDatabaseQuery(GET_MONITORS, errorMessage, machine_id);
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
  const columns = ['endpoint_key', 'schedule', 'type', 'machine_id'];
  const values = [monitor.endpointKey, monitor.schedule, monitor.type, monitor.machineId];

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

  const rows = await handleDatabaseQuery(ADD_RUN, errorMessage, data.monitorId, data.time, data.state, data.runToken);
  return rows[0];
};

const dbHandleStartPing = async (data) => {
  const HANDLE_START = `
    INSERT INTO run (monitor_id, time, state, run_token)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (run_token) DO UPDATE 
    SET duration = (run.time - $2),
    time = $2,
    state = CASE
      WHEN run.state = 'no_start' THEN 'completed'
      ELSE run.state
    END
    RETURNING *
  `;
  const errorMessage = 'Unable to handle start ping in database';

  const rows = await handleDatabaseQuery(HANDLE_START, errorMessage, data.monitorId, data.time, data.state, data.runToken);
  return rows[0];
};

const dbHandleEndPing = async (data) => {
  const HANDLE_END = `
    INSERT INTO run (monitor_id, time, state, run_token)
    VALUES ($1, $2, 'no_start'::states, $4)
    ON CONFLICT (run_token) DO UPDATE 
    SET duration = ($2 - run.time),
    state = CASE
      WHEN run.state = 'unresolved' THEN 'overran'::states
      ELSE $3
    END
    RETURNING *
  `;
  const errorMessage = 'Unable to handle end ping in database';

  const rows = await handleDatabaseQuery(HANDLE_END, errorMessage, data.monitorId, data.time, data.state, data.runToken);
  return rows[0];
};

const dbHandleFailPing = async (data) => {
  const HANDLE_FAIL = `
    INSERT INTO run (monitor_id, time, state, run_token)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (run_token) DO UPDATE 
    SET duration = ($2 - run.time),
    state = $3
    RETURNING *, case WHEN xmax::text::int > 0 THEN 'updated' ELSE 'inserted' END
  `;
  const errorMessage = 'Unable to handle fail ping in database';

  const rows = await handleDatabaseQuery(HANDLE_FAIL, errorMessage, data.monitorId, data.time, data.state, data.runToken);
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

const dbUpdateRunErrorLog = async (data) => {
  const UPDATE_RUN = `
    UPDATE run
    SET error_log = $1
    WHERE run_token = $2
    RETURNING *
  `;
  const errorMessage = 'Unable to update run error log in database.';

  const rows = await handleDatabaseQuery(UPDATE_RUN, errorMessage, data.error_log, data.run_token);
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

const dbAddMachine = async (hash, prefix) => {
  const columns = ['api_key_hash', 'prefix'];
  const values = [hash, prefix];

  const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

  const ADD_MACHINE = `
    INSERT INTO machine (${columns})
    VALUES (${placeholders})
    RETURNING *`;
  const errorMessage = 'Unable to add machine key to database.';

  const rows = await handleDatabaseQuery(ADD_MACHINE, errorMessage, ...values);
  return rows[0];
};

const dbGetMachineById = async (id) => {
  const GET_MACHINE_BY_ID = `
    SELECT * FROM machine
    WHERE id = $1`;
  const errorMessage = 'Unable to retrieve the machine entry by ID.';

  const rows = await handleDatabaseQuery(GET_MACHINE_BY_ID, errorMessage, id);
  return rows[0];
};

const dbGetMachineByIP = async (ip) => {
  const GET_MACHINE_BY_IP = `
    SELECT * FROM machine
    WHERE ip = $1`;
  const errorMessage = 'Unable to retrieve the machine entry by IP.';

  const rows = await handleDatabaseQuery(GET_MACHINE_BY_IP, errorMessage, ip);
  return rows[0];
};

const dbGetMachineByNullIP = async () => {
  const GET_MACHINE_BY_NULL_IP = `
    SELECT * FROM machine
    WHERE ip IS NULL
    LIMIT 1`;
  const errorMessage = 'Unable to retrieve the machine entry by IP.';

  const rows = await handleDatabaseQuery(GET_MACHINE_BY_NULL_IP, errorMessage);
  return rows[0]; // This will return the first entry with a NULL IP or undefined if none is found
};

const dbDeleteMachine = async (id) => {
  const DELETE_MACHINE = `
    DELETE FROM machine
    WHERE id = $1
    RETURNING *
  `;
  const errorMessage = 'Unable to delete machine from the database.';

  const rows = await handleDatabaseQuery(DELETE_MACHINE, errorMessage, id);
  return rows[0];
};

const dbDeleteNullIPMachines = async () => {
  const DELETE_NULL_IP_ENTRIES = `
    DELETE FROM machine
    WHERE ip IS NULL`;
  const errorMessage = 'Unable to delete entries with NULL IP from the database.';

  const rows = await handleDatabaseQuery(DELETE_NULL_IP_ENTRIES, errorMessage);
  return rows;
};

const dbUpdateMachineIP = async (id, ip) => {
  const UPDATE_MACHINE_IP = `
    UPDATE machine
    SET ip = $1
    WHERE id = $2
    RETURNING *`;
  const errorMessage = 'Unable to update the IP for the machine entry.';

  const rows = await handleDatabaseQuery(UPDATE_MACHINE_IP, errorMessage, ip, id);
  return rows[0];
};

const dbGetMachineList = async () => {
  const GET_MACHINE = `
    SELECT * 
    FROM machine
    ORDER BY ip ASC NULLS FIRST;`;

  const errorMessage = 'Unable to fetch machines from database.';

  const rows = await handleDatabaseQuery(GET_MACHINE, errorMessage);
  return rows;
};

const dbUpdateMachineName = async(name, id) => {
  const UPDATE_NAME = `
    UPDATE machine
    SET name=$1
    WHERE id=$2
    RETURNING *
  `;

  const errorMessage = 'Unable to update machine name in database.';

  const rows = await handleDatabaseQuery(UPDATE_NAME, errorMessage, name, id);
  return rows[0];
};

export {
  dbUpdateMonitorFailing,
  dbUpdateMonitorRecovered,
  dbGetMonitorById,
  dbGetMonitorsByMachineID,
  dbGetMonitorByEndpointKey,
  dbGetAllMonitors,
  dbAddMonitor,
  dbUpdateMonitor,
  dbUpdateMonitorType,
  dbDeleteMonitor,
  dbAddRun,
  dbHandleStartPing,
  dbHandleEndPing,
  dbHandleFailPing,
  dbUpdateStartedRun,
  dbUpdateRunErrorLog,
  dbGetRunByRunToken,
  dbGetRunsByMonitorId,
  dbGetTotalRunsByMonitorId,
  dbGetAllUsernames,
  dbGetUserByUsername,
  dbAddUser,
  dbCallMaintenanceProcedure,
  dbAddMachine,
  dbGetMachineById,
  dbGetMachineByIP,
  dbGetMachineByNullIP,
  dbDeleteMachine,
  dbDeleteNullIPMachines,
  dbUpdateMachineIP,
  dbGetMachineList,
  dbUpdateMachineName,
};
