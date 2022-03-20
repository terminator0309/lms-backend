import mongoose from "mongoose";
import { Mockgoose } from "mockgoose";

export function connect(URI) {
  const DB_URI = process.env.MONGODB_URI;
  return new Promise((resolve, reject) => {
    // if (process.env.NODE_ENV === "test") {
    //   const mockgoose = new Mockgoose(mongoose);

    //   mockgoose.prepareStorage().then(() => {
    //     mongoose.connect(DB_URI, { useNewUrlParser: true }).then((res, err) => {
    //       if (err) return reject(err);
    //       resolve();
    //     });
    //   });
    // } else {

    mongoose.connect(DB_URI, { useNewUrlParser: true }).then((res, err) => {
      if (err) return reject(err);
      console.log("Connected to DB");
      resolve();
    });
    // }
  });
}

export function close() {
  return mongoose.disconnect();
}
