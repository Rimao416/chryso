const AppError = require("./../utils/appError");

const handleJWTExpiredError = () =>
  new AppError("Le token a expiré, connectez vous à nouveau", 401);

const handleJWTError = () =>
  new AppError("Token Invalide, Conntectez vous encore", 401);

const handleCastErrorDB = (err) => {
  const message = `Invalid Id ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicatesDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Valeur de champ en double : ${value}, entrez une nouvelle valeur`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // const message = errors.join("\n");
  // console.log(err)
  return new AppError(errors, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    console.log(err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      type: err?.type,
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Erreur inattendue",
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack)

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // let error = { ...err }; VERSION ORIDGINALE
    let error = err; //Version qui marche
    console.log(error);
    console.log(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatesDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
