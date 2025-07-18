export const successResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

export const errorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  res.status(statusCode).json({ error: error.message });
};

export const notFoundResponse = (res, message = "Resource not found") => {
  res.status(404).json({ error: message });
};
