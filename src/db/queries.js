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

const dbAddMonitor = (...params) => {
  const ADD_MONITOR = `
    INSERT INTO monitor (endpoint_key, schedule)
    VALUES ($1, $2)
    RETURNING *;`;

  return dbQuery(ADD_MONITOR,  params);
};

export {
  dbGetAllMonitors,
  dbAddMonitor,
  dbGetOverdue
};
