export const errorLogger = (error, req, res, next) => {
  console.error(error, 'from error logger');
  next(error);
};

export const errorResponder = (error, req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const status = error.statusCode || 400;
  res.status(status).send(error.message);
};

export const invalidPathHandler = (req, res) => {
  res.redirect('/error');
};
