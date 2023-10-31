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

const queuedChanges = {
  add: [],
  delete: [],
  update: [],
};

const queueSync = async (req, res, next) => {
  try {
    console.log('hi');
  } catch (error) {
    next(error);
  }
};

const sync = async (req, res, next) => {
  try {
    res.send(queuedChanges);
  } catch (error) {
    next(error);
  }
};

export {
  queueSync,
  sync
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