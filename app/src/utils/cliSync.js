import { dbGetMonitorById, dbGetMachineById } from '../db/queries.js';
import { triggerSync } from '../services/cli.js';

const isSyncRequired = async (id, newMonitor) => {
  const currentMonitor = await dbGetMonitorById(id);
  return ( newMonitor.command !== currentMonitor.command ||
           newMonitor.schedule !== currentMonitor.schedule );
};

const syncCLI = async (monitor) => {
  const machineId = monitor.machine_id;
  const machine = await dbGetMachineById(machineId);
  const remoteIP = machine.ip;
  await triggerSync(remoteIP);
};

export {
  isSyncRequired,
  syncCLI
};