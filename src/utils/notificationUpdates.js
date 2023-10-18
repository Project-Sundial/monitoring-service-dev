import { dbMonitorFailure } from '../db/queries.js';

const update = async (rows) => {
  const ids = rows.map(({ id }) => id);
  return await dbMonitorFailure(ids);
};

export default update;
