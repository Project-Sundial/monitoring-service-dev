import { dbUpdateFailingMonitors } from '../db/queries.js';

const update = async (rows) => {
  const ids = rows.map(({ id }) => id);
  if (ids.length !== 0) {
    try {
      await dbUpdateFailingMonitors(ids);
    } catch (error) {
      console.log(error);
    }
  }
};

export {
  update,
};
