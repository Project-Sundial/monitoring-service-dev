import {
  dbGetMonitorByEndpointKey,
  dbUpdateMonitorRecovered,
  dbUpdateNextAlert,
  dbAddPing,
} from '../db/queries.js';

const addPing = async (req, res, next) => {
  try {
    const endpoint_key = req.params.endpoint_key;
    const monitor = await dbGetMonitorByEndpointKey(endpoint_key);
    if (!monitor) {
      const error = new Error('Unable to find monitor associated with that endpoint.');
      error.statusCode = 404;
      throw error;
    }

    await dbAddPing(monitor.id);

    if (monitor.failing) {
      await dbUpdateMonitorRecovered(monitor.id);
    }

    await dbUpdateNextAlert(monitor);
    res.status(200).send();
  } catch(error) {
    next(error);
  }
};

export {
  addPing
};
