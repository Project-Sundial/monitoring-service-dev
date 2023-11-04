import { generateHash, compareWithHash } from '../utils/bcrypt.js';
import { dbAddAPIKey, dbGetAPIKeyList, dbChangeAPIKeyName } from '../db/queries.js';
import generateAPIKey from '../utils/generateAPIKey.js';

const addAPIKey = async (req, res, next) => {
    try {
        const apiKey = generateAPIKey();
        const hash = await generateHash(apiKey);
        const apiKeyData = {hash};

        let data = await dbAddAPIKey(apiKeyData);
        res.status(201).send({apiKey: apiKey, id: data.id});
    } catch(error) {
        next(error);
    }
};

const addName = async (req, res, next) => {
    try {
        const {name, id} = req.body;
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

export { addAPIKey, verifyAPIKey, addName };