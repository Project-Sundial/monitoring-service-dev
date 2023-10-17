import dbQuery from '../db/config.js';
import { nanoid } from 'nanoid';
import { queryGetAllMonitors, queryAddMonitor } from '../db/queries.js';

const getMonitors = async (req, res) => {
  try {
    const response = await dbQuery(queryGetAllMonitors);
    const monitors = response.rows;
    res.json(monitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch monitors.' });
  }
};

const addMonitor = async (req, res) => {
  const { schedule } = req.body;
  const endpoint_id = nanoid(10);
  try {
    const response = await dbQuery(queryAddMonitor, [endpoint_id, schedule]);
    const monitor = response.rows;
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