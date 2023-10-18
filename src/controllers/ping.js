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
      throw new Error('Unable to find monitor associated with that endpoint.');
    }

    dbAddPing(monitor.id);

    if (monitor.failing) {
      dbUpdateMonitorRecovered(monitor.id);
    }

    dbUpdateNextAlert(monitor);
    res.status(200).send();
  } catch(error) {
    console.log(error.message, "The error from the last catch block");

    next(error);
  }
};

export {
  addPing
};
