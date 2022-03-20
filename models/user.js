import mongoose from "mongoose";
const Schema = mongoose.Schema;

const booksIssued = new Schema({
  bookId: {
    type: mongoose.Types.ObjectId,
    ref: "Book",
  },
  issuedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  booksIssued: [booksIssued],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", userSchema);
