const { describe, expect, test, beforeAll } = require("@jest/globals");
const mongoose = require("mongoose");
const app = require("../app");

require("dotenv").config();
mongoose.set("strictQuery", true);

const request = require("supertest");

// ответ должен иметь статус-код 200
// в ответе должен возвращаться токен
// в ответе должен возвращаться объект user с 2 полями
// email и subscription, имеющие тип данных String

describe("test login controller", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_HOST);
    console.log("Test connection");
  });

  const user = {
    password: "123qwe",
    email: "polova_alyona3@ukr.net",
  };

  test("status code should be 200", async () => {
    const res = await request(app).post("/users/login").send(user);
    expect(res.status).toBe(200);
  });

  test("return token", async () => {
    const res = await request(app).post("/users/login").send(user);
    const { body } = res;

    expect(body.token).toBeTruthy();
  });

  test("return object", async () => {
    const res = await request(app).post("/users/login").send(user);

    const { body } = res;

    expect(body).toBeInstanceOf(Object);
  });

  test("email and subscription should be strings", async () => {
    const res = await request(app).post("/users/login").send(user);

    const { body } = res;

    expect(typeof body.user.email).toBe("string");
    expect(typeof body.user.subscription).toBe("string");
  });
});
