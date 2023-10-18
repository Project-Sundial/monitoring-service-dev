import dbQuery from '../db/config.js';

const dbGetOverdue = () => {
  const GET_OVERDUE = 'SELECT * FROM monitor WHERE '
    + 'next_expected_at < $1';

  return dbQuery(GET_OVERDUE, new Date());
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
  dbAddMonitor,
  dbGetOverdue
};
