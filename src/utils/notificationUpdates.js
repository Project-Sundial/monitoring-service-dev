import { dbMonitorsFailure } from '../db/queries.js';

const update = async (rows) => {
  const ids = rows.map(({ id }) => id);
  if (ids.length !== 0) {
    await dbMonitorsFailure(ids);
  }
};

export {
  update,
};
