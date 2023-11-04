import express from 'express';
const router = express.Router();
import { getMonitors, getMonitor, getMonitorRuns, addMonitor, deleteMonitor, updateMonitor } from '../controllers/monitor.js';
import { addPing } from '../controllers/ping.js';
import { addUser, userCount } from '../controllers/user.js';
import { login } from '../controllers/login.js';
import { addAPIKey, addName } from '../controllers/remoteHost.js';

router.get('/monitors', getMonitors);
router.get('/monitors/:id', getMonitor);
router.get('/monitors/runs/:id', getMonitorRuns);
router.post('/monitors', addMonitor);
router.put('/monitors/:id', updateMonitor);
router.delete('/monitors/:id', deleteMonitor);

router.post('/pings/:endpoint_key', addPing);

router.post('/users', addUser);
router.get('/users/count', userCount);

router.post('/login', login);

router.get('/remote-host', addAPIKey);
router.post('/remote-host', addName);

export default router;
