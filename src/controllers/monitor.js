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

const addMonitor = async (req, res, next) => {
  const { ...monitorData } = req.body;
  const endpoint_key = nanoid(10);

  const newMonitorData = {
    endpoint_key,
    ...monitorData
  };

  try {
    if (!newMonitorData.schedule) {
      const error = new Error("Schedule required.")

      error.statusCode = 400
      error.statusMessage = 'Missing or incorrect schedule.';

      throw error;
    }
    const response = await dbAddMonitor(newMonitorData);
    const monitor = response.rows[0];
    // const wrapperStr = createWrapper(id);
    // res.send(wrapperStr);
    res.json(monitor);
  } catch (error) {
    if (error.statusCode === 400) {
      next(error);
    } else {
      res.status(500).json({ error: 'Unable to create monitor.' });
    }
  }
};


export {
  getMonitors,
  addMonitor,
};