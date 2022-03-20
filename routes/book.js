import express from "express";

import ash from "express-async-handler";

import * as bookController from "../controllers/book.js";
import isAdmin from "../middleware/isAdmin.js";
import isAuth from "../middleware/isAuth.js";

const bookRoutes = express.Router();

// add a book
bookRoutes.post("/addbook", bookController.addBook);

// edit book
bookRoutes.post("/editbook", isAuth, isAdmin, ash(bookController.editBook));

// get all the books
bookRoutes.get("/books", isAuth, bookController.getBooks);

// issue a book
bookRoutes.post("/issuebooks", isAuth, isAdmin, ash(bookController.issueBooks));

// return a book back to library
bookRoutes.post("/bookreturn", isAuth, isAdmin, ash(bookController.bookReturn));

// show issued books
bookRoutes.get("/booksissued", isAuth, bookController.booksIssued);

// get popular books
bookRoutes.get("/popularbooks", ash(bookController.popularBooks));

// search books by name
bookRoutes.post("/searchbooksbyname", bookController.searchBooksByName);

export default bookRoutes;
