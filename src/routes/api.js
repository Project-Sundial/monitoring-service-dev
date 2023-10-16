import express from 'express';
const router = express.Router();
import { nanoid } from 'nanoid';

router.post('/endpoint/:id', (req, res) => {
  const body = req.body;
  console.log(body);

  res.status(200).end();
});

router.get('/monitors', async(req, res) => {
  try {
    const monitors = await getMonitors();
    res.send(monitors);
  } catch (e) {
    res.status(500).send('unable to get all monitors');
  }
});

router.post('/monitors', (req, res) => {
  const body = req.body; 
  const id = nanoid(10);

  try {
    createMonitor(body, id);
    const wrapperStr = createWrapper(id);
    res.send(wrapperStr);
  } catch(e) {
    res.send(500).send('unable to create monitor');
  }
});

export default router;