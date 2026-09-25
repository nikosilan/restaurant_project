const errorHandler = (error, _request, response, _next) => {
  console.error(error);
  response
    .status(500)
    .json({ error: "The server could not complete the request." });
};

export default errorHandler;
