import { nanoid } from 'nanoid';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { dbGetAllMonitors, dbGetRunsByMonitorId, dbAddMonitor, dbDeleteMonitor } from '../db/queries.js';

// workflow:

// in app route:

// queueSync
// filter item
// IF the task is a delete, add or if the update is changing the schedule or command do below
//         app creates endpointKey for new jobs
//         store in "unsyncedUpdates" variable
//         ping daemon
//     ELSE
//         refresh UI
//     ALWAYS updateDB

// set variable

// 3 helpers
//     add monitors iterate through and add
//     delete iterate through and delete
//     update iterate through and delete

// ping daemon


// sync
// respond with variable

const stagedChanges = {
  add: [],
  delete: [],
  update: [],
};

const stageChanges = async (req, res, next) => {
  try {
    const { ...jobData } = req.body;
    const endpointKey = nanoid(10);

    const newJobData = {
      endpointKey,
      ...jobData
    };

    cache.push(newJobData);
    console.log('cache data:', cache);

    //hard coded for now
    await axios.post('http://host.docker.internal:56789/trigger-sync');
    console.log('Pinging the http server');
    res.send(200);
  } catch (error) {
    next(error);
  }
  
  try {
    console.log('hi');
  } catch (error) {
    next(error);
  }
};

const getChanges = async (req, res, next) => {
  try {
    res.send(stagedChanges);
  } catch (error) {
    next(error);
  }
};

export {
  stageChanges,
  getChanges
};


// workflow:

// in app route:

// queueSync
// filter item
// IF the task is a delete, add or if the update is changing the schedule or command do below
//         app creates endpointKey for new jobs
//         store in "unsyncedUpdates" variable
//         ping daemon
//     ELSE
//         refresh UI
//     ALWAYS updateDB

// set variable

// 3 helpers
//     add monitors iterate through and add
//     delete iterate through and delete
//     update iterate through and delete

// ping daemon

const addJob = async (req, res, next) => {
  try {
    const { ...jobData } = req.body;
    const endpointKey = nanoid(10);

    const newJobData = {
      endpointKey,
      ...jobData
    };

    cache.push(newJobData);
    console.log('cache data:', cache);

    //hard coded for now
    await axios.post('http://host.docker.internal:56789/trigger-sync');
    console.log('Pinging the http server');
    res.send(200);
  } catch (error) {
    next(error);
  }
};

const getUpdates = (req, res, next) => {
  try {
    console.log('Getting updates from backend to send to CLI', cache);
    res.send(cache);
  } catch (error) {
    next(error);
  }
};

// const syncUpdates = (req, res, next) => {
//   try {
//     console.log('Successful crontab update for job with endpoint_key:', req.body);
//     res.send(200);
//   } catch (error) {
//     next(error);
//   }
// };

export {
  getUpdates,
  addJob,
  // syncUpdates,
};
