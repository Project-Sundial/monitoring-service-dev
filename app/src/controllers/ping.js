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
import { sendNewRun, sendUpdatedMonitor, sendUpdatedRun } from './sse.js';

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

      const newRun = await dbAddRun(runData);
      sendNewRun(newRun);

      if (monitor.failing) {
        const updatedMonitor = await dbUpdateMonitorRecovered(monitor.id);
        sendUpdatedMonitor(updatedMonitor);
        handleNotifications(updatedMonitor, runData);
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
        const updatedRun = await dbUpdateNoStartRun(runData);
        sendUpdatedRun(updatedRun);
      } else {
        const endDelay = calculateEndDelay(monitor);
        await MissedPingsMq.addEndJob({ runToken: runData.runToken, monitorId: monitor.id }, endDelay);
        const newRun = await dbAddRun(runData);
        sendNewRun(newRun);
      }
    }

    if (event === 'ending') {
      const existingRun = await dbGetRunByRunToken(runData.runToken);
      if (existingRun && existingRun.state === 'started') {
        await MissedPingsMq.removeEndJob(runData.runToken);
        const updatedRun = await dbUpdateStartedRun(runData);
        sendUpdatedRun(updatedRun);
      } else if (existingRun && existingRun.state === 'unresolved') {
        runData.state = 'overran';
        const updatedRun = await dbUpdateStartedRun(runData);
        sendUpdatedRun(updatedRun);
      } else {
        runData.state = 'no_start';
        const newRun = await dbAddRun(runData);
        sendNewRun(newRun);
      }

      if (monitor.failing && runData.state !== 'overran') {
        const updatedMonitor = await dbUpdateMonitorRecovered(monitor.id);
        sendUpdatedMonitor(updatedMonitor);
        handleNotifications(updatedMonitor, runData);
      }
    }

    if (event === 'failing') {
      const existingRun = await dbGetRunByRunToken(runData.runToken);
      if (existingRun) {
        await MissedPingsMq.removeEndJob(runData.runToken);
        const updatedRun = await dbUpdateStartedRun(runData);
        sendUpdatedRun(updatedRun);
      } else {
        const newRun = await dbAddRun(runData);
        sendNewRun(newRun);
      }

      if (!monitor.failing) {
        const updatedMonitor = await dbUpdateMonitorFailing(monitor.id);
        sendUpdatedMonitor(updatedMonitor);
        handleNotifications(updatedMonitor, runData);
      }
    }

    res.status(200).send();
  } catch(error) {
    next(error);
  }
};

export {
  addPing
};
