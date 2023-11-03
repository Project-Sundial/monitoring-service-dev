import { generateHash } from '../utils/bcrypt.js';
import { dbAddAPIKey, dbGetAPIKey } from '../db/queries.js';

const addAPIKey = async (req, res, next) => {
    try {
        const { apiKey, name } = req.body;
        const hash = await generateHash(apiKey);
        const apiKeyData = {hash};

        if (name) {
            apiKeyData.name = name;
        }

        await dbAddAPIKey(apiKeyData);
        res.status(201).send();
    } catch(error) {
        next(error);
    }
};

const verifyAPIKey = async (req, res, next) => {
    try {
        const apiKey = req.body;
        const hash = await generateHash(apiKey);
        const apiKeyCheck = await dbGetAPIKey(hash);

        if (apiKeyCheck) {
            res.status(200).send();
        }

        res.status(403).send();
    } catch(error) {
        next(error);
    }
};

export { addAPIKey, verifyAPIKey };