import {
  dbGetMonitorByEndpointKey,
  dbUpdateMonitorRecovered,
  dbUpdateNextAlert,
  dbAddPing,
  dbAddRun,
  dbUpdateRun
} from '../db/queries.js';

/**
 Notes: 
  keep the endpoint_key in params for consistency

  maybe add monitor id to pings for data collection later?
  theres no convenient way to associate the pings to anything, except through finding out the runTokens of a specific monitor and then finding the pings associated with the run token which is maybe okay?

  what format will startTime be in?

  as of now an incoming ping does not notify if a job failed, only "started" and "completed" run states are set, "failed" is only possible if the run already exists and 

 ping: sendTime, runToken, event

 run: runTOken, monitorId, startTime, duration, state

get monitor id 
- verify it exists
is ping a part of a run?
  yes:
    start of run?
      startNewRun
      - start new run (monitor id, run token, starttime, state='started')
    end of run?
      updateRun
      - find by runtoken
      - update duration to  now - starttime
      - update state='completed' !!never failed as of now
  no:
    - nothing different
  always:
    addPing

 */
const startOfRun = (pingData) => {
  return !!pingData && pingData.event === 'start';
};

const endOfRun = (pingData) => {
  return !!pingData && pingData.event === 'end';
};

const validateMonitorExists = (monitor) => {
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
    validateMonitorExists(monitor);

    const pingData = req.body;
    if (startOfRun(pingData)) {
      await dbAddRun(pingData, monitor.id);
    }
    if (endOfRun(pingData)) {
      await dbUpdateRun(pingData);
    }

    await dbAddPing(pingData, monitor.id);

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
