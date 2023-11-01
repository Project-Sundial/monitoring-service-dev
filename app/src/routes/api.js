import express from 'express';
const router = express.Router();
import { getMonitors, getMonitorRuns, addMonitor, deleteMonitor, updateMonitor } from '../controllers/monitor.js';
import { addPing } from '../controllers/ping.js';

router.get('/monitors', getMonitors);
router.get('/monitors/:id', getMonitorRuns);
router.post('/monitors', addMonitor);
router.put('/monitors/:id', updateMonitor);
router.delete('/monitors/:id', deleteMonitor);

router.post('/pings/:endpoint_key', addPing);

export default router;
