import {
  dbGetMonitorByEndpointKey,
  dbUpdateMonitorRecovered,
  dbUpdateNextAlert,
  dbAddPing,
  dbAddRun,
  dbUpdateRun
} from '../db/queries.js';
import generateRunToken from '../utils/generateRunToken.js';

const startOfRun = (pingData) => {
  return !!pingData && pingData.event === 'start';
};

const endOfRun = (pingData) => {
  return !!pingData && pingData.event === 'end';
};

const handleMissingMonitor = (monitor) => {
  if (!monitor) {
    const error = new Error('Unable to find monitor associated with that endpoint.');
    error.statusCode = 404;
    throw error;
  }
};

const addPing = async (req, res, next) => {
  try {
    const endpoint_key = req.params.endpoint_key;
    const monitor = await dbGetMonitorByEndpointKey(endpoint_key);
    handleMissingMonitor(monitor);

    const pingData = req.body;
    console.log(pingData);

    if (startOfRun(pingData)) {
      console.log('start');
      const run = await dbAddRun(pingData, monitor.id, 'started');
      console.log(run);
    } else if (endOfRun(pingData)) {
      console.log('end');
      const run = await dbUpdateRun(pingData);
      console.log(run);
    } else {
      console.log('single');
      pingData.event = 'single';
      pingData.runToken = generateRunToken();
      pingData.sendTime = new Date();
      const run = await dbAddRun(pingData, monitor.id, 'completed');
      console.log(run);
    }

    const ping = await dbAddPing(pingData);
    console.log(ping);

    if (monitor.failing) {
      await dbUpdateMonitorRecovered(monitor.id);
    }

    const newMonitor = await dbUpdateNextAlert(monitor);
    console.log(newMonitor);
    res.status(200).send();
  } catch(error) {
    next(error);
  }
};

export {
  addPing
};
