import dotenv from "dotenv";

import { connect } from "./db/index.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

connect()
  .then(() => {
    app.listen(PORT, () => console.log("Listening at PORT: ", PORT));
  })
  .catch((err) => console.log(err));
