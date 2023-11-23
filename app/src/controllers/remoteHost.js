import { generateHash } from '../utils/bcrypt.js';
import { dbUpdateAPIKeyIP, dbGetMonitorsByAPIKeyID, dbDeleteNullIPAPIKeys, dbAddAPIKey, dbGetAPIKeyList, dbChangeAPIKeyName } from '../db/queries.js';
import generateAPIKey from '../utils/generateAPIKey.js';
import { getToken, findUnregisteredAPIKey } from '../utils/register.js';

const addAPIKey = async (req, res, next) => {
  try {
    const apiKey = generateAPIKey();
    const hash = await generateHash(apiKey);

    const prefix = apiKey.slice(0, 8);

    await dbDeleteNullIPAPIKeys();
    let data = await dbAddAPIKey(hash, prefix);
    res.json({ apiKey: apiKey, id: data.id, prefix: prefix, name: data.name, created_at: data.created_at });
  } catch(error) {
    next(error);
  }
};

const addName = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const { name } = req.body;
    await dbChangeAPIKeyName(name, id);
    res.status(200).send();
  } catch(error) {
    next(error);
  }
};

const addIP = async (req, res, next) => {
  try {
    const { remoteIP } = req.body;
    const apiKey = getToken(req);
    console.log(apiKey);
    const id = await findUnregisteredAPIKey(apiKey);
    console.log(id);

    if (id === null) {
      throw new Error('API key not found or not registered.');
    }

    await dbUpdateAPIKeyIP(id, remoteIP);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

const getAPIKeyList = async (req, res, next) => {
  try {
    const list = await dbGetAPIKeyList();
    res.json(list);
  } catch(error) {
    next(error);
  }
};

const getAPIKeyMonitors = async (req, res, next) => {
  try {
    const { id } = req.body;
    const list = await dbGetMonitorsByAPIKeyID(id);
    res.json(list);
  } catch(error) {
    next(error);
  }
};

export { addAPIKey, addName, addIP, getAPIKeyList, getAPIKeyMonitors };
