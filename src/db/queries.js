import dbQuery from '../db/config.js';

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
  dbAddMonitor
};
