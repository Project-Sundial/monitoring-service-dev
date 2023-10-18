import { nanoid } from 'nanoid';
import { dbGetAllMonitors, dbAddMonitor } from '../db/queries.js';

const getMonitors = async (req, res, next) => {
  try {
    const monitors = await dbGetAllMonitors();
    res.json(monitors);
  } catch (error) {
    next(error);
  }
};

const addMonitor = async (req, res, next) => {
  const { ...monitorData } = req.body;
  const endpoint_key = nanoid(10);

  const newMonitorData = {
    endpoint_key,
    ...monitorData
  };

  if (!newMonitorData.schedule) {
    const error = new Error('Schedule required.');
    error.statusCode = 400;
    error.statusMessage = 'Missing or incorrect schedule.';

    return next(error);
  }

  try {
    const monitor = await dbAddMonitor(newMonitorData);
    console.log('the monitor', monitor);
    res.json(monitor);
  } catch (error) {
    next(error);
  }
};

export {
  getMonitors,
  addMonitor,
};