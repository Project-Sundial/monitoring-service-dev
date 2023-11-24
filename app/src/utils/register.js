import { dbGetAPIKeyList, dbGetAPIKeyByNullIP } from '../db/queries.js';
import { compareWithHash } from './bcrypt.js';

export const getToken = (request) => {
  const authorization = request.get('authorization');
  console.log(authorization);
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '').trim();
  }
  return null;
};

export const findUnregisteredAPIKey = async (apiKey) => {
  const key = await dbGetAPIKeyByNullIP();
  const result = await compareWithHash(apiKey, key.api_key_hash);

  if (result) {
    return key.id;
  }
};

export const findAPIKey = async (apiKey) => {
  const apiKeyList = await dbGetAPIKeyList();

  console.log(apiKeyList);
  const comparePromises = apiKeyList.map(async (key) => {
    const result = await compareWithHash(apiKey, key.api_key_hash);
    return result ? key : null;
  });

  const matchingKeys = await Promise.all(comparePromises);
  console.log(matchingKeys);
  const firstMatchingKey = matchingKeys.filter(key => key !== null)[0];
  return firstMatchingKey || undefined; // Return undefined if no matching key is found.
};
