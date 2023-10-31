import express from 'express';
const router = express.Router();
import { getMonitors, getMonitorRuns, addMonitor, deleteMonitor } from '../controllers/monitor.js';
import { addPing } from '../controllers/ping.js';
import { queueSync, sync } from '../controllers/sync.js';

router.get('/monitors', getMonitors);
router.get('/monitors/:id', getMonitorRuns);
router.post('/monitors', addMonitor);
router.delete('/monitors/:id', deleteMonitor);

router.post('/scheduler-sync', queueSync);
router.get('/scheduler-sync', sync);

router.post('/pings/:endpoint_key', addPing);

export default router;
