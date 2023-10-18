import { dbMonitorFailure } from '../db/queries.js';

const update = (rows) => {
  const ids = rows.map(({ id }) => id);
  return dbMonitorFailure(ids);
};

export default update;
