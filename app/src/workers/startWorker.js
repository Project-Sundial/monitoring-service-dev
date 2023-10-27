import MissedPingsMq from '../db/MissedPingsMq.js';
import { dbGetMonitorById, dbAddRun, dbUpdateMonitorFailing } from '../db/queries.js';
import { calculateStartDelay } from '../utils/calculateDelays.js';
import handleNotifications from '../notifications/handleNotifications.js';

const handleMissingMonitor = (monitor) => {
  if (!monitor) {
    const error = new Error('startWorker: No monitor associated with that id.');
    throw error;
  }
};

const startWorker = async (job) => {
  console.log('startWorker triggerd: ', job);
  try {
    const monitor = await dbGetMonitorById(job.data.monitorId);
    handleMissingMonitor(monitor);

    const runData = {
      monitorId: monitor.id,
      time: new Date(),
      state: 'missed',
      runToken: null,
    };

    if (!monitor.failing) {
      await dbUpdateMonitorFailing(monitor.id);
      handleNotifications(monitor, runData);
    }

    await dbAddRun(runData);
    await MissedPingsMq.addStartJob({ monitorId: monitor.id }, calculateStartDelay(monitor));
  } catch (error) {
    console.error(error);
  }
};

export default startWorker;
