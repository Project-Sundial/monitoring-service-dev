import MissedPingsMq from '../db/MissedPingsMq.js';
import { dbGetMonitorById, dbAddRun, dbUpdateMonitorFailing } from '../db/queries.js';
import { calculateSoloDelay } from '../utils/calculateDelays.js';
import handleNotifications from '../notifications/handleNotifications.js';
import { sendNewRun, sendUpdatedMonitor } from '../controllers/sse.js';

const handleMissingMonitor = (monitor) => {
  if (!monitor) {
    const error = new Error('soloWorker: No monitor associated with that id.');
    throw error;
  }
};

const startWorker = async (job) => {
  console.log('soloWorker triggerd: ', job);
  try {
    const monitor = await dbGetMonitorById(job.data.monitorId);
    handleMissingMonitor(monitor);

    const runData = {
      monitorId: monitor.id,
      time: new Date(),
      state: 'solo_missed',
      runToken: null,
    };

    if (!monitor.failing) {
      const updatedMonitor = await dbUpdateMonitorFailing(monitor.id);
      sendUpdatedMonitor(updatedMonitor);
      handleNotifications(updatedMonitor, runData);
    }

    const newRun = await dbAddRun(runData);
    sendNewRun(newRun);
    await MissedPingsMq.addSoloJob({ monitorId: monitor.id }, calculateSoloDelay(monitor));
  } catch (error) {
    console.error(error);
  }
};

export default startWorker;
