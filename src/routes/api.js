import express from 'express';
const router = express.Router();
import { getMonitors, addMonitor, deleteMonitor } from '../controllers/monitor.js';
import { addPing } from '../controllers/ping.js';

router.get('/monitors', getMonitors);
router.post('/monitors', addMonitor);
router.delete('/monitors/:id', deleteMonitor);

router.post('/pings/:endpoint_key', addPing);

export default router;
