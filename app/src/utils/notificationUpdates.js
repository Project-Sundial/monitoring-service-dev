import { dbUpdateFailingMonitors } from '../db/queries.js';

const updateFailed = async (monitors) => {
  try {
    const ids = monitors.map(({ id }) => id);
    await dbUpdateFailingMonitors(ids);
  } catch (error) {
    console.log(error);
  }
};

export {
  updateFailed,
};
