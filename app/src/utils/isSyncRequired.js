import { dbGetMonitorById } from '../db/queries.js';

const isSyncRequired = async (id, newMonitor) => {
  const currentMonitor = await dbGetMonitorById(id);
  return ( newMonitor.command !== currentMonitor.command ||
           newMonitor.schedule !== currentMonitor.schedule );
};

export {
  isSyncRequired
};