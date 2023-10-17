import { nanoid } from 'nanoid';
import { dbGetAllMonitors, dbAddMonitor } from '../db/queries.js';
// import { createWrapper, parse } from '../utils/cronJobs.js';

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
  // const { cronJob } = req.body;
  // const { schedule, command } = parseCronJob(cronJob);
  const { schedule } = req.body;
  const endpoint_key = nanoid(10);
  try {
    // await dbQuery(queryAddMonitor, [endpoint_id, schedule, command]);
    // const wrapperStr = createWrapper(endpoint_id, schedule, command);
    // res.send(wrapperStr);
    const response = await dbAddMonitor([endpoint_key, schedule]);
    const monitor = response.rows[0];
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