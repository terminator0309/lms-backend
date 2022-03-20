process.env.NODE_ENV = "test";

import request from "supertest";
import dotenv from "dotenv";

import app from "./app.js";
import { connect, close } from "./db/index.js";

dotenv.config();

const loginDetails = {
  email: "sandeep@user.com",
  password: "sandeep",
};

describe("POST /auth/login", () => {
  describe("Given a email and password", () => {
    beforeAll((done) => {
      connect()
        .then(() => done())
        .catch((err) => done(err));
    });

    test("should respond with a 200 status code", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ ...loginDetails });

      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content type header", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ ...loginDetails });

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("response has userId and token", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ ...loginDetails });

      expect(response.body.userId).toBeDefined();
      expect(response.body.token).toBeDefined();
    });
  });
  describe("When the email and password  is missing", () => {
    test("should respond with a status code of 400", async () => {
      const bodyData = [
        { email: loginDetails.email },
        { password: loginDetails.password },
        {},
      ];

      for (const body of bodyData) {
        const response = await request(app).post("/auth/login").send(body);

        expect(response.statusCode).toBe(400);
      }
    });
  });
});
