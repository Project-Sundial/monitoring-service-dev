import { dbGetMonitorById, dbUpdateMonitorFailing, dbUpdateStartedRun } from '../db/queries.js';
import handleNotifications from '../notifications/handleNotifications.js';

const handleMissingMonitor = (monitor) => {
  if (!monitor) {
    const error = new Error('endWorker: No monitor associated with that id.');
    throw error;
  }
};

const endWorker = async (job) => {
  console.log('endWorker triggered: ', job);
  try {
    const monitor = await dbGetMonitorById(job.data.monitorId);
    handleMissingMonitor(monitor);

    const runData = {
      runToken: job.data.runToken,
      time: new Date(),
      state: 'unresolved',
    };

    if (!monitor.failing) {
      await dbUpdateMonitorFailing(monitor.id);
      handleNotifications(monitor, runData);
    }

    await dbUpdateStartedRun(runData);
  } catch (error) {
    console.error(error);
  }
};

export default endWorker;
