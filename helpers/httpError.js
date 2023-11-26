const HttpError = (status, message) => {
  const error = new Error(message);
  console.log("error", error);
  error.status = status;
  return error;
};

module.exports = HttpError;
