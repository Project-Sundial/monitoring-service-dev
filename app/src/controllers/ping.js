import {
  dbGetMonitorByEndpointKey,
  dbUpdateMonitorRecovered,
  dbUpdateNextAlert,
  dbGetRunByRunToken,
  dbAddRun,
  dbUpdateRun,
} from '../db/queries.js';

const handleMissingMonitor = (monitor) => {
  if (!monitor) {
    const error = new Error('Unable to find monitor associated with that endpoint.');
    error.statusCode = 404;
    throw error;
  }
};


/*
ping
  endpointKey path param
  event query param
  { time: Date.now(), runToken: string }
*/

const eventToState = {
  'solo': 'solo_completed',
  'starting': 'started',
  'failing': 'failed',
  'ending': 'completed',
};

const formatRunData = (id, event, body ) => {
  return {
    monitorId: id,
    time: body.time || Date.now(),
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
      // alter solo job queue
      await dbAddRun(runData);
    }

    if (event === 'starting') {
      // alter starting job queue
      // alter ending job queue
      await dbAddRun(runData);
    }

    if (event === 'failing' || event === 'ending') {
      const existingRun = await dbGetRunByRunToken(runData.runToken);

      if (existingRun) {
        // alter end job queue
        await dbUpdateRun(existingRun.id, runData);
      } else {
        runData.state = 'no_start';
        await dbAddRun(runData);
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
