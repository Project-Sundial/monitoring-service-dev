import {
  dbGetMonitorByEndpointKey,
  dbUpdateMonitorType,
  // dbUpdateMonitorRecovered,
  // dbUpdateNextAlert,
  dbGetRunByRunToken,
  dbAddRun,
  dbUpdateRun,
} from '../db/queries.js';

import MissedPingsMq from '../db/MissedPingsMq.js';
import { nextScheduledRun } from '../utils/cronParser.js';

const handleMissingMonitor = (monitor) => {
  if (!monitor) {
    const error = new Error('Unable to find monitor associated with that endpoint.');
    error.statusCode = 404;
    throw error;
  }
};

const eventToState = {
  'solo': 'solo_completed',
  'starting': 'started',
  'failing': 'failed',
  'ending': 'completed',
};

const formatRunData = (id, event, body) => {
  return {
    monitorId: id,
    time: body.time || new Date(),
    runToken: body.runToken || null,
    state: eventToState[event],
  };
};

const addPing = async (req, res, next) => {
  try {
    const endpointKey = req.params.endpoint_key;
    const monitor = await dbGetMonitorByEndpointKey(endpointKey);
    handleMissingMonitor(monitor);
    const event = req.query.event;
    const runData = formatRunData(monitor.id, event, req.body);

    console.log(runData)
    if (event === 'solo') {
      const calculateDelay = (monitor) => {
        const runTime = nextScheduledRun(monitor.schedule)._date.ts +
          ((monitor.grace_period + monitor.tolerable_runtime) * 1000); // milliseconds from epoch
      
        return (runTime - Date.now()) / 1000; // delay in seconds
      };
      if (monitor.type !== 'solo') {
        await dbUpdateMonitorType('solo', id);
        await MissedPingsMq.removeStartJob(monitor.id);
      } else {
        await MissedPingsMq.removeSoloJob(monitor.id);
      }

      await dbAddRun(runData);
      await MissedPingsMq.addSoloJob({monitorId: monitor.id}, calculateDelay);
    }

    if (event === 'starting') {
      // alter starting job queue
      // alter ending job queue
      const res = await dbAddRun(runData);
      console.log(res);
    }

    if (event === 'failing' || event === 'ending') {
      const existingRun = await dbGetRunByRunToken(runData.runToken);

      if (existingRun) {
        // alter end job queue
        const res = await dbUpdateRun(existingRun.id, runData);
        console.log(res);
      } else {
        runData.state = 'no_start';
        console.log(runData);

        const res = await dbAddRun(runData);
        console.log(res);
      }
    }

    // if (monitor.failing) {
    //   await dbUpdateMonitorRecovered(monitor.id);
    // }

    // const newMonitor = await dbUpdateNextAlert(monitor);
    // console.log(newMonitor);
    res.status(200).send();
  } catch(error) {
    next(error);
  }
};

export {
  addPing
};
