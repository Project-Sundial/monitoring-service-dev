import jwt from 'jsonwebtoken';
import { dbGetAPIKeyList } from '../db/queries.js';
import { compareWithHash } from '../utils/bcrypt.js';

const getToken = (request) => {
  const authorization = request.get('authorization');
  console.log(authorization);
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

const verifyAPIKey = async (apiKey) => {
  const apiKeyList = await dbGetAPIKeyList();

  const promises = apiKeyList.map(key => {
    return compareWithHash(apiKey, key.api_key_hash).then(result => {
      if (result) {
        return result;
      } else {
        return Promise.reject(result);
      }
    });
  });

  const result = await Promise.any(promises);
  return result;
};

const authenticator = async (request, response, next) => {
  try {
    const token = getToken(request);
    let decodedToken;
    let prefix;

    if (token) {
      prefix = token.slice(0, 4);

      if (prefix === 'pfx_') {
        decodedToken = await verifyAPIKey(token);
      } else {
        decodedToken = jwt.verify(token, process.env.SECRET);
      }
    }

    if (!decodedToken || (!decodedToken.id && prefix !== 'pfx_')) {
      const error = new Error('Missing or invalid token.');
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      error.message = 'Expired session.';
      error.statusCode = 401;
    } else if (error instanceof AggregateError) {
      error.message = 'No matching API Key.';
      error.statusCode = 401;
    }

    next(error);
  }
};

export default authenticator;
