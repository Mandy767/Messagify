// 404 error handler
exports.get404 = (req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
};

// global error handler
exports.global = (error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  console.log(error);
  const data = error.data;
  res.status(status).json({ message: message, data: data });
};
