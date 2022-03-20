import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const error = new Error("Not authenticated");
  error.statusCode = 400;

  if (!authHeader) {
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};

export default isAuth;
