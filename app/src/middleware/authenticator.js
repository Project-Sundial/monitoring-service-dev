import jwt from 'jsonwebtoken';

const getToken = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

const authenticator = (request, response, next) => {
  try {
    console.log(request.originalUrl);
    const token = getToken(request);
    console.log(token);
    let decodedToken;
    if (token) {
      decodedToken = jwt.verify(token, process.env.SECRET);
    }

    if (!decodedToken || !decodedToken.id) {
      const error = new Error('Missing or invalid token.');
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      error.message = 'Expired session.';
      error.statusCode = 401;
    }

    next(error);
  }
};

export default authenticator;
