import jwt, { verify } from 'jsonwebtoken';
import { compareWithHash } from '../utils/bcrypt';
import { verifyAPIKey } from '../controllers/remoteHost';

const getToken = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

const authenticator = async (request, response, next) => {
  const token = getToken(request);

  if (token) {
    const prefix = token.slice(0, 4);
    let decodedToken;

    if (prefix === 'pfx_') {
      decodedToken = await verifyAPIKey();
    } else {
      decodedToken = jwt.verify(token, process.env.SECRET);
    }
  }



  if (!decodedToken || !decodedToken.id) {
    const error = new Error('Missing or invalid token.');
    error.statusCode = 401;
    next(error);
  }

  next();
};

export default authenticator;
