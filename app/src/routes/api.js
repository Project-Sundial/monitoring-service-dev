import express from 'express';
const router = express.Router();
import { getMonitors, getMonitorRuns, addMonitor, deleteMonitor } from '../controllers/monitor.js';
import { addPing } from '../controllers/ping.js';
import { getUpdates, addJob, syncUpdates } from '../controllers/scheduler.js';

router.get('/monitors', getMonitors);
router.get('/monitors/:id', getMonitorRuns);
router.post('/monitors', addMonitor);
router.delete('/monitors/:id', deleteMonitor);

router.post('/pings/:endpoint_key', addPing);

router.post('/jobs', addJob);
router.get('/updates', getUpdates);
router.post('/synced', syncUpdates);

export default router;
