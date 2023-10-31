import { nanoid } from 'nanoid';
import { dbGetAllMonitors, dbGetRunsByMonitorId, dbAddMonitor, dbDeleteMonitor } from '../db/queries.js';

const queueSync = async (req, res, next) => {
  try {
    console.log('hi');
  } catch (error) {
    next(error);
  }
};

const sync = async (req, res, next) => {
  try {
    console.log('hi');
  } catch (error) {
    next(error);
  }
};

export {
  queueSync,
  sync
};
