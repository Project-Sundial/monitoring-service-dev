import { nanoid } from 'nanoid';
import { dbGetAllMonitors, dbAddMonitor } from '../db/queries.js';

const getMonitors = async (req, res) => {
  try {
    const response = await dbGetAllMonitors();
    const monitors = response.rows;
    res.json(monitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch monitors.' });
  }
};

const addMonitor = async (req, res) => {
  const { schedule } = req.body;
  const endpoint_key = nanoid(10);
  try {
    const response = await dbAddMonitor([endpoint_key, schedule]);
    const monitor = response.rows[0];
//     const wrapperStr = createWrapper(id);
//     res.send(wrapperStr);
    res.json(monitor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create monitor.' });
  }
};


export {
  getMonitors,
  addMonitor,
};