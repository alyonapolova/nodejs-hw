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
  });

  const user = {
    password: "123qwe",
    email: "polova_alyona3@ukr.net",
  };

  test("status code have to be 200", async () => {
    const res = await request(app).post("/users/login").send(user);
    expect(res.status).toBe(200);
  });
});
