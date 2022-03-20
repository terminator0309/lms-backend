import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  edition: {
    type: Number,
    default: 1,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model("Book", bookSchema);
