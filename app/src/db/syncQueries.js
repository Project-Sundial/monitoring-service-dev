import { dbAddMonitor, dbDeleteMonitor } from './queries.js';

const dbSync = async (queuedChanges) => {
  const sync = [];
  sync.push(dbSyncList(queuedChanges.add, dbAddMonitor));
  sync.push(dbSyncList(queuedChanges.delete.map((monitor) => monitor.id), dbDeleteMonitor));
  await dbSyncList(queuedChanges.add, dbAddMonitor);

  Promise.allSettled(monitorJobs);
};

const dbSyncList = async (queued, action) => {
  const dbJobs = queued.map(monitor => action(monitor));
  return Promise.allSettled(dbJobs);
};
