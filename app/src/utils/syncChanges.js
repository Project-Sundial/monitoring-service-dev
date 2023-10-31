import { dbAddMonitor, dbDeleteMonitor, dbUpdateMonitor } from '../db/queries.js';

const syncChanges = async (stagedChanges) => {
  const sync = [];
  sync.push(dbSyncList(stagedChanges.add, dbAddMonitor));
  sync.push(dbSyncList(stagedChanges.delete.map((monitor) => monitor.id), dbDeleteMonitor));
  sync.push(dbSyncList(stagedChanges.update, dbUpdateMonitor));

  return Promise.allSettled(sync);
};

const dbSyncList = async (queued, action) => {
  const dbJobs = queued.map(monitor => action(monitor));
  return Promise.allSettled(dbJobs);
};

export {
  syncChanges
};