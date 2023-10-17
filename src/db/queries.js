import executeQuery from './config.js';
import dbQuery from '../db/config.js';
import parser from 'cron-parser';

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

const dbUpdateNextExpected = async (endpoint_key, currentDate) => {
  const schedule = await dbQuery(
    `SELECT schedule 
    FROM monitor
    WHERE endpoint_key = ${endpoint_key}
  `);

  const nextExpectedAt = parser.parseExpression(
    schedule,
    { currentDate: new Date() }
  );

  return dbQuery(`
    UPDATE monitor
    SET next_expected_at = $2
    WHERE endpoint_key = $1;`,
  [endpoint_key, nextExpectedAt]);
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
  dbUpdateNextExpected,
  getOverdue
};
