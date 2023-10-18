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
  const { ...monitorData } = req.body;
  const endpoint_key = nanoid(10);

  const newMonitorData = {
    endpoint_key,
    ...monitorData
  };

  try {
    if (!newMonitorData.schedule) {
      return res.status(400).json({ error: 'Missing or incorrect schedule.' });
    }
    const response = await dbAddMonitor(newMonitorData);
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