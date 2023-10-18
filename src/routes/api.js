import express from 'express';
const router = express.Router();
import { getMonitors, addMonitor } from '../controllers/monitor.js';
import { addPing } from '../controllers/ping.js';

router.get('/monitors', getMonitors);
router.post('/monitors', addMonitor);

router.post('/pings/:endpoint_key', addPing);

export default router;
