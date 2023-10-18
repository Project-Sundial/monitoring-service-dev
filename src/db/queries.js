import dbQuery from '../db/config.js';

const dbGetOverdue = async () => {
  const GET_OVERDUE = 'SELECT * FROM monitor WHERE '
    + 'next_expected_at < $1';

  const result = await dbQuery(GET_OVERDUE, new Date());

  return result;
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

export {
  dbGetAllMonitors,
  dbAddMonitor,
  dbGetOverdue
};
