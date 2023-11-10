import { dbGetAPIKeyList } from '../db/queries';
import { compareWithHash } from './bcrypt';

export const getToken = (request) => {
  const authorization = request.get('authorization');
  console.log(authorization);
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

export const findUnregisteredAPIKey = async (apiKey) => {
  const key = await findAPIKey(apiKey);
  return key.ip ? key.id : null;
};


export const findAPIKey = async (apiKey) => {
  const apiKeyList = await dbGetAPIKeyList();

  const comparePromises = apiKeyList.map(async (key) => {
    const result = await compareWithHash(apiKey, key.api_key_hash);
    return result ? key : null;
  });

  const matchingKeys = await Promise.all(comparePromises);
  const firstMatchingKey = matchingKeys.filter(key => key !== null)[0];
  return firstMatchingKey || undefined; // Return undefined if no matching key is found.
};
