import express from 'express';
const router = express.Router();
import { getMonitors, getMonitorRuns, addMonitor, deleteMonitor } from '../controllers/monitor.js';
import { addPing } from '../controllers/ping.js';
import { stageChanges, getChanges } from '../controllers/scheduler.js';

router.get('/monitors', getMonitors);
router.get('/monitors/:id', getMonitorRuns);
router.post('/monitors', addMonitor);
router.put('/monitors/:id', deleteMonitor);
router.delete('/monitors/:id', deleteMonitor);

router.post('/scheduler/staged', stageChanges);
router.get('/scheduler/staged', getChanges);
// router.post('/scheduler/sync', syncChanges);

router.post('/pings/:endpoint_key', addPing);

export default router;
