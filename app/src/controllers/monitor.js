import { nanoid } from 'nanoid';
import { dbGetAllMonitors, dbGetRunsByMonitorId, dbAddMonitor, dbDeleteMonitor, dbUpdateMonitor, dbGetTotalRunsByMonitorId, dbGetMonitorById, dbGetAPIKeyByIP, dbGetAPIKeyById } from '../db/queries.js';
import calculateTotalPages from '../utils/calculateTotalPages.js';
import { sendNewMonitor, sendUpdatedMonitor } from './sse.js';
import { isSyncRequired, syncCLI } from '../utils/cliSync.js';

const validMonitor = (monitor) => {
  if (typeof monitor !== 'object') {
    console.log(1);
    return false;
  }

  if (!monitor.apiKeyId|| typeof monitor.apiKeyId !== 'number') {
    console.log(2);
    return false;
  }

  if (!monitor.schedule || typeof monitor.schedule !== 'string') {
    console.log(3);
    return false;
  }

  if (!monitor.endpointKey || typeof monitor.endpointKey !== 'string' || monitor.endpointKey.length >= 25) {
    console.log(4);
    return false;
  }

  if (monitor.command && (typeof monitor.command !== 'string' || monitor.command.length >= 200)) {
    console.log(5);
    return false;
  }

  if (monitor.name && (typeof monitor.name !== 'string' || monitor.name.length >= 25)) {
    console.log(6);
    return false;
  }

  if (monitor.tolerableRuntime && (typeof monitor.tolerableRuntime !== 'string' || monitor.tolerableRuntime.length >= 10)) {
    console.log(7);
    return false;
  }

  return true;
};

const validUpdate = (monitor) => {
  if (typeof monitor !== 'object') {
    return false;
  }

  if (!monitor.schedule || typeof monitor.schedule !== 'string') {
    return false;
  }

  if (monitor.command && (typeof monitor.command !== 'string' || monitor.command.length >= 200)) {
    return false;
  }

  if (monitor.name && (typeof monitor.name !== 'string' || monitor.name.length >= 25)) {
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
    const totalRuns = await dbGetTotalRunsByMonitorId(id);
    const totalPages = calculateTotalPages(limit, totalRuns);

    res.json({
      runs,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

const addMonitor = async (req, res, next) => {
  try {
    const { ...monitorData } = req.body;
    const syncMode = req.headers['x-sync-mode'];
    const endpointKey = nanoid(10);

    let apiKeyId = monitorData.apiKeyId;
    if (!apiKeyId) {
      const apiKey = await dbGetAPIKeyByIP(monitorData.remoteIP);
      apiKeyId = apiKey.id;
    }

    const newMonitorData = {
      endpointKey,
      apiKeyId,
      ...monitorData
    };

    if (!validMonitor(newMonitorData)) {
      console.log(newMonitorData);
      const message = (!newMonitorData.schedule) ? 'Missing or incorrect schedule.' : 'Some monitor attribute has an incorrect input.';
      const error = new Error(message);
      error.statusCode = 400;
      throw error;
    }

    const monitor = await dbAddMonitor(newMonitorData);
    if (syncMode !== 'CLI') {
      await syncCLI(monitor);
    }
    sendNewMonitor(monitor);
    res.status(201).json(monitor);
  } catch (error) {
    next(error);
  }
};

const deleteMonitor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const syncMode = req.headers['x-sync-mode'];
    const deletedMonitor = await dbDeleteMonitor(id);

    if (!deletedMonitor) {
      const error = Error('Unable to find monitor associated with that id.');
      error.statusCode = 404;
      throw error;
    }

    if (syncMode !== 'CLI') {
      await syncCLI(deletedMonitor);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateMonitor = async (req, res, next) => {
  const { ...updatedMonitorData } = req.body;
  const id = req.params.id;
  const syncMode = req.headers['x-sync-mode'];
  const syncRequired = await isSyncRequired(id, updatedMonitorData);
  if (!validUpdate(updatedMonitorData)) {
    console.log(updatedMonitorData);
    const message = (!updatedMonitorData.schedule) ? 'Missing or incorrect schedule.' : 'Some monitor attribute has an incorrect input.';
    const error = new Error(message);
    error.statusCode = 400;
    return next(error);
  }

  try {
    const monitor = await dbUpdateMonitor(id, updatedMonitorData);

    if (syncRequired && syncMode !== 'CLI') {
      await syncCLI(monitor);
    }

    if (!monitor) {
      const error = Error('Unable to find monitor associated with that id.');
      error.statusCode = 404;
      throw error;
    }

    sendUpdatedMonitor(monitor);
    res.json(monitor);
  } catch (error) {
    next(error);
  }
};

const getMonitor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const monitor = await dbGetMonitorById(id);

    if (!monitor) {
      const error = Error('Unable to find monitor associated with that id.');
      error.statusCode = 404;
      throw error;
    }

    res.json(monitor);
  } catch (error) {
    next(error);
  }
};

export {
  getMonitors,
  getMonitor,
  getMonitorRuns,
  addMonitor,
  deleteMonitor,
  updateMonitor,
};
