export const errorLogger = (error, req, res, next) => {
  console.error(error, 'in error logger');
  next(error);
};

export const errorResponder = (error, req, res) => {
  res.setHeader('Content-Type', 'application/json');
  console.log('in error responder');

  const status = error.statusCode || 400;
  res.status(status).send(error.message);
};

export const invalidPathHandler = (req, res) => {
  res.redirect('/error');
};
