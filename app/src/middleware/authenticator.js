import jwt from 'jsonwebtoken';
import { verifyAPIKey } from '../controllers/remoteHost.js';

const getToken = (request) => {
  const authorization = request.get('authorization');
  console.log(authorization);
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

const authenticator = async (request, response, next) => {
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
    next(error);
  }

  next();
};

export default authenticator;
