import {
  dbGetMonitorByEndpointKey,
  dbMonitorRecovery,
  dbUpdateNextAlert,
  dbAddPing,
} from '../db/queries.js';

const addPing = async (req, res) => {
  try {
    const endpoint_key = req.params.endpoint_key;
    const monitor = await dbGetMonitorByEndpointKey(endpoint_key);

    dbAddPing(monitor.id);

    if (monitor.failing) {
      dbMonitorRecovery(monitor.id);
    }

    dbUpdateNextAlert(endpoint_key);
    res.status(200).send();
  } catch(error) {
    res.status(500).send(error);
  }
};

export {
  addPing
};
