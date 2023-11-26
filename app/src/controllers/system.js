import { dbGetSystemIP, dbAddSystemIP, dbDeleteSystemEntries } from '../db/queries.js';

const addSystemIP = async (req, res, next) => {
  try {
    const { ip } = req.body;
    await dbDeleteSystemEntries();
    await dbAddSystemIP(ip);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

const getSystemIP = async (req, res, next) => {
  try {
    const { ip } = await dbGetSystemIP();
    res.json(ip);
  } catch (error) {
    next(error);
  }
};

export { addSystemIP, getSystemIP };