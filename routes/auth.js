import express from "express";

import ash from "express-async-handler";

import {
  signup,
  login,
  getUser,
  isUser,
  makeAdmin,
  getBooksIssuedByUser,
  getUserDetails,
} from "../controllers/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import isAuth from "../middleware/isAuth.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);

// used to re-login if the page is reloaded and token is found
authRoutes.get("/user", isAuth, getUser);

// gets the books issued by a user
authRoutes.post("/booksissuedbyuser", ash(getBooksIssuedByUser));

authRoutes.post("/isuser", isAuth, isAdmin, isUser);

// gets the user record
authRoutes.post("/userdetails", ash(getUserDetails));

// give a user admin rights
authRoutes.post("/makeadmin", isAuth, isAdmin, makeAdmin);

export default authRoutes;
