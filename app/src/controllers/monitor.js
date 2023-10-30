import { nanoid } from 'nanoid';
import { dbGetAllMonitors, dbGetRunsByMonitorId, dbAddMonitor, dbDeleteMonitor } from '../db/queries.js';

const validMonitor = (monitor) => {
  if (typeof monitor !== 'object') {
    return false;
  }

  if (!monitor.schedule || typeof monitor.schedule !== 'string') {
    return false;
  }

  if (!monitor.endpointKey || typeof monitor.endpointKey !== 'string' || monitor.endpointKey.length >= 25) {
    return false;
  }

  if (monitor.command && (typeof monitor.command !== 'string' || monitor.command.length >= 200)) {
    return false;
  }

  if (monitor.name && (typeof monitor.name !== 'string' || monitor.name.length >= 25)) {
    return false;
  }

  if (monitor.tolerableRuntime && (typeof monitor.tolerableRuntime !== 'string' || monitor.tolerableRuntime.length >= 10)) {
    return false;
  }

  return true;
};

const getMonitors = async (req, res, next) => {
  try {
    const monitors = await dbGetAllMonitors();
    res.json(monitors);
  } catch (error) {
    next(error);
  }
};

const getMonitorRuns = async (req, res, next) => {
  try {
    const id = req.params.id;
    const limit = req.query.limit;
    const offset = req.query.offset;
    const runs = await dbGetRunsByMonitorId(id, limit, offset);
    res.json(runs);
  } catch (error) {
    next(error);
  }
};

const addMonitor = async (req, res, next) => {
  const { ...monitorData } = req.body;
  const endpointKey = nanoid(10);

  const newMonitorData = {
    endpointKey,
    ...monitorData
  };

  if (!validMonitor(newMonitorData)) {
    const message = (!newMonitorData.schedule) ? 'Missing or incorrect schedule.' : 'Some monitor attribute has an incorrect input.';
    const error = new Error(message);
    error.statusCode = 400;
    return next(error);
  }

  try {
    const monitor = await dbAddMonitor(newMonitorData);
    res.json(monitor);
  } catch (error) {
    next(error);
  }
};

const deleteMonitor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedMonitor = await dbDeleteMonitor(id);

    if (!deletedMonitor) {
      const error = Error('Unable to find monitor associated with that id.');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export {
  getMonitors,
  getMonitorRuns,
  addMonitor,
  deleteMonitor,
};
