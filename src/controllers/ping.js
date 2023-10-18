import { dbGetMonitorByEndpointKey, dbMonitorRecovery, dbUpdateNextAlert } from '../db/queries.js';

const addPing = async (req, res) => {
  try {
    const endpoint_key = req.params.endpoint_key;
    const monitor = await dbGetMonitorByEndpointKey(endpoint_key);

    if (monitor.failing) {
      dbMonitorRecovery(monitor.id);
    }

    dbUpdateNextAlert(endpoint_key);
    res.status(200).send();
  } catch(e) {
    res.status(500).send('something went wrong');
  }
};

export {
  addPing
};
