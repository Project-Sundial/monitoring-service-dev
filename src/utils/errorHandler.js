export const errorLogger = (error, req, res, next) => { 
  console.error(error);
  next(error);
}

export const errorResponder = (error, req, res, next) => {
  res.header("Content-Type", 'application/json');
    
  const status = error.statusCode || 400;
  res.status(status).send(error.message);
}

export const invalidPathHandler = (req, res) => {
  res.redirect('/error');
}
