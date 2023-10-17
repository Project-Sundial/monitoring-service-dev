
import executeQuery from './config.js';
import dbQuery from '../db/config.js';

// const dbAddMonitor = `
//   INSERT INTO monitor (endpoint_key, schedule, command)
//   VALUES ($1, $2, $3)
//   RETURNING *;
// `;

const getOverdue = async () => {
  const GET_OVERDUE = 'SELECT * FROM monitor WHERE '
    + 'next_expected_at < $1';
  const result = await executeQuery(GET_OVERDUE, new Date());

  return result;
};

const dbGetAllMonitors = () => {
  return dbQuery('SELECT * FROM monitor');
};

const dbAddMonitor = (params) => {
  return dbQuery(`
    INSERT INTO monitor (endpoint_key, schedule)
    VALUES ($1, $2)
    RETURNING *;`, 
    params);
};

export {
  dbGetAllMonitors,
  dbAddMonitor,
  getOverdue

};
