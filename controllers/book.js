import Book from "../models/book.js";
import User from "../models/user.js";
import BookRecord from "../models/bookRecord.js";
import mongoose from "mongoose";
import {
  fillBooksDate,
  // returnDateOfBook,
  // convertDate,
  // diffDays,
  // months,
} from "../utils/issuedBooks.js";
import _ from "lodash";

export const addBook = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const author = req.body.author;
  const edition = req.body.edition || 1;
  const quantity = req.body.quantity || 1;
  const description = req.body.description || "";

  const newBook = new Book({
    name: name,
    price: price,
    author: author,
    edition: edition,
    quantity: quantity,
    description: description,
  });

  newBook
    .save()
    .then((result) => {
      const newRecord = new BookRecord({ bookId: result._id });
      return newRecord.save();
    })
    .then(() => {
      res.status(200).json({
        message: "Book added successfully",
      });
    })
    .catch((err) => next(err));
};

export const editBook = async (req, res, next) => {
  const bookId = req.body.book._id;

  const book = await Book.findOne({ _id: bookId });
  book.name = req.body.book.name;
  book.price = req.body.book.price;
  book.edition = req.body.book.edition;
  book.author = req.body.book.author;
  book.quantity = req.body.book.quantity;
  book.description = req.body.book.description;

  await book.save();

  res.status(200).json({ message: "Book edited successfully" });
};

export const getBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((err) => next(err));
};

export const issueBooks = async (req, res, next) => {
  const selectedBooks = req.body.books;
  const candidateEmail = req.body.email;

  // candidate is the person(student) who wants the books to be issued

  const candidate = await User.findOne({ email: candidateEmail });

  if (!candidate) {
    const error = new Error("Not a valid candidate");
    error.statusCode = 404;
    throw error;
  }

  // maximum 5 books can be issued
  if (candidate.booksIssued.length + selectedBooks.length > 5) {
    const error = new Error("Cannot issue more than 5 books !");
    error.statusCode = 406; // NOT ACCEPTABLE
    throw error;
  }

  // checking if candidate has already issued the book or not
  // one user cannot issue the same book again

  selectedBooks.forEach((selectedBook) => {
    candidate.booksIssued.forEach((issuedBook) => {
      if (issuedBook.bookId.equals(selectedBook._id)) {
        const error = new Error(
          "Cannot issue the same book again! Return the book before issuing it again."
        );
        error.statusCode = 400;
        throw error;
      }
    });
  });

  // decreasing the quantity
  for (const selectedBook of selectedBooks) {
    const filter = { _id: selectedBook._id };
    const update = { $inc: { quantity: -1 } };
    await Book.findOneAndUpdate(filter, update);
  }

  // adding the issuing of book to the records
  for (const selectedBook of selectedBooks) {
    const filter = { bookId: selectedBook._id };
    const update = {
      $push: { issuedBy: { userId: candidate._id, issudeDate: new Date() } },
      $inc: { count: 1 },
    };

    await BookRecord.findOneAndUpdate(filter, update);
  }

  // issuing the book to candidate
  for (const selectedBook of selectedBooks) {
    candidate.booksIssued.push({ bookId: selectedBook._id });
  }

  await candidate.save();

  res.status(200).json({
    message: "Books issued successfully",
  });
};

export const bookReturn = async (req, res, next) => {
  const candidateEmail = req.body.email;
  const bookId = req.body.bookId;

  const candidate = await User.findOne({ email: candidateEmail });
  const book = await Book.findOne({ _id: bookId });

  candidate.booksIssued = candidate.booksIssued.filter(
    (bookIssued) => !bookIssued.bookId.equals(bookId)
  );
  await candidate.save();

  book.quantity += 1;
  await book.save();

  res.status(200).json({ message: "Book returned successfully" });
};

export const booksIssued = (req, res, next) => {
  const userId = req.userId;
  User.findOne({ _id: mongoose.Types.ObjectId(userId) })
    .then((user) => {
      return user.populate("booksIssued.bookId");
    })
    .then((user) => {
      res
        .status(200)
        .json(
          fillBooksDate(_.cloneDeep(JSON.parse(JSON.stringify(user._doc))))
        );
    })
    .catch((err) => next(err));
};

export const popularBooks = async (req, res, next) => {
  const books = await BookRecord.find()
    .sort({ count: -1 })
    .limit(4)
    .select("bookId count")
    .populate("bookId");

  res.status(200).json(books);
};

export const searchBooksByName = (req, res, next) => {
  const searchQuery = req.body.query;

  Book.find({
    name: new RegExp(".*" + searchQuery + ".*", "i"),
    quantity: { $gt: 0 },
  })
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((err) => next(err));
};
