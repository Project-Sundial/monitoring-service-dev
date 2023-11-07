import { generateHash, compareWithHash } from '../utils/bcrypt.js';
import { dbAddAPIKey, dbGetAPIKeyList, dbChangeAPIKeyName } from '../db/queries.js';
import generateAPIKey from '../utils/generateAPIKey.js';

const addAPIKey = async (req, res, next) => {
  try {
    const apiKey = generateAPIKey();
    const hash = await generateHash(apiKey);

    const prefix = apiKey.slice(0, 8);

    let data = await dbAddAPIKey(hash, prefix);
    res.status(201).send({ apiKey: apiKey, id: data.id, prefix: prefix });
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

const verifyAPIKey = async (req, res, next) => {
  try {
    const apiKey = req;
    const apiKeyList = await dbGetAPIKeyList();

    const promises = apiKeyList.map(key => {
      return compareWithHash(apiKey, key.api_key_hash).then(result => {
        console.log(`Promise settled with result ${result}`);
        if (result) {
          return result;
        } else {
          return new Promise.reject(result);
        }
      });
    });

    const result = await Promise.any(promises);
    return result;
  } catch(error) {
    next(error);
  }

};

export { addAPIKey, verifyAPIKey, addName };
