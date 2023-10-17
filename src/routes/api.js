import express from 'express';
const router = express.Router();
import { getMonitors, addMonitor } from '../controllers/monitor.js';

router.post('/endpoint/:id', (req, res) => {
  const body = req.body;
  console.log(body);

  res.status(200).end();
});

router.get('/monitors', getMonitors);
router.post('/monitors', addMonitor);

export default router;