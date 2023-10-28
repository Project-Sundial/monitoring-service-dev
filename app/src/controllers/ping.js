import {
  dbGetMonitorByEndpointKey,
  dbUpdateMonitorType,
  dbUpdateMonitorRecovered,
  dbGetRunByRunToken,
  dbAddRun,
  dbUpdateStartedRun,
  dbUpdateNoStartRun,
  dbUpdateMonitorFailing,
} from '../db/queries.js';

import MissedPingsMq from '../db/MissedPingsMq.js';
import { calculateStartDelay, calculateSoloDelay, calculateEndDelay } from '../utils/calculateDelays.js';
import handleNotifications from '../notifications/handleNotifications.js';

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

    if (event === 'solo') {
      if (monitor.type !== 'solo') {
        await dbUpdateMonitorType('solo', monitor.id);
        await MissedPingsMq.removeStartJob(monitor.id);
      } else {
        await MissedPingsMq.removeSoloJob(monitor.id);
      }
      const delay = calculateSoloDelay(monitor);
      await MissedPingsMq.addSoloJob({ monitorId: monitor.id }, delay);

      await dbAddRun(runData);

      if (monitor.failing) {
        await dbUpdateMonitorRecovered(monitor.id);
        handleNotifications(monitor, runData);
      }
    }

    if (event === 'starting') {
      if (monitor.type !== 'dual') {
        await dbUpdateMonitorType('dual', monitor.id);
        await MissedPingsMq.removeSoloJob(monitor.id);
      } else {
        await MissedPingsMq.removeStartJob(monitor.id);
      }
      const startDelay = calculateStartDelay(monitor);
      await MissedPingsMq.addStartJob({ monitorId: monitor.id }, startDelay);

      const existingRun = await dbGetRunByRunToken(runData.runToken);
      if (existingRun) {
        if (existingRun.state === 'no_start') {
          runData.state = 'completed';
        } else {
          runData.state = 'failed';
        }
        const run = await dbUpdateNoStartRun(runData);
        console.log('updated existing: ', run);
      } else {
        const endDelay = calculateEndDelay(monitor);
        await MissedPingsMq.addEndJob({ runToken: runData.runToken, monitorId: monitor.id }, endDelay);
        const run = await dbAddRun(runData);
        console.log('created new:', run);
      }
    }

    if (event === 'ending') {
      const existingRun = await dbGetRunByRunToken(runData.runToken);
      if (existingRun) {
        await MissedPingsMq.removeEndJob(runData.runToken);
        const run = await dbUpdateStartedRun(runData);
        console.log('End updated: ', run);
      } else {
        runData.state = 'no_start';
        const run = await dbAddRun(runData);
        console.log('End created: ', run);
      }

      if (monitor.failing) {
        console.log('In ending ping monitor is no longer failing');
        await dbUpdateMonitorRecovered(monitor.id);
        handleNotifications(monitor, runData);
      }
    }

    if (event === 'failing') {
      const existingRun = await dbGetRunByRunToken(runData.runToken);
      if (existingRun) {
        await MissedPingsMq.removeEndJob(runData.runToken);
        await dbUpdateStartedRun(runData);
      } else {
        await dbAddRun(runData);
      }

      if (!monitor.failing) {
        await dbUpdateMonitorFailing(monitor.id);
        console.log('In failing ping monitor is now failing');
        handleNotifications(monitor, runData);
      }
    }

    console.log("Initial run data:", runData);
    res.status(200).send();
  } catch(error) {
    next(error);
  }
};

export {
  addPing
};
