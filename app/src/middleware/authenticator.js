import jwt from 'jsonwebtoken';

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

const authenticator = (request, response, next) => {
  const token = getTokenFrom(request);
  let decodedToken;
  if (token) {
    decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  }

  if (!decodedToken || !decodedToken.id) {
    const error = new Error('Missing or invalid token.');
    error.statusCode = 401;
    next(error);
  }

  next();
};

export default authenticator;
