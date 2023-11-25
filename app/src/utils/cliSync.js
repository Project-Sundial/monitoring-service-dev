import { dbGetMonitorById, dbGetAPIKeyById } from '../db/queries.js';
import { triggerSync } from '../services/cli.js';

const isSyncRequired = async (id, newMonitor) => {
  const currentMonitor = await dbGetMonitorById(id);
  return ( newMonitor.command !== currentMonitor.command ||
           newMonitor.schedule !== currentMonitor.schedule );
};

const syncCLI = async (monitor) => {
  const apiKeyId = monitor.api_key_id;
  const apiKey = await dbGetAPIKeyById(apiKeyId);
  const remoteIP = apiKey.ip;
  await triggerSync(remoteIP);
};

export {
  isSyncRequired,
  syncCLI
};