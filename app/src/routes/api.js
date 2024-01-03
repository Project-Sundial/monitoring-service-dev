import express from 'express';
const router = express.Router();
import { getMonitors, getMonitor, getMonitorRuns, addMonitor, deleteMonitor, updateMonitor } from '../controllers/monitor.js';
import { addPing } from '../controllers/ping.js';
import { getSse } from '../controllers/sse.js';
import error from './error.js';

import { addUser, userCount } from '../controllers/user.js';
import { login } from '../controllers/login.js';
import { getMachineList, addIP, addMachine, addName, getMachineMonitors, deleteMachine } from '../controllers/remoteHost.js';
import { updateRunErrorLog } from '../controllers/errorLog.js';

router.get('/monitors', getMonitors);
router.get('/monitors/:id', getMonitor);
router.get('/monitors/runs/:id', getMonitorRuns);
router.post('/monitors', addMonitor);
router.put('/monitors/:id', updateMonitor);
router.delete('/monitors/:id', deleteMonitor);

router.get('/sse', getSse);
router.get('/error', error);
router.put('/runs', updateRunErrorLog);

router.post('/pings/:endpoint_key', addPing);

router.post('/users', addUser);
router.get('/users/count', userCount);

router.post('/login', login);

router.get('/remote-host', getMachineList);
router.put('/remote-host', addIP);
router.post('/remote-host', addMachine);
router.put('/remote-host/:id', addName);
router.get('/remote-host/monitors', getMachineMonitors);
router.delete('/remote-host/:id', deleteMachine);


export default router;
