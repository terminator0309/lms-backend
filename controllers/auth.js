import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";

import User from "../models/user.js";
import {
  fillBooksDate,
  returnDateOfBook,
  convertDate,
  diffDays,
  months,
} from "../utils/issuedBooks.js";
import BookRecord from "../models/bookRecord.js";

export const signup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        const error = new Error("Email already exists");
        error.statusCode = 400;
        throw error;
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const newUser = new User({
        name: name,
        password: hashedPassword,
        email: email,
      });
      return newUser.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "User created successfully!",
        userId: result._id,
      });
    })
    .catch((err) => next(err));
};

export const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    const error = new Error("Email or password not provided");
    error.statusCode = 400;
    throw error;
  }

  // res.send({ token: "", userId: "" });
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 400;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 400;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_KEY,
        { expiresIn: "30d" }
      );

      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
        user: loadedUser,
      });
    })
    .catch((err) => next(err));
};

export const makeAdmin = (req, res, next) => {
  const email = req.body.email;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("No user found");
        error.statusCode = 404;
        throw error;
      }

      user.isAdmin = true;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Admin permissions granted" });
    })
    .catch((err) => next(err));
};

export const getUser = (req, res, next) => {
  const userId = req.userId;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new Error("No user found");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json(user);
    })
    .catch((err) => next(err));
};

export const isUser = (req, res, next) => {
  const candidateEmail = req.body.email;

  User.findOne({ email: candidateEmail })
    .then((user) => {
      if (!user) {
        const err = new Error("No user found");
        err.statusCode = 404;
        throw err;
      }

      res.status(200).json({ isUser: true, message: "User found" });
    })
    .catch((err) => next(err));
};

export const getBooksIssuedByUser = async (req, res, next) => {
  const candidateEmail = req.body.email;
  const candidate = await User.findOne({ email: candidateEmail })
    .select({ password: 0 })
    .populate("booksIssued.bookId");

  if (!candidate) {
    const err = new Error("No user found");
    err.statusCode = 404;
    throw err;
  }

  res
    .status(200)
    .json(
      fillBooksDate(_.cloneDeep(JSON.parse(JSON.stringify(candidate._doc))))
    );
};

export const getUserDetails = async (req, res, next) => {
  const candidateEmail = req.body.email;
  const candidate = await User.findOne({ email: candidateEmail });
  if (!candidate) {
    const err = new Error("No user found");
    err.statusCode = 404;
    throw err;
  }
  const bookRecords = await BookRecord.find({
    issuedBy: { $elemMatch: { userId: candidate._id } },
  }).populate("bookId");

  var userDetails = [];

  for (let record of bookRecords) {
    let book = {
      _id: record.bookId._doc._id,
      name: record.bookId._doc.name,
      author: record.bookId._doc.author,
    };
    for (let issueDetail of record.issuedBy) {
      if (candidate._id.equals(issueDetail.userId))
        userDetails.push({
          bookId: book,
          issueDate: convertDate(issueDetail.issueDate),
        });
    }
  }
  const sortByDate = (a, b) => {
    return new Date(b.issueDate) - new Date(a.issueDate);
  };
  userDetails.sort(sortByDate);
  console.log(userDetails);
  res.status(200).send(userDetails);
};
