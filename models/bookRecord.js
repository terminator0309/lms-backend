import mongoose from "mongoose";

const Schema = mongoose.Schema;

const user = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
});

const bookRecordSchema = new Schema({
  bookId: {
    type: mongoose.Types.ObjectId,
    ref: "Book",
  },
  issuedBy: [user],
  count: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("BookRecord", bookRecordSchema);
