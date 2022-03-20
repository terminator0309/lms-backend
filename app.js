import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/book.js";

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.options("*", cors());

app.use("/auth", authRoutes);
app.use("/", bookRoutes);

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ message: error.message });
});

export default app;
