export const errorLogger = (error, req, res, next) => {
  console.error(error);
  next(error);
};

export const errorResponder = (error, req, res, next) => {
  res.header('Content-Type', 'application/json');

  let status;
  if (!error.statusCode) {
    status = 500;
    error.message = 'Internal Server Error';
  } else {
    status = error.statusCode;
  }

  return res.status(status).send({
    message: error.message
  });
};

export const invalidPathHandler = (req, res) => {
  if (!res._headerSent) {
    res.redirect('/api/error');
  }
};
