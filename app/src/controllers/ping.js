import {
  dbGetMonitorByEndpointKey,
  dbUpdateMonitorType,
  dbUpdateMonitorRecovered,
  dbAddRun,
  dbUpdateMonitorFailing,
  dbHandleStartPing,
  dbHandleEndPing,
  dbHandleFailPing,
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
    console.log('Run received: ', runData);

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
      console.log(`Added job to start queue with delay ${startDelay}:`, runData);

      const run = await dbHandleStartPing(runData);
      if (run.state === 'started') {
        console.log('Added run: ', run, 'For new run: ', runData);
        const endDelay = calculateEndDelay(monitor);
        await MissedPingsMq.addEndJob({ runToken: runData.runToken, monitorId: monitor.id }, endDelay);
        console.log(`Added job to end queue with delay ${endDelay}:`, runData);
        sendNewRun(run);
      } else {
        console.log('Updated run: ', run, 'For new run: ', runData);
        sendUpdatedRun(run);
      }
    }

    if (event === 'ending') {
      const run = await dbHandleEndPing(runData);
      if (run.state === 'completed') {
        console.log('Updated run: ', run, 'For new run: ', runData);
        await MissedPingsMq.removeEndJob(runData.runToken);
        sendUpdatedRun(run);
      } else if (run.state === 'no_start') {
        console.log('Added run: ', run, 'For new run: ', runData);
        sendNewRun(run);
      } else {
        console.log('Updated run: ', run, 'For new run: ', runData);
        sendUpdatedRun(run);
      }

      if (monitor.failing && run.state !== 'overran') {
        const updatedMonitor = await dbUpdateMonitorRecovered(monitor.id);
        sendUpdatedMonitor(updatedMonitor);
        handleNotifications(updatedMonitor, runData);
      }
    }

    if (event === 'failing') {
      const run = await dbHandleFailPing(runData);
      if (run.case === 'updated') {
        await MissedPingsMq.removeEndJob(runData.runToken);
        sendUpdatedRun(run);
      } else {
        sendNewRun(run);
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
