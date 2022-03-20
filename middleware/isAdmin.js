import User from "../models/user.js";

const isAdmin = (req, res, next) => {
  const userId = req.userId;
  User.findOne({ _id: userId }).then((user) => {
    if (!user.isAdmin) {
      const error = new Error("Not an admin");
      error.statusCode = 402;
      throw error;
    } else next();
  });
};
export default isAdmin;
