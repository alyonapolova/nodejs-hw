const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD, META_USER, META_HOST, META_PORT } = process.env;

const nodemailerConfig = {
  host: META_HOST,
  port: META_PORT,
  secure: true,
  auth: {
    user: META_USER,
    password: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
  to: "@ukr.net",
  from: "polova @ukr.net",
  subject: "Test email",
  html: "<p>Test email</p>",
};

transport
  .sendMail(email)
  .then(() => console.log("Email send successfully"))
  .catch((error) => console.log(error.message));
