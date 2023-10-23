export const errorLogger = (error, req, res, next) => {
  console.error(error);
  next(error);
};

export const errorResponder = (error, req, res, next) => {
  res.header('Content-Type', 'application/json');

  let status;
  if (!error.statusCode) {
    console.log('Internal Server Error: ', error);
    status = 500;
    error.message = 'Internal Server Error';
  } else {
    status = error.statusCode;
  }

  res.status(status).send({
    message: error.message
  });
};

export const invalidPathHandler = (req, res) => {
  res.redirect('/error');
};
