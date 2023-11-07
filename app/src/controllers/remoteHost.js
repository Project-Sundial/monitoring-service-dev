import { generateHash, compareWithHash } from '../utils/bcrypt.js';
import { dbAddAPIKey, dbGetAPIKeyList, dbChangeAPIKeyName } from '../db/queries.js';
import generateAPIKey from '../utils/generateAPIKey.js';

const addAPIKey = async (req, res, next) => {
    try {
        const apiKey = generateAPIKey();
        const hash = await generateHash(apiKey);

        const prefix = apiKey.slice(0, 8);

        let data = await dbAddAPIKey(hash, prefix);
        res.json({apiKey: apiKey, id: data.id, prefix: prefix, name: data.name, created_at: data.created_at});
    } catch(error) {
        next(error);
    }
};

const addName = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id);
        const {name} = req.body;
        await dbChangeAPIKeyName(name, id);
        res.status(200).send();
    } catch(error) {
        next(error);
    }
}

const verifyAPIKey = async (req, res, next) => {
    try {
        const apiKey = req;
        const apiKeyList = await dbGetAPIKeyList();

        const apiKeyCheck = apiKeyList.some(key => compareWithHash(apiKey, key.api_key_hash));
        return apiKeyCheck;
    } catch(error) {
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

export { addAPIKey, verifyAPIKey, addName, getAPIKeyList };